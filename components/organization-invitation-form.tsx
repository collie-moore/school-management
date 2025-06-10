"use client"

import { useState } from "react"
import { Plus, Mail, Building2, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface InvitationFormData {
  email: string
  organizationName: string
  subscription: 'BASIC' | 'PREMIUM' | 'ENTERPRISE'
}

export function OrganizationInvitationForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<InvitationFormData>({
    email: '',
    organizationName: '',
    subscription: 'BASIC'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/organizations/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation')
      }

      setSuccess(`Invitation sent successfully to ${formData.email} for ${formData.organizationName}`)
      setFormData({ email: '', organizationName: '', subscription: 'BASIC' })
      setIsOpen(false)
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof InvitationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getSubscriptionColor = (subscription: string) => {
    const colors = {
      'BASIC': 'bg-gray-100 text-gray-700',
      'PREMIUM': 'bg-blue-100 text-blue-700',
      'ENTERPRISE': 'bg-purple-100 text-purple-700',
    }
    return colors[subscription as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getSubscriptionPrice = (subscription: string) => {
    const prices = {
      'BASIC': '$5/student/month',
      'PREMIUM': '$8/student/month',
      'ENTERPRISE': '$12/student/month',
    }
    return prices[subscription as keyof typeof prices] || '$5/student/month'
  }

  return (
    <div className="space-y-4">
      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Invite Button */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        <Plus className="h-5 w-5 mr-2" />
        Invite New Organization
      </Button>

      {/* Invitation Form */}
      {isOpen && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5" />
              Send Organization Invitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Administrator Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@school.edu"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
                <p className="text-sm text-gray-400">
                  This person will become the organization administrator
                </p>
              </div>

              {/* Organization Name Field */}
              <div className="space-y-2">
                <Label htmlFor="organizationName" className="text-gray-300">Organization/School Name</Label>
                <Input
                  id="organizationName"
                  type="text"
                  placeholder="Lincoln High School"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
                <p className="text-sm text-gray-400">
                  Full name of the school or educational organization
                </p>
              </div>

              {/* Subscription Plan Field */}
              <div className="space-y-2">
                <Label htmlFor="subscription" className="text-gray-300">Subscription Plan</Label>
                <Select
                  value={formData.subscription}
                  onValueChange={(value) => handleInputChange('subscription', value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="BASIC">
                      <div className="flex items-center justify-between w-full">
                        <span>Basic Plan</span>
                        <Badge className={getSubscriptionColor('BASIC')} variant="secondary">
                          {getSubscriptionPrice('BASIC')}
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="PREMIUM">
                      <div className="flex items-center justify-between w-full">
                        <span>Premium Plan</span>
                        <Badge className={getSubscriptionColor('PREMIUM')} variant="secondary">
                          {getSubscriptionPrice('PREMIUM')}
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="ENTERPRISE">
                      <div className="flex items-center justify-between w-full">
                        <span>Enterprise Plan</span>
                        <Badge className={getSubscriptionColor('ENTERPRISE')} variant="secondary">
                          {getSubscriptionPrice('ENTERPRISE')}
                        </Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-400">
                  Choose the appropriate subscription tier for this organization
                </p>
              </div>

              {/* Plan Features */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Plan Features:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  {formData.subscription === 'BASIC' && (
                    <>
                      <li>• Basic dashboard and reporting</li>
                      <li>• Student and teacher management</li>
                      <li>• Class scheduling</li>
                      <li>• Email support</li>
                    </>
                  )}
                  {formData.subscription === 'PREMIUM' && (
                    <>
                      <li>• Advanced analytics and reporting</li>
                      <li>• Parent portal access</li>
                      <li>• Grade tracking and transcripts</li>
                      <li>• Priority support</li>
                      <li>• Custom branding</li>
                    </>
                  )}
                  {formData.subscription === 'ENTERPRISE' && (
                    <>
                      <li>• Full platform customization</li>
                      <li>• API access and integrations</li>
                      <li>• Advanced security features</li>
                      <li>• Dedicated account manager</li>
                      <li>• White-label options</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.email || !formData.organizationName}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 