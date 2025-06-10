import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

// Organization Services
export async function getOrganizations() {
  return await prisma.organization.findMany({
    include: {
      schools: {
        include: {
          students: true,
          _count: {
            select: {
              students: true,
            }
          }
        }
      },
      _count: {
        select: {
          schools: true,
          students: true,
        }
      }
    }
  })
}

export async function getOrganizationBySlug(slug: string) {
  return await prisma.organization.findUnique({
    where: { slug },
    include: {
      schools: {
        include: {
          campuses: true,
          students: true,
        }
      },
      students: true,
    }
  })
}

// User Services
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      organization: true,
    }
  })
}

export async function getUsers(organizationId?: string) {
  return await prisma.user.findMany({
    where: organizationId ? { organizationId } : undefined,
    include: {
      organization: true,
    }
  })
}

// Student Services
export async function getStudents(organizationId?: string, schoolId?: string, campusId?: string) {
  return await prisma.student.findMany({
    where: {
      ...(organizationId && { organizationId }),
      ...(schoolId && { schoolId }),
      ...(campusId && { campusId }),
    },
    include: {
      organization: true,
      school: true,
      campus: true,
      classEnrollments: {
        include: {
          class: {
            include: {
              subject: true,
              teacher: true,
            }
          }
        }
      },
      grades: {
        include: {
          assignment: true,
          class: true,
        }
      }
    }
  })
}

export async function getStudentById(id: string) {
  return await prisma.student.findUnique({
    where: { id },
    include: {
      organization: true,
      school: true,
      campus: true,
      classEnrollments: {
        include: {
          class: {
            include: {
              subject: true,
              teacher: true,
            }
          }
        }
      },
      grades: {
        include: {
          assignment: true,
          class: true,
        }
      }
    }
  })
}

// School Services
export async function getSchools(organizationId?: string) {
  return await prisma.school.findMany({
    where: organizationId ? { organizationId } : undefined,
    include: {
      organization: true,
      campuses: true,
      students: true,
              _count: {
          select: {
            students: true,
            campuses: true,
          }
        }
    }
  })
}

export async function getSchoolBySlug(slug: string) {
  return await prisma.school.findUnique({
    where: { slug },
    include: {
      organization: true,
      campuses: true,
      students: true,
      subjects: true,
      classes: {
        include: {
          subject: true,
          teacher: true,
          studentEnrollments: {
            include: {
              student: true,
            }
          }
        }
      }
    }
  })
}

// Campus Services
export async function getCampuses(organizationId?: string, schoolId?: string) {
  return await prisma.campus.findMany({
    where: {
      ...(organizationId && { organizationId }),
      ...(schoolId && { schoolId }),
    },
    include: {
      organization: true,
      school: true,
      students: true,
      classes: true,
      _count: {
        select: {
          students: true,
          classes: true,
        }
      }
    }
  })
}

// Class Services
export async function getClasses(organizationId?: string, schoolId?: string, campusId?: string, teacherId?: string) {
  return await prisma.class.findMany({
    where: {
      ...(organizationId && { organizationId }),
      ...(schoolId && { schoolId }),
      ...(campusId && { campusId }),
      ...(teacherId && { teacherId }),
    },
    include: {
      organization: true,
      school: true,
      campus: true,
      subject: true,
      teacher: true,
      studentEnrollments: {
        include: {
          student: true,
        }
      },
      assignments: true,
      _count: {
        select: {
          studentEnrollments: true,
          assignments: true,
        }
      }
    }
  })
}

export async function getClassById(id: string) {
  return await prisma.class.findUnique({
    where: { id },
    include: {
      organization: true,
      school: true,
      campus: true,
      subject: true,
      teacher: true,
      studentEnrollments: {
        include: {
          student: true,
        }
      },
      assignments: {
        include: {
          grades: {
            include: {
              student: true,
            }
          }
        }
      }
    }
  })
}

// Assignment Services
export async function getAssignments(organizationId?: string, schoolId?: string, classId?: string, teacherId?: string) {
  return await prisma.assignment.findMany({
    where: {
      ...(organizationId && { organizationId }),
      ...(schoolId && { schoolId }),
      ...(classId && { classId }),
      ...(teacherId && { teacherId }),
    },
    include: {
      organization: true,
      school: true,
      class: {
        include: {
          subject: true,
        }
      },
      teacher: true,
      grades: {
        include: {
          student: true,
        }
      }
    }
  })
}

// Grade Services
export async function getGrades(organizationId?: string, studentId?: string, classId?: string) {
  return await prisma.grade.findMany({
    where: {
      ...(organizationId && { organizationId }),
      ...(studentId && { studentId }),
      ...(classId && { classId }),
    },
    include: {
      student: true,
      assignment: true,
      class: {
        include: {
          subject: true,
        }
      },
      teacher: true,
    }
  })
}

// Dashboard Services
export async function getDashboardStats(organizationId?: string) {
  const whereClause = organizationId ? { organizationId } : {}
  
  const [
    totalStudents,
    totalTeachers,
    totalClasses,
    totalAssignments,
    recentGrades
  ] = await Promise.all([
    prisma.student.count({ where: whereClause }),
    prisma.user.count({ 
      where: { 
        ...whereClause,
        role: 'TEACHER'
      }
    }),
    prisma.class.count({ where: whereClause }),
    prisma.assignment.count({ where: whereClause }),
    prisma.grade.findMany({
      where: whereClause,
      include: {
        student: true,
        assignment: true,
        class: {
          include: {
            subject: true,
          }
        }
      },
      orderBy: {
        gradedAt: 'desc'
      },
      take: 10
    })
  ])

  return {
    totalStudents,
    totalTeachers,
    totalClasses,
    totalAssignments,
    recentGrades
  }
}

// Platform Owner Services (for billing dashboard)
export async function getPlatformStats() {
  const organizations = await prisma.organization.findMany({
    where: {
      NOT: {
        settings: {
          path: ['isPlatformOrg'],
          equals: true
        }
      }
    },
    include: {
      _count: {
        select: {
          students: true,
          schools: true,
        }
      }
    }
  })

  // Calculate revenue based on subscription tiers
  const revenue = organizations.reduce((total, org) => {
    const studentCount = org._count.students
    let monthlyRate = 0
    
    switch (org.subscription) {
      case 'BASIC':
        monthlyRate = studentCount * 5 // $5 per student
        break
      case 'PREMIUM':
        monthlyRate = studentCount * 8 // $8 per student
        break
      case 'ENTERPRISE':
        monthlyRate = studentCount * 12 // $12 per student
        break
    }
    
    return total + monthlyRate
  }, 0)

  return {
    organizations,
    totalRevenue: revenue,
    totalStudents: organizations.reduce((sum, org) => sum + org._count.students, 0),
    totalTeachers: 0, // We'll calculate this differently since we removed user counts
  }
}

// Subject Services
export async function getSubjects(organizationId?: string, schoolId?: string) {
  return await prisma.subject.findMany({
    where: {
      ...(organizationId && { organizationId }),
      ...(schoolId && { schoolId }),
    },
    include: {
      organization: true,
      school: true,
      classes: {
        include: {
          teacher: true,
          _count: {
            select: {
              studentEnrollments: true,
            }
          }
        }
      }
    }
  })
}

export default prisma 