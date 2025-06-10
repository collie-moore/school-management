import { NextRequest, NextResponse } from 'next/server'
import { getStudents } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const schoolId = searchParams.get('schoolId')
    const campusId = searchParams.get('campusId')

    const students = await getStudents(
      organizationId || undefined,
      schoolId || undefined,
      campusId || undefined
    )
    
    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
} 