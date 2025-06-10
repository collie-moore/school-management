import { NextRequest, NextResponse } from 'next/server'
import { getDashboardStats, getPlatformStats } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const isPlatformOwner = searchParams.get('isPlatformOwner') === 'true'

    if (isPlatformOwner) {
      const stats = await getPlatformStats()
      return NextResponse.json(stats)
    }

    const stats = await getDashboardStats(organizationId || undefined)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
} 