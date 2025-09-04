"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Building, Users, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

// --- TYPE DEFINITIONS ---
interface Office {
  id: string
  name: string
  address: string
  department: {
    name: string
  }
}

interface NGO {
  id: string
  name: string
  focusArea: string
  coverage: string
  contactName: string
}

interface Assignment {
  id: string
  office?: Office
  ngo?: NGO
}

interface QueryAssignmentProps {
  queryId: string
  queryTitle: string
  queryStatus: string
  onAssignmentComplete?: () => void
}

// --- REUSABLE ASSIGNMENT ITEM COMPONENT ---
interface AssignmentItemProps {
  id: string
  name: string
  details: React.ReactNode
  isChecked: boolean
  onToggle: (id: string) => void
}

// Inside components/panchayat/query-assignment.tsx

function AssignmentItem({ id, name, details, isChecked, onToggle }: AssignmentItemProps) {
  const uniqueId = `item-${id}`
  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-3 border rounded-lg transition-colors hover:bg-accent/50",
        isChecked && "bg-blue-50 border-blue-200 hover:bg-blue-50/80"
      )}
    >
      <Checkbox
        id={uniqueId}
        checked={isChecked}
        onCheckedChange={() => onToggle(id)}
        // 👇 ADD THIS STYLE ATTRIBUTE FOR A DIRECT OVERRIDE 👇
        style={{ width: "1rem", height: "1rem" }}
        className="mt-1 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <label
          htmlFor={uniqueId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {name}
        </label>
        <div className="text-xs text-muted-foreground mt-1">{details}</div>
      </div>
    </div>
  )
}

export function QueryAssignment({ queryId, queryTitle, queryStatus, onAssignmentComplete }: QueryAssignmentProps) {
  const [offices, setOffices] = useState<Office[]>([])
  const [ngos, setNgos] = useState<NGO[]>([])
  const [selectedOffices, setSelectedOffices] = useState<Set<string>>(new Set())
  const [selectedNgos, setSelectedNgos] = useState<Set<string>>(new Set())
  const [currentAssignments, setCurrentAssignments] = useState<{ offices: Assignment[]; ngos: Assignment[] }>({ offices: [], ngos: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user } = useAuth()

  const canAssign = ["ACCEPTED", "WAITLISTED", "IN_PROGRESS"].includes(queryStatus)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.panchayat?.id) return
      try {
        setIsLoading(true)
        const [officesRes, ngosRes, assignmentsRes] = await Promise.all([
          fetch(`/api/offices?panchayatId=${user.panchayat.id}`),
          fetch('/api/ngos'),
          fetch(`/api/queries/${queryId}/assignments`)
        ])

        const officesData = officesRes.ok ? await officesRes.json() : {}
        const ngosData = ngosRes.ok ? await ngosRes.json() : {}
        const assignmentsData = assignmentsRes.ok ? await assignmentsRes.json() : { offices: [], ngos: [] }

        setOffices(officesData.offices || [])
        setNgos(ngosData.ngos || [])
        
        setCurrentAssignments(assignmentsData)
        
        const currentOfficeIds = new Set<string>(assignmentsData.offices?.map((a: any) => a.officeId) || [])
        const currentNgoIds = new Set<string>(assignmentsData.ngos?.map((a: any) => a.ngoId) || [])
        setSelectedOffices(currentOfficeIds)
        setSelectedNgos(currentNgoIds)
        
      } catch (err) {
        setError("Failed to load assignment data")
        console.error("Error fetching assignment data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [queryId, user?.panchayat?.id])

  const handleToggle = useCallback((id: string, state: Set<string>, setState: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    setState(prevSet => {
      const newSet = new Set(prevSet)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const handleAssign = async () => {
    try {
      setIsAssigning(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(`/api/queries/${queryId}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          officeIds: Array.from(selectedOffices),
          ngoIds: Array.from(selectedNgos),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(result.message)
        const assignmentsRes = await fetch(`/api/queries/${queryId}/assignments`)
        if (assignmentsRes.ok) {
          const assignmentsData = await assignmentsRes.json()
          setCurrentAssignments(assignmentsData)
        }
        onAssignmentComplete?.()
      } else {
        setError(result.error?.message || "Failed to assign offices/NGOs")
      }
    } catch (err) {
      setError("An error occurred while assigning offices/NGOs")
    } finally {
      setIsAssigning(false)
    }
  }

  if (!canAssign) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Query Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Assignments can only be modified when query status is ACCEPTED, WAITLISTED, or IN_PROGRESS. 
              Current status: <Badge>{queryStatus}</Badge>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Query Assignment</CardTitle>
          <CardDescription>Loading assignment options...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Query to Offices/NGOs</CardTitle>
        <CardDescription>
          Select which organizations should handle: "{queryTitle}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {(currentAssignments.offices.length > 0 || currentAssignments.ngos.length > 0) && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Currently Assigned:</h4>
            <div className="flex flex-wrap gap-2">
              {currentAssignments.offices.map(({ id, office }) => (
                <Badge key={id} variant="secondary" className="bg-blue-100 text-blue-800">
                  <Building className="h-3 w-3 mr-1.5" />
                  {office.name}
                </Badge>
              ))}
              {currentAssignments.ngos.map(({ id, ngo }) => (
                <Badge key={id} variant="secondary" className="bg-green-100 text-green-800">
                  <Users className="h-3 w-3 mr-1.5" />
                  {ngo.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Government Offices</h3>
            <Badge variant="secondary">{selectedOffices.size} selected</Badge>
          </div>
          
          {offices.length > 0 ? (
            <div className="grid gap-3 max-h-64 overflow-y-auto p-1">
              {offices.map((office) => (
                <AssignmentItem
                  key={office.id}
                  id={office.id}
                  name={office.name}
                  isChecked={selectedOffices.has(office.id)}
                  onToggle={(id) => handleToggle(id, selectedOffices, setSelectedOffices)}
                  details={<p>{office.department.name} • {office.address}</p>}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No offices available in your panchayat.</p>
          )}
        </div>

        <Separator />

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Partner NGOs</h3>
            <Badge variant="secondary">{selectedNgos.size} selected</Badge>
          </div>
          
          {ngos.length > 0 ? (
            <div className="grid gap-3 max-h-64 overflow-y-auto p-1">
              {ngos.map((ngo) => (
                <AssignmentItem
                  key={ngo.id}
                  id={ngo.id}
                  name={ngo.name}
                  isChecked={selectedNgos.has(ngo.id)}
                  onToggle={(id) => handleToggle(id, selectedNgos, setSelectedNgos)}
                  details={
                    <>
                      <p>{ngo.focusArea} • Coverage: {ngo.coverage}</p>
                      <p>Contact: {ngo.contactName}</p>
                    </>
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No NGOs available for assignment.</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedOffices.size + selectedNgos.size > 0 ? (
              `${selectedOffices.size} offices and ${selectedNgos.size} NGOs selected`
            ) : (
              "No new assignments selected"
            )}
          </div>
          <Button
            onClick={handleAssign}
            disabled={isAssigning}
            className="min-w-[150px] w-full sm:w-auto min-h-10"
          >
            {isAssigning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Assignments"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}