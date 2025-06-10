import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify()
    console.log('Email configuration is valid')
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}

// Generate invitation token
export function generateInvitationToken(email: string, organizationName: string) {
  const payload = {
    email,
    organizationName,
    type: 'organization_invitation',
    createdAt: new Date().toISOString(),
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET!, { 
    expiresIn: '7d' // Token valid for 7 days
  })
}

// Verify invitation token
export function verifyInvitationToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
    return payload
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Email templates
export const emailTemplates = {
  organizationInvitation: (organizationName: string, inviteLink: string) => ({
    subject: `Welcome to ${organizationName} - Complete Your Setup`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Organization Invitation</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e1e5e9; border-top: none; }
            .footer { background: #f8f9fa; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; color: #6c757d; font-size: 14px; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 500; margin: 20px 0; }
            .btn:hover { background: #5a6fd8; }
            .highlight { background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
                         <div class="header">
               <h1>🎓 Welcome to UfanisiPro</h1>
               <p>You've been invited to manage ${organizationName}</p>
             </div>
            
            <div class="content">
              <h2>Complete Your Organization Setup</h2>
                             <p>Congratulations! You've been selected as the administrator for <strong>${organizationName}</strong> on the UfanisiPro School Management Platform.</p>
              
              <div class="highlight">
                <h3>What's Next?</h3>
                <ol>
                  <li>Click the setup button below</li>
                  <li>Create your secure password</li>
                  <li>Access your organization dashboard</li>
                  <li>Start managing your school system</li>
                </ol>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteLink}" class="btn">Complete Setup →</a>
              </div>
              
              <p><strong>Features you'll have access to:</strong></p>
              <ul>
                <li>📊 Complete dashboard with analytics</li>
                <li>👥 Student and teacher management</li>
                <li>📚 Class and curriculum tracking</li>
                <li>📈 Grade and assignment management</li>
                <li>💰 Billing and subscription management</li>
              </ul>
              
              <div class="highlight">
                <p><strong>Security Note:</strong> This invitation link will expire in 7 days for security reasons.</p>
              </div>
            </div>
            
                         <div class="footer">
               <p>If you didn't expect this invitation, please ignore this email.</p>
               <p>© 2025 UfanisiPro by MooreTech. All rights reserved.</p>
               <p><a href="https://www.mooretech.io" style="color: #667eea; text-decoration: none;">www.mooretech.io</a></p>
             </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to ${organizationName}!

 You've been invited to manage ${organizationName} on the UfanisiPro School Management Platform.

Complete your setup: ${inviteLink}

This invitation will expire in 7 days.

If you didn't expect this invitation, please ignore this email.

 © 2025 UfanisiPro by MooreTech
 www.mooretech.io
     `
  })
}

// Send organization invitation email
export async function sendOrganizationInvitation(
  email: string,
  organizationName: string,
  inviterName?: string
) {
  try {
    // Generate invitation token
    const token = generateInvitationToken(email, organizationName)
    const inviteLink = `${process.env.APP_URL || 'http://localhost:3000'}/signup?token=${token}`
    
    // Get email template
    const template = emailTemplates.organizationInvitation(organizationName, inviteLink)
    
    // Send email
    const result = await transporter.sendMail({
      from: `"UfanisiPro" <${process.env.SMTP_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })
    
    console.log('Invitation email sent:', result.messageId)
    return { success: true, messageId: result.messageId, token }
  } catch (error) {
    console.error('Failed to send invitation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Send welcome email after successful signup
export async function sendWelcomeEmail(email: string, organizationName: string, loginUrl: string) {
  try {
    const result = await transporter.sendMail({
      from: `"MooreTech Platform" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Welcome to ${organizationName} - You're All Set!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1>🎉 Welcome to ${organizationName}!</h1>
            <p>Your account has been successfully created</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2>You're Ready to Go!</h2>
            <p>Your organization administrator account for <strong>${organizationName}</strong> is now active.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 500;">Access Dashboard →</a>
            </div>
            
            <p>You can now:</p>
            <ul>
              <li>Manage your organization settings</li>
              <li>Add schools and campuses</li>
              <li>Invite teachers and staff</li>
              <li>Enroll students</li>
              <li>Track academic progress</li>
            </ul>
          </div>
          
                     <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d;">
             <p>Need help? Contact our support team anytime.</p>
             <p>© 2025 UfanisiPro by MooreTech</p>
             <p><a href="https://www.mooretech.io" style="color: #667eea; text-decoration: none;">www.mooretech.io</a></p>
           </div>
        </div>
      `,
    })
    
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
} 