# 📧 Email Configuration Setup

## Gmail SMTP Configuration

To enable organization invitations via email, you need to configure Gmail SMTP settings.

### 1. Environment Variables

Add these variables to your `.env` file:

```env
# Database
DATABASE_URL="your-supabase-database-url"

# JWT Secret for invitation tokens
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-1234567890"

# Gmail SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-gmail-app-password"

# Application
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
APP_NAME="MooreTech School Management"
APP_URL="http://localhost:3000"
```

### 2. Gmail App Password Setup

To use Gmail SMTP, you need to create an **App Password** (not your regular Gmail password):

#### Step 1: Enable 2-Factor Authentication
1. Go to [Gmail Account Settings](https://myaccount.google.com)
2. Click on **Security**
3. Enable **2-Step Verification** if not already enabled

#### Step 2: Create App Password
1. In Security settings, find **App passwords**
2. Click **Generate new app password**
3. Select **Mail** as the app
4. Select **Other** as the device and name it "School Management System"
5. Copy the generated 16-character password
6. Use this password in the `SMTP_PASS` environment variable

### 3. Testing Email Configuration

The system includes email verification. You can test it by:

1. **Start the application**: `pnpm dev`
2. **Login as Platform Owner**: `admin@mooretech.io` / `Muddyboots@2050!`
3. **Use the "Invite New Organization" button**
4. **Fill the form** with a real email address
5. **Check the email** for the invitation

### 4. Email Flow

The complete email invitation flow works as follows:

1. **Platform Owner** fills invitation form
2. **System creates** pending organization in database
3. **Invitation email** sent with secure token (7-day expiry)
4. **Recipient clicks** invitation link
5. **Token verified** and signup form shown
6. **Account created** and organization activated
7. **Welcome email** sent with login instructions

### 5. Email Templates

The system includes professional email templates with:

- ✅ **Responsive design** for all devices
- ✅ **Professional branding** with gradients
- ✅ **Security notices** about token expiry
- ✅ **Feature highlights** for each subscription tier
- ✅ **Call-to-action** buttons
- ✅ **Plain text fallback** for accessibility

### 6. Security Features

- 🔒 **JWT tokens** with 7-day expiry
- 🔒 **Secure password hashing** with bcrypt
- 🔒 **Email verification** before account creation
- 🔒 **Duplicate prevention** for emails and organizations
- 🔒 **Transaction safety** for database operations

### 7. Troubleshooting

#### Common Issues:

**"Authentication failed"**
- Verify App Password is correct (16 characters)
- Ensure 2FA is enabled on Gmail account
- Check `SMTP_USER` matches the Gmail account

**"Connection refused"**
- Verify `SMTP_HOST` and `SMTP_PORT` are correct
- Check network/firewall settings
- Ensure Gmail allows less secure apps (if needed)

**"Token verification failed"**
- Check `JWT_SECRET` is set and consistent
- Verify token hasn't expired (7 days)
- Ensure invitation link is complete

### 8. Production Considerations

For production deployment:

1. **Use environment-specific secrets**
2. **Configure proper domain** in `APP_URL`
3. **Set up email monitoring** for delivery rates
4. **Consider email service providers** like SendGrid for scale
5. **Implement rate limiting** for invitation sending
6. **Add email delivery webhooks** for status tracking

### 9. Alternative Email Providers

You can also configure other SMTP providers:

#### SendGrid
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

#### Mailgun
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="your-mailgun-user"
SMTP_PASS="your-mailgun-password"
```

#### AWS SES
```env
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your-ses-access-key"
SMTP_PASS="your-ses-secret-key"
``` 