"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Building, Users, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

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

interface QueryAssignmentProps {
  queryId: string
  queryTitle: string
  queryStatus: string
  onAssignmentComplete?: () => void
}

export function QueryAssignment({ queryId, queryTitle, queryStatus, onAssignmentComplete }: QueryAssignmentProps) {
  const [offices, setOffices] = useState<Office[]>([])
  const [ngos, setNgos] = useState<NGO[]>([])
  const [selectedOffices, setSelectedOffices] = useState<Set<string>>(new Set())
  const [selectedNgos, setSelectedNgos] = useState<Set<string>>(new Set())
  const [currentAssignments, setCurrentAssignments] = useState<{
    offices: any[]
    ngos: any[]
  }>({ offices: [], ngos: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user } = useAuth()

  // Check if query can be assigned (must be ACCEPTED status)
  const canAssign = queryStatus === "ACCEPTED"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [officesRes, ngosRes, assignmentsRes] = await Promise.all([
          fetch(`/api/offices?panchayatId=${user?.panchayat?.id}`),
          fetch('/api/ngos'),
          fetch(`/api/queries/${queryId}/assignments`)
        ])

        if (officesRes.ok) {
          const officesData = await officesRes.json()
          setOffices(officesData.offices || [])
        }

        if (ngosRes.ok) {
          const ngosData = await ngosRes.json()
          setNgos(ngosData.ngos || [])
        }

        if (assignmentsRes.ok) {
          const assignmentsData = await assignmentsRes.json()
          setCurrentAssignments(assignmentsData)
          
          // Set currently selected offices and NGOs
          const currentOfficeIds = new Set<string>(assignmentsData.offices?.map((a: any) => a.officeId) || [])
          const currentNgoIds = new Set<string>(assignmentsData.ngos?.map((a: any) => a.ngoId) || [])
          setSelectedOffices(currentOfficeIds)
          setSelectedNgos(currentNgoIds)
        }
      } catch (err) {
        setError("Failed to load assignment data")
        console.error("Error fetching assignment data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.panchayat?.id) {
      fetchData()
    }
  }, [queryId, user?.panchayat?.id])

  const handleOfficeToggle = (officeId: string) => {
    const newSelected = new Set(selectedOffices)
    if (newSelected.has(officeId)) {
      newSelected.delete(officeId)
    } else {
      newSelected.add(officeId)
    }
    setSelectedOffices(newSelected)
  }

  const handleNgoToggle = (ngoId: string) => {
    const newSelected = new Set(selectedNgos)
    if (newSelected.has(ngoId)) {
      newSelected.delete(ngoId)
    } else {
      newSelected.add(ngoId)
    }
    setSelectedNgos(newSelected)
  }

  const handleAssign = async () => {
    try {
      setIsAssigning(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(`/api/queries/${queryId}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          officeIds: Array.from(selectedOffices),
          ngoIds: Array.from(selectedNgos),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(result.message)
        
        // Refresh the assignments data to show updated state
        const refreshAssignments = async () => {
          try {
            const assignmentsRes = await fetch(`/api/queries/${queryId}/assignments`)
            if (assignmentsRes.ok) {
              const assignmentsData = await assignmentsRes.json()
              setCurrentAssignments(assignmentsData)
              
              // Update the selected state to match current assignments
              const currentOfficeIds = new Set<string>(assignmentsData.offices?.map((a: any) => a.officeId) || [])
              const currentNgoIds = new Set<string>(assignmentsData.ngos?.map((a: any) => a.ngoId) || [])
              setSelectedOffices(currentOfficeIds)
              setSelectedNgos(currentNgoIds)
            }
          } catch (err) {
            console.error("Error refreshing assignments:", err)
          }
        }
        
        await refreshAssignments()
        
        if (onAssignmentComplete) {
          onAssignmentComplete()
        }
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
          <CardDescription>Assign offices and NGOs to handle this query</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Queries can only be assigned after they have been accepted. 
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
          Select offices and NGOs to handle: "{queryTitle}"
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

        {/* Current Assignments */}
        {(currentAssignments.offices.length > 0 || currentAssignments.ngos.length > 0) && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Current Assignments:</h4>
            <div className="space-y-1 text-sm text-blue-700">
              {currentAssignments.offices.map((assignment: any) => (
                <div key={assignment.id}>
                  • Office: {assignment.office.name} ({assignment.office.department.name})
                </div>
              ))}
              {currentAssignments.ngos.map((assignment: any) => (
                <div key={assignment.id}>
                  • NGO: {assignment.ngo.name} ({assignment.ngo.focusArea})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offices Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Government Offices</h3>
            <Badge variant="secondary">{selectedOffices.size} selected</Badge>
          </div>
          
          {offices.length > 0 ? (
            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {offices.map((office) => (
                <div
                  key={office.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <Checkbox
                    id={`office-${office.id}`}
                    checked={selectedOffices.has(office.id)}
                    onCheckedChange={() => handleOfficeToggle(office.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`office-${office.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {office.name}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {office.department.name} • {office.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No offices available in your panchayat</p>
          )}
        </div>

        <Separator />

        {/* NGOs Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Partner NGOs</h3>
            <Badge variant="secondary">{selectedNgos.size} selected</Badge>
          </div>
          
          {ngos.length > 0 ? (
            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {ngos.map((ngo) => (
                <div
                  key={ngo.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <Checkbox
                    id={`ngo-${ngo.id}`}
                    checked={selectedNgos.has(ngo.id)}
                    onCheckedChange={() => handleNgoToggle(ngo.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`ngo-${ngo.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {ngo.name}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ngo.focusArea} • Coverage: {ngo.coverage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Contact: {ngo.contactName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No NGOs available for assignment</p>
          )}
        </div>

        {/* Assignment Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedOffices.size + selectedNgos.size > 0 ? (
              `${selectedOffices.size} offices and ${selectedNgos.size} NGOs selected`
            ) : (
              "No assignments selected"
            )}
          </div>
          <Button
            onClick={handleAssign}
            disabled={isAssigning || (selectedOffices.size === 0 && selectedNgos.size === 0)}
            className="min-w-[120px]"
          >
            {isAssigning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Assigning...
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
