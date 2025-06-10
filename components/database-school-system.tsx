"use client"

import { useState, useEffect } from "react"
import { 
  Crown, 
  Building2, 
  School, 
  Users, 
  BookOpen, 
  BarChart3,
  GraduationCap,
  Home,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrganizationInvitationForm } from "@/components/organization-invitation-form"
import { UfanisiLogo } from "@/components/ui/ufanisi-logo"

// Types matching our Prisma schema
interface User {
  id: string
  name: string
  email: string
  role: string
  organizationId: string
  organization: {
    id: string
    name: string
    slug: string
    primaryColor?: string
    secondaryColor?: string
    subscription: string
  }
}

interface Organization {
  id: string
  name: string
  slug: string
  primaryColor?: string
  secondaryColor?: string
  subscription: string
  _count: {
    students: number
    users: number
    schools: number
  }
}

interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  totalAssignments: number
}

interface PlatformStats {
  organizations: Organization[]
  totalRevenue: number
  totalStudents: number
  totalTeachers: number
}

export function DatabaseSchoolSystem() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | PlatformStats | null>(null)
  
  // Login form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Pre-fill demo accounts
  const demoAccounts = [
    { email: "admin@mooretech.io", password: "Muddyboots@2050!", role: "Platform Owner" },
    { email: "sarah.wilson@lincoln.edu", password: "password123", role: "Org Admin" },
    { email: "emily.rodriguez@lincoln.edu", password: "password123", role: "School Principal" },
    { email: "sarah.johnson@lincoln.edu", password: "password123", role: "Teacher" },
    { email: "michael.thompson@roosevelt.edu", password: "password123", role: "Org Admin" },
    { email: "lisa.chen@intlacademy.edu", password: "password123", role: "Org Admin" },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      setUser(data.user)
      
      // Fetch dashboard stats based on user role
      await fetchDashboardStats(data.user)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDashboardStats = async (currentUser: User) => {
    try {
      const isPlatformOwner = currentUser.role === 'PLATFORM_OWNER'
      const url = `/api/dashboard/stats?${isPlatformOwner ? 'isPlatformOwner=true' : `organizationId=${currentUser.organizationId}`}`
      
      const response = await fetch(url)
      const stats = await response.json()
      
      setDashboardStats(stats)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setDashboardStats(null)
    setEmail("")
    setPassword("")
    setError("")
  }

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  const getRoleColor = (role: string) => {
    const colors = {
      'PLATFORM_OWNER': 'bg-gray-900 text-white',
      'ORG_ADMIN': 'bg-blue-100 text-blue-700',
      'SCHOOL_PRINCIPAL': 'bg-indigo-100 text-indigo-700',
      'TEACHER': 'bg-green-100 text-green-700',
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getRoleIcon = (role: string) => {
    const icons = {
      'PLATFORM_OWNER': <Crown className="h-4 w-4" />,
      'ORG_ADMIN': <Building2 className="h-4 w-4" />,
      'SCHOOL_PRINCIPAL': <School className="h-4 w-4" />,
      'TEACHER': <GraduationCap className="h-4 w-4" />,
    }
    return icons[role as keyof typeof icons] || <Users className="h-4 w-4" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getSubscriptionColor = (subscription: string) => {
    const colors = {
      'BASIC': 'bg-gray-100 text-gray-700',
      'PREMIUM': 'bg-blue-100 text-blue-700',
      'ENTERPRISE': 'bg-purple-100 text-purple-700',
    }
    return colors[subscription as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <UfanisiLogo size="xl" variant="icon" />
            </div>
                          <h1 className="text-3xl font-bold text-gray-900">UfanisiPro</h1>
            <p className="text-gray-600 mt-2">Efficient School Management</p>
          </div>

          <Card className="rounded-3xl shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="rounded-2xl"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="rounded-2xl pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator className="my-4" />
                <p className="text-sm text-gray-600 text-center mb-3">Demo Accounts</p>
                <div className="grid grid-cols-1 gap-2">
                  {demoAccounts.map((account, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left rounded-xl h-auto p-2"
                      onClick={() => fillDemoAccount(account)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {getRoleIcon(account.role.toUpperCase().replace(' ', '_'))}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{account.role}</div>
                          <div className="text-xs text-gray-500 truncate">{account.email}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div 
                className="p-2 rounded-xl text-white"
                style={{ backgroundColor: user.organization.primaryColor || '#3B82F6' }}
              >
                <School className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {user.role === 'PLATFORM_OWNER' ? 'UfanisiPro' : user.organization.name}
                </h1>
                                  <p className="text-sm text-gray-500">Platform Administrator</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge className={`${getRoleColor(user.role)} rounded-xl`}>
                {getRoleIcon(user.role)}
                <span className="ml-1">{user.role.replace('_', ' ')}</span>
              </Badge>
              
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">
            {user.role === 'PLATFORM_OWNER' 
              ? 'Monitor all organizations and manage platform-wide operations.'
              : `Manage your ${user.organization.name} operations and data.`
            }
          </p>
        </div>

        {/* Platform Owner Dashboard */}
        {user.role === 'PLATFORM_OWNER' && dashboardStats && 'organizations' in dashboardStats && (
          <div className="space-y-6">
            {/* Platform Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Organizations</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.organizations.length}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalStudents}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalTeachers}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardStats.totalRevenue)}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-amber-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

                      {/* Organization Invitation Form */}
          <OrganizationInvitationForm />

          {/* Organizations Table */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Organization Overview
              </CardTitle>
            </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 font-semibold text-gray-600">Organization</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Subscription</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Schools</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Students</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Teachers</th>
                        <th className="text-left p-4 font-semibold text-gray-600">Monthly Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.organizations.map((org) => {
                        const revenue = (() => {
                          const studentCount = org._count.students
                          switch (org.subscription) {
                            case 'BASIC': return studentCount * 5
                            case 'PREMIUM': return studentCount * 8
                            case 'ENTERPRISE': return studentCount * 12
                            default: return 0
                          }
                        })()

                        return (
                          <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                                  style={{ backgroundColor: org.primaryColor || '#3B82F6' }}
                                >
                                  {org.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{org.name}</p>
                                  <p className="text-sm text-gray-500">{org.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={`${getSubscriptionColor(org.subscription)} rounded-xl`}>
                                {org.subscription}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <span className="font-medium">{org._count.schools}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-medium">{org._count.students}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-medium">{org._count.users}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-medium text-green-600">{formatCurrency(revenue)}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Regular User Dashboard */}
        {user.role !== 'PLATFORM_OWNER' && dashboardStats && 'totalStudents' in dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Students</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalStudents}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Teachers</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalTeachers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Classes</p>
                    <p className="text-2xl font-bold text-gray-900">{(dashboardStats as DashboardStats).totalClasses}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">{(dashboardStats as DashboardStats).totalAssignments}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Organization Info for Non-Platform Users */}
        {user.role !== 'PLATFORM_OWNER' && (
          <Card className="rounded-2xl mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Organization Name</Label>
                  <p className="text-lg font-semibold mt-1">{user.organization.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Subscription Plan</Label>
                  <div className="mt-1">
                    <Badge className={`${getSubscriptionColor(user.organization.subscription)} rounded-xl`}>
                      {user.organization.subscription}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Organization ID</Label>
                  <p className="text-sm text-gray-500 mt-1 font-mono">{user.organization.slug}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
} 