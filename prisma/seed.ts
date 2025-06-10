import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.grade.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.classStudent.deleteMany()
  await prisma.class.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.student.deleteMany()
  await prisma.user.deleteMany()
  await prisma.campus.deleteMany()
  await prisma.school.deleteMany()
  await prisma.organization.deleteMany()

  // 1. Create Organizations (Each school is its own organization)
  console.log('🏢 Creating organizations...')
  
  const lincolnOrg = await prisma.organization.create({
    data: {
      name: 'Lincoln High School',
      slug: 'lincoln-high',
      logo: '/placeholder.svg?height=40&width=40',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      domain: 'lincoln.edu',
      subscription: 'ENTERPRISE',
      settings: {
        timezone: 'UTC',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'en',
      },
    },
  })

  const rooseveltOrg = await prisma.organization.create({
    data: {
      name: 'Roosevelt Elementary',
      slug: 'roosevelt-elem',
      logo: '/placeholder.svg?height=40&width=40',
      primaryColor: '#10B981',
      secondaryColor: '#047857',
      domain: 'roosevelt.edu',
      subscription: 'PREMIUM',
      settings: {
        timezone: 'UTC',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'en',
      },
    },
  })

  const internationalOrg = await prisma.organization.create({
    data: {
      name: 'International Academy',
      slug: 'intl-academy',
      logo: '/placeholder.svg?height=40&width=40',
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      domain: 'intlacademy.edu',
      subscription: 'BASIC',
      settings: {
        timezone: 'UTC',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'en',
      },
    },
  })

  const sunshineOrg = await prisma.organization.create({
    data: {
      name: 'Sunshine Preschool',
      slug: 'sunshine-preschool',
      logo: '/placeholder.svg?height=40&width=40',
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626',
      domain: 'sunshine.edu',
      subscription: 'BASIC',
      settings: {
        timezone: 'PST',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'en',
      },
    },
  })

  const techValleyOrg = await prisma.organization.create({
    data: {
      name: 'Tech Valley High',
      slug: 'tech-valley',
      logo: '/placeholder.svg?height=40&width=40',
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      domain: 'techvalley.edu',
      subscription: 'PREMIUM',
      settings: {
        timezone: 'PST',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'en',
      },
    },
  })

  // 2. Create Schools
  console.log('🏫 Creating schools...')
  
  const lincolnSchool = await prisma.school.create({
    data: {
      organizationId: lincolnOrg.id,
      name: 'Lincoln High School Main',
      slug: 'lincoln-main',
      logo: '/placeholder.svg?height=40&width=40',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      address: '123 Education St, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'main@lincoln.edu',
      website: 'lincoln.edu',
      settings: {
        academicYear: '2024-2025',
        gradeSystem: 'A-F',
        currency: 'USD',
        timezone: 'EST',
      },
    },
  })

  const rooseveltSchool = await prisma.school.create({
    data: {
      organizationId: rooseveltOrg.id,
      name: 'Roosevelt Elementary',
      slug: 'roosevelt-main',
      address: '456 Learning Ave, Boston, MA 02101',
      phone: '+1 (555) 234-5678',
      email: 'info@roosevelt.edu',
      settings: {
        academicYear: '2024-2025',
        gradeSystem: 'A-F',
      },
    },
  })

  const internationalSchool = await prisma.school.create({
    data: {
      organizationId: internationalOrg.id,
      name: 'International Academy',
      slug: 'intl-main',
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      address: '789 Global Blvd, Chicago, IL 60601',
      phone: '+1 (555) 345-6789',
      email: 'info@intlacademy.edu',
      settings: {
        academicYear: '2024-2025',
        gradeSystem: 'IB',
      },
    },
  })

  const sunshineSchool = await prisma.school.create({
    data: {
      organizationId: sunshineOrg.id,
      name: 'Sunshine Preschool',
      slug: 'sunshine-main',
      address: '321 Sunny Lane, Los Angeles, CA 90210',
      phone: '+1 (555) 456-7890',
      email: 'info@sunshine.edu',
      settings: {
        academicYear: '2024-2025',
        gradeSystem: 'Pass/Fail',
      },
    },
  })

  const techValleySchool = await prisma.school.create({
    data: {
      organizationId: techValleyOrg.id,
      name: 'Tech Valley High',
      slug: 'techvalley-main',
      address: '567 Innovation Dr, San Francisco, CA 94102',
      phone: '+1 (555) 567-8901',
      email: 'info@techvalley.edu',
      settings: {
        academicYear: '2024-2025',
        gradeSystem: 'A-F',
      },
    },
  })

  // 3. Create Campuses
  console.log('🏛️ Creating campuses...')
  
  const lincolnMainCampus = await prisma.campus.create({
    data: {
      schoolId: lincolnSchool.id,
      organizationId: lincolnOrg.id,
      name: 'Main Campus',
      slug: 'main',
      address: '123 Education St, New York, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'main@lincoln.edu',
      capacity: 1200,
      grades: ['9', '10', '11', '12'],
    },
  })

  const lincolnNorthCampus = await prisma.campus.create({
    data: {
      schoolId: lincolnSchool.id,
      organizationId: lincolnOrg.id,
      name: 'North Campus',
      slug: 'north',
      address: '789 North St, New York, NY 10002',
      phone: '+1 (555) 123-4568',
      email: 'north@lincoln.edu',
      capacity: 800,
      grades: ['9', '10'],
    },
  })

  const rooseveltCampus = await prisma.campus.create({
    data: {
      schoolId: rooseveltSchool.id,
      organizationId: rooseveltOrg.id,
      name: 'Elementary Campus',
      slug: 'elementary',
      address: '456 Learning Ave, Boston, MA 02101',
      phone: '+1 (555) 234-5678',
      email: 'elem@roosevelt.edu',
      capacity: 600,
      grades: ['K', '1', '2', '3', '4', '5'],
    },
  })

  // Create campuses for other schools
  const internationalCampus = await prisma.campus.create({
    data: {
      schoolId: internationalSchool.id,
      organizationId: internationalOrg.id,
      name: 'Main Campus',
      slug: 'main-intl',
      address: '789 Global Blvd, Chicago, IL 60601',
      phone: '+1 (555) 345-6789',
      email: 'main@intlacademy.edu',
      capacity: 400,
      grades: ['6', '7', '8', '9', '10', '11', '12'],
    },
  })

  const sunshineCampus = await prisma.campus.create({
    data: {
      schoolId: sunshineSchool.id,
      organizationId: sunshineOrg.id,
      name: 'Preschool Campus',
      slug: 'preschool',
      address: '321 Sunny Lane, Los Angeles, CA 90210',
      phone: '+1 (555) 456-7890',
      email: 'preschool@sunshine.edu',
      capacity: 200,
      grades: ['Pre-K', 'K'],
    },
  })

  const techValleyCampus = await prisma.campus.create({
    data: {
      schoolId: techValleySchool.id,
      organizationId: techValleyOrg.id,
      name: 'Innovation Campus',
      slug: 'innovation',
      address: '567 Innovation Dr, San Francisco, CA 94102',
      phone: '+1 (555) 567-8901',
      email: 'innovation@techvalley.edu',
      capacity: 1000,
      grades: ['9', '10', '11', '12'],
    },
  })

  // 4. Create Users (including Platform Owner)
  console.log('👥 Creating users...')
  
  // Create a special platform organization for the platform owner
  const platformOrg = await prisma.organization.create({
    data: {
      name: 'UfanisiPro Platform',
      slug: 'mooretech-platform',
      logo: '/placeholder.svg?height=40&width=40',
      primaryColor: '#000000',
      secondaryColor: '#1F2937',
      domain: 'mooretech.io',
      subscription: 'ENTERPRISE',
      settings: {
        timezone: 'UTC',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        language: 'en',
        isPlatformOrg: true,
      },
    },
  })
  
  // Platform Owner
  const platformOwner = await prisma.user.create({
    data: {
      name: 'Amdava MC',
      email: 'admin@mooretech.io',
      password: await bcrypt.hash('Muddyboots@2050!', 10),
      role: 'PLATFORM_OWNER',
      organizationId: platformOrg.id,
      permissions: ['view_all_organizations', 'manage_billing', 'platform_analytics', 'super_admin'],
    },
  })

  // Lincoln High School Users
  const lincolnAdmin = await prisma.user.create({
    data: {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@lincoln.edu',
      password: await bcrypt.hash('password123', 10),
      role: 'ORG_ADMIN',
      organizationId: lincolnOrg.id,
      permissions: ['manage_organization', 'view_organization_data', 'manage_staff'],
    },
  })

  const lincolnPrincipal = await prisma.user.create({
    data: {
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@lincoln.edu',
      password: await bcrypt.hash('password123', 10),
      role: 'SCHOOL_PRINCIPAL',
      organizationId: lincolnOrg.id,
      permissions: ['manage_school', 'view_school_finances', 'manage_staff'],
    },
  })

  const lincolnTeacher = await prisma.user.create({
    data: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@lincoln.edu',
      password: await bcrypt.hash('password123', 10),
      role: 'TEACHER',
      organizationId: lincolnOrg.id,
      permissions: ['view_classes', 'manage_assignments', 'grade_students', 'communicate_parents'],
    },
  })

  // Roosevelt Elementary Users
  const rooseveltAdmin = await prisma.user.create({
    data: {
      name: 'Michael Thompson',
      email: 'michael.thompson@roosevelt.edu',
      password: await bcrypt.hash('password123', 10),
      role: 'ORG_ADMIN',
      organizationId: rooseveltOrg.id,
      permissions: ['manage_organization', 'view_organization_data', 'manage_staff'],
    },
  })

  // International Academy Users
  const internationalAdmin = await prisma.user.create({
    data: {
      name: 'Lisa Chen',
      email: 'lisa.chen@intlacademy.edu',
      password: await bcrypt.hash('password123', 10),
      role: 'ORG_ADMIN',
      organizationId: internationalOrg.id,
      permissions: ['manage_organization', 'view_organization_data', 'manage_staff'],
    },
  })

  // 5. Create Subjects
  console.log('📚 Creating subjects...')
  
  const mathSubject = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      code: 'MATH',
      description: 'General Mathematics',
      organizationId: lincolnOrg.id,
      schoolId: lincolnSchool.id,
    },
  })

  const englishSubject = await prisma.subject.create({
    data: {
      name: 'English Literature',
      code: 'ENG',
      description: 'English Language and Literature',
      organizationId: lincolnOrg.id,
      schoolId: lincolnSchool.id,
    },
  })

  const scienceSubject = await prisma.subject.create({
    data: {
      name: 'Science',
      code: 'SCI',
      description: 'General Science',
      organizationId: rooseveltOrg.id,
      schoolId: rooseveltSchool.id,
    },
  })

  // 6. Create Students
  console.log('🎓 Creating students...')
  
  const student1 = await prisma.student.create({
    data: {
      firstName: 'Alex',
      lastName: 'Chen',
      email: 'alex.chen@student.lincoln.edu',
      studentId: 'LHS001',
      grade: '11',
      dateOfBirth: new Date('2007-05-15'),
      enrollmentDate: new Date('2022-09-01'),
      organizationId: lincolnOrg.id,
      schoolId: lincolnSchool.id,
      campusId: lincolnMainCampus.id,
      guardianName: 'Maria Chen',
      guardianEmail: 'maria.chen@parent.com',
      guardianPhone: '+1 (555) 111-1111',
    },
  })

  const student2 = await prisma.student.create({
    data: {
      firstName: 'Emma',
      lastName: 'Rodriguez',
      email: 'emma.rodriguez@student.lincoln.edu',
      studentId: 'LHS002',
      grade: '10',
      dateOfBirth: new Date('2008-08-22'),
      enrollmentDate: new Date('2023-09-01'),
      organizationId: lincolnOrg.id,
      schoolId: lincolnSchool.id,
      campusId: lincolnMainCampus.id,
      guardianName: 'Carlos Rodriguez',
      guardianEmail: 'carlos.rodriguez@parent.com',
      guardianPhone: '+1 (555) 222-2222',
    },
  })

  const student3 = await prisma.student.create({
    data: {
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@student.roosevelt.edu',
      studentId: 'RES001',
      grade: '5',
      dateOfBirth: new Date('2013-03-10'),
      enrollmentDate: new Date('2023-09-01'),
      organizationId: rooseveltOrg.id,
      schoolId: rooseveltSchool.id,
      campusId: rooseveltCampus.id,
      guardianName: 'Jennifer Wilson',
      guardianEmail: 'jennifer.wilson@parent.com',
      guardianPhone: '+1 (555) 333-3333',
    },
  })

  // 7. Create Classes
  console.log('🏫 Creating classes...')
  
  const mathClass = await prisma.class.create({
    data: {
      name: 'Mathematics 11A',
      code: 'MATH11A',
      description: 'Advanced Mathematics for Grade 11',
      organizationId: lincolnOrg.id,
      schoolId: lincolnSchool.id,
      campusId: lincolnMainCampus.id,
      subjectId: mathSubject.id,
      teacherId: lincolnTeacher.id,
      grade: '11',
      academicYear: '2024-2025',
      semester: 'Fall 2024',
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '09:00',
        endTime: '10:30',
        room: 'Room 101',
      },
      maxStudents: 30,
    },
  })

  const englishClass = await prisma.class.create({
    data: {
      name: 'English Literature 11B',
      code: 'ENG11B',
      description: 'English Literature for Grade 11',
      organizationId: lincolnOrg.id,
      schoolId: lincolnSchool.id,
      campusId: lincolnMainCampus.id,
      subjectId: englishSubject.id,
      teacherId: lincolnTeacher.id,
      grade: '11',
      academicYear: '2024-2025',
      semester: 'Fall 2024',
      schedule: {
        days: ['Tuesday', 'Thursday'],
        startTime: '11:00',
        endTime: '12:30',
        room: 'Room 201',
      },
      maxStudents: 25,
    },
  })

  // 8. Enroll Students in Classes
  console.log('📝 Enrolling students in classes...')
  
  await prisma.classStudent.create({
    data: {
      classId: mathClass.id,
      studentId: student1.id,
      enrollmentDate: new Date('2024-09-01'),
    },
  })

  await prisma.classStudent.create({
    data: {
      classId: englishClass.id,
      studentId: student1.id,
      enrollmentDate: new Date('2024-09-01'),
    },
  })

  // 9. Create Assignments
  console.log('📋 Creating assignments...')
  
  const mathAssignment = await prisma.assignment.create({
    data: {
      title: 'Quadratic Equations Problem Set',
      description: 'Solve the given quadratic equations using various methods',
      classId: mathClass.id,
      teacherId: lincolnTeacher.id,
      organizationId: lincolnOrg.id,
      schoolId: lincolnSchool.id,
      dueDate: new Date('2024-02-15'),
      totalPoints: 100,
      type: 'HOMEWORK',
    },
  })

  const englishAssignment = await prisma.assignment.create({
    data: {
      title: 'Shakespeare Essay',
      description: 'Write a 1000-word essay analyzing themes in Hamlet',
      classId: englishClass.id,
      teacherId: lincolnTeacher.id,
      organizationId: lincolnOrg.id,
      schoolId: lincolnSchool.id,
      dueDate: new Date('2024-02-20'),
      totalPoints: 100,
      type: 'ESSAY',
    },
  })

  // 10. Create Grades
  console.log('📊 Creating grades...')
  
  await prisma.grade.create({
    data: {
      studentId: student1.id,
      assignmentId: mathAssignment.id,
      classId: mathClass.id,
      teacherId: lincolnTeacher.id,
      organizationId: lincolnOrg.id,
      schoolId: lincolnSchool.id,
      points: 85,
      letterGrade: 'B+',
      comments: 'Good understanding of quadratic equations. Work on showing more steps.',
    },
  })

  await prisma.grade.create({
    data: {
      studentId: student1.id,
      assignmentId: englishAssignment.id,
      classId: englishClass.id,
      teacherId: lincolnTeacher.id,
      organizationId: lincolnOrg.id,
      schoolId: lincolnSchool.id,
      points: 92,
      letterGrade: 'A-',
      comments: 'Excellent analysis of themes. Strong writing style.',
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`
📊 Summary:
  - Organizations: 6 (including UfanisiPro Platform)
- Schools: 5  
- Campuses: 6
- Users: 6 (including Platform Owner: Amdava MC)
- Students: 3
- Subjects: 3
- Classes: 2
- Assignments: 2
- Grades: 2
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 