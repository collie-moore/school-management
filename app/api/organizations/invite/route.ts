import { NextRequest, NextResponse } from 'next/server'
import { sendOrganizationInvitation } from '@/lib/email'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, organizationName, subscription = 'BASIC' } = await request.json()

    // Validate required fields
    if (!email || !organizationName) {
      return NextResponse.json(
        { error: 'Email and organization name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if organization already exists
    const existingOrg = await prisma.organization.findFirst({
      where: {
        OR: [
          { name: organizationName },
          { slug: organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-') }
        ]
      }
    })

    if (existingOrg) {
      return NextResponse.json(
        { error: 'An organization with this name already exists' },
        { status: 409 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    // Send invitation email
    const emailResult = await sendOrganizationInvitation(email, organizationName)

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send invitation email', details: emailResult.error },
        { status: 500 }
      )
    }

    // Store pending invitation in database (optional - for tracking)
    await prisma.organization.create({
      data: {
        name: organizationName,
        slug: organizationName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        subscription,
        settings: {
          pendingInvitation: true,
          invitedEmail: email,
          invitationToken: emailResult.token,
          invitedAt: new Date().toISOString(),
        }
      }
    })

    return NextResponse.json({
      message: 'Invitation sent successfully',
      email,
      organizationName,
      messageId: emailResult.messageId,
    })

  } catch (error) {
    console.error('Organization invitation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 