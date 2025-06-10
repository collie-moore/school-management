import { NextRequest, NextResponse } from 'next/server'
import { verifyInvitationToken, sendWelcomeEmail } from '@/lib/email'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password, name } = await request.json()

    // Validate required fields
    if (!token || !password || !name) {
      return NextResponse.json(
        { error: 'Token, password, and name are required' },
        { status: 400 }
      )
    }

    // Verify invitation token
    const payload = verifyInvitationToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation token' },
        { status: 400 }
      )
    }

    const { email, organizationName } = payload

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Find the organization (should exist from invitation)
    const organization = await prisma.organization.findFirst({
      where: {
        name: organizationName,
        settings: {
          path: ['pendingInvitation'],
          equals: true
        }
      }
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found or invitation already completed' },
        { status: 404 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and update organization in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'ORG_ADMIN',
          organizationId: organization.id,
        },
        include: {
          organization: true,
        }
      })

      // Update organization to mark invitation as completed
      const updatedOrg = await tx.organization.update({
        where: { id: organization.id },
        data: {
          settings: {
            ...(organization.settings as object || {}),
            pendingInvitation: false,
            completedAt: new Date().toISOString(),
          }
        }
      })

      return { user, organization: updatedOrg }
    })

    // Send welcome email
    const loginUrl = `${process.env.APP_URL || 'http://localhost:3000'}`
    await sendWelcomeEmail(email, organizationName, loginUrl)

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        organization: {
          id: result.organization.id,
          name: result.organization.name,
          slug: result.organization.slug,
        }
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to verify token and get organization details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Verify token
    const payload = verifyInvitationToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation token' },
        { status: 400 }
      )
    }

    const { email, organizationName, createdAt } = payload

    // Check if organization exists and is still pending
    const organization = await prisma.organization.findFirst({
      where: {
        name: organizationName,
        settings: {
          path: ['pendingInvitation'],
          equals: true
        }
      }
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Invitation has already been completed or expired' },
        { status: 410 }
      )
    }

    return NextResponse.json({
      valid: true,
      email,
      organizationName,
      createdAt,
      organization: {
        id: organization.id,
        name: organization.name,
        subscription: organization.subscription,
      }
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 