export interface Organization {
  id: string
  name: string
  slug: string
  logo?: string
  primaryColor: string
  secondaryColor: string
  domain?: string
  subscription: "basic" | "premium" | "enterprise"
  createdAt: string
  settings: {
    timezone: string
    currency: string
    dateFormat: string
    language: string
  }
}

export interface School {
  id: string
  organizationId: string
  name: string
  slug: string
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  address: string
  phone: string
  email: string
  website?: string
  principalId?: string
  settings: {
    academicYear: string
    gradeSystem: string
    currency?: string
    timezone?: string
  }
  isActive: boolean
}

export interface Campus {
  id: string
  schoolId: string
  organizationId: string
  name: string
  slug: string
  address: string
  phone: string
  email: string
  principalId?: string
  capacity: number
  grades: string[]
  isActive: boolean
}

export interface TenantContext {
  organization: Organization
  school?: School
  campus?: Campus
  userRole: UserRole
  permissions: string[]
}

export type UserRole =
  | "platform_owner" // Platform owner - can see all organizations for billing
  | "org_admin" // Organization level admin (single org only)
  | "org_finance" // Organization level finance
  | "school_principal" // School level principal
  | "school_admin" // School level admin
  | "school_finance" // School level finance
  | "campus_principal" // Campus level principal
  | "campus_admin" // Campus level admin
  | "teacher" // Campus level teacher
  | "student" // Campus level student
  | "parent" // Campus level parent
  | "accounts" // Multi-level accounts

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  organizationId: string // Platform owners have access to all orgs
  schoolIds: string[] // Schools user has access to
  campusIds: string[] // Campuses user has access to
  permissions: string[]
  isActive: boolean
}

// Billing-focused organization overview for platform owner
export interface OrganizationBilling {
  id: string
  name: string
  subscription: "basic" | "premium" | "enterprise"
  createdAt: string
  lastActivityAt: string
  schoolCount: number
  campusCount: number
  studentCount: number
  teacherCount: number
  activeUsers: number
  monthlyRevenue: number
  status: "active" | "suspended" | "trial"
}
