"use client"

import { useState } from "react"
import { Check, ChevronDown, Building2, School, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Organization, School as SchoolType, Campus, TenantContext } from "@/types/tenant"

interface TenantSelectorProps {
  tenantContext: TenantContext
  organizations: Organization[]
  schools: SchoolType[]
  campuses: Campus[]
  onTenantChange: (context: Partial<TenantContext>) => void
}

export function TenantSelector({
  tenantContext,
  organizations,
  schools,
  campuses,
  onTenantChange,
}: TenantSelectorProps) {
  const [open, setOpen] = useState(false)

  const currentOrg = tenantContext.organization
  const currentSchool = tenantContext.school
  const currentCampus = tenantContext.campus

  const availableSchools = schools.filter((school) => school.organizationId === currentOrg.id)
  const availableCampuses = campuses.filter(
    (campus) => campus.organizationId === currentOrg.id && (!currentSchool || campus.schoolId === currentSchool.id),
  )

  const canSelectOrganization = tenantContext.userRole === "org_admin" || tenantContext.userRole === "org_finance"
  const canSelectSchool = ["org_admin", "org_finance", "school_principal", "school_admin", "school_finance"].includes(
    tenantContext.userRole,
  )
  const canSelectCampus = !["org_admin", "org_finance"].includes(tenantContext.userRole)

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {/* Organization Selector */}
      {canSelectOrganization && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between rounded-2xl min-w-[200px]">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="truncate">{currentOrg.name}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 rounded-2xl">
            <Command>
              <CommandInput placeholder="Search organizations..." />
              <CommandList>
                <CommandEmpty>No organizations found.</CommandEmpty>
                <CommandGroup>
                  {organizations.map((org) => (
                    <CommandItem
                      key={org.id}
                      value={org.name}
                      onSelect={() => {
                        onTenantChange({
                          organization: org,
                          school: undefined,
                          campus: undefined,
                        })
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: org.primaryColor }} />
                        <div className="flex-1">
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-muted-foreground">{org.domain}</p>
                        </div>
                        <Check className={cn("h-4 w-4", currentOrg.id === org.id ? "opacity-100" : "opacity-0")} />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* School Selector */}
      {canSelectSchool && availableSchools.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between rounded-2xl min-w-[200px]">
              <div className="flex items-center gap-2">
                <School className="h-4 w-4" />
                <span className="truncate">{currentSchool?.name || "All Schools"}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 rounded-2xl">
            <Command>
              <CommandInput placeholder="Search schools..." />
              <CommandList>
                <CommandEmpty>No schools found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all-schools"
                    onSelect={() => {
                      onTenantChange({
                        school: undefined,
                        campus: undefined,
                      })
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <School className="h-4 w-4" />
                      <div className="flex-1">
                        <p className="font-medium">All Schools</p>
                        <p className="text-sm text-muted-foreground">Organization-wide view</p>
                      </div>
                      <Check className={cn("h-4 w-4", !currentSchool ? "opacity-100" : "opacity-0")} />
                    </div>
                  </CommandItem>
                  {availableSchools.map((school) => (
                    <CommandItem
                      key={school.id}
                      value={school.name}
                      onSelect={() => {
                        onTenantChange({
                          school,
                          campus: undefined,
                        })
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: school.primaryColor || currentOrg.primaryColor }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{school.name}</p>
                          <p className="text-sm text-muted-foreground">{school.address}</p>
                        </div>
                        <Check
                          className={cn("h-4 w-4", currentSchool?.id === school.id ? "opacity-100" : "opacity-0")}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* Campus Selector */}
      {canSelectCampus && availableCampuses.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-between rounded-2xl min-w-[200px]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{currentCampus?.name || "All Campuses"}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 rounded-2xl">
            <Command>
              <CommandInput placeholder="Search campuses..." />
              <CommandList>
                <CommandEmpty>No campuses found.</CommandEmpty>
                <CommandGroup>
                  {currentSchool && (
                    <CommandItem
                      value="all-campuses"
                      onSelect={() => {
                        onTenantChange({ campus: undefined })
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <MapPin className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="font-medium">All Campuses</p>
                          <p className="text-sm text-muted-foreground">School-wide view</p>
                        </div>
                        <Check className={cn("h-4 w-4", !currentCampus ? "opacity-100" : "opacity-0")} />
                      </div>
                    </CommandItem>
                  )}
                  {availableCampuses.map((campus) => (
                    <CommandItem
                      key={campus.id}
                      value={campus.name}
                      onSelect={() => {
                        onTenantChange({ campus })
                      }}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <MapPin className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="font-medium">{campus.name}</p>
                          <p className="text-sm text-muted-foreground">{campus.address}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {campus.grades.join(", ")}
                        </Badge>
                        <Check
                          className={cn("h-4 w-4", currentCampus?.id === campus.id ? "opacity-100" : "opacity-0")}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
