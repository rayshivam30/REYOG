"use client"

import { notFound, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, MapPin, User, Mail, Phone, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface QueryWithRelations {
  id: string
  title: string
  description: string
  status: string
  wardNumber: string
  createdAt: string
  upvoteCount: number
  user: {
    name: string
    email: string
    phone: string | null
  }
  panchayat: {
    name: string
    district: string
    state: string
  } | null
  department: {
    id: string
    name: string
  } | null
  updates: Array<{
    id: string
    note: string
    status: string
    createdAt: string
    user: {
      name: string
      role: string
    }
  }>
}

const statusVariant = {
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  RESOLVED: 'bg-green-100 text-green-800 hover:bg-green-200',
  REJECTED: 'bg-red-100 text-red-800 hover:bg-red-200',
  WAITLISTED: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  ACCEPTED: 'bg-green-100 text-green-800 hover:bg-green-200'
}

export default function PanchayatQueryDetailsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isLoading: isAuthLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [query, setQuery] = useState<QueryWithRelations | null>(null)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')
  const [queryId, setQueryId] = useState('')

  // Set the query ID from params when component mounts
  useEffect(() => {
    if (params?.id) {
      setQueryId(params.id)
    }
  }, [params])

  // Fetch query details when queryId changes
  useEffect(() => {
    const fetchQuery = async () => {
      if (isAuthLoading || !queryId) return
      
      try {
        const res = await fetch(`/api/queries/${queryId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch query')
        }
        const data = await res.json()
        setQuery(data)
        setStatus(data.status)
      } catch (error) {
        console.error('Error fetching query:', error)
        toast({
          title: "Error",
          description: "Failed to load query details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (queryId) {
      fetchQuery()
    }
  }, [queryId, toast, isAuthLoading])

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim() || !status) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      setUpdating(true)
      const res = await fetch(`/api/queries/${queryId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          note,
        }),
      })

      // Log response details for debugging
      console.log('Response status:', res.status)
      console.log('Response headers:', Object.fromEntries([...res.headers.entries()]))
      
      const responseText = await res.text()
      let responseData
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {}
      } catch (e) {
        console.error('Failed to parse JSON response:', responseText)
        throw new Error('Invalid response from server')
      }
      
      if (!res.ok) {
        console.error('API Error:', {
          status: res.status,
          statusText: res.statusText,
          response: responseData
        })
        throw new Error(responseData.error || `Failed to update status (${res.status})`)
      }

      setQuery(responseData)
      setNote('')
      toast({
        title: "Success",
        description: "Query status updated successfully",
      })
      // Refresh the page to show updated data
      router.refresh()
    } catch (error: any) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update query status",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  if (isAuthLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthLoading && !user) {
    router.push('/auth/login')
    return null
  }

  if (!query) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Query Not Found</h2>
          <p className="text-muted-foreground mb-6">The query you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link href="/dashboard/panchayat/queries">
              Back to Queries
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/panchayat/queries" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Queries
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <Badge className={`mb-3 ${statusVariant[query.status as keyof typeof statusVariant] || 'bg-gray-100 text-gray-800'} text-sm font-medium`}>
                    {query.status.replace(/_/g, ' ')}
                  </Badge>
                  <CardTitle className="text-2xl md:text-3xl font-bold">{query.title}</CardTitle>
                  <CardDescription className="mt-2 flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(query.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="prose max-w-none mb-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Query Details</h3>
                <p className="text-foreground">{query.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Location</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{query.panchayat?.name || 'N/A'}</span>
                      </div>
                      <div className="pl-6">
                        <p className="text-sm">Ward: {query.wardNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {query.department && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Department</h3>
                      <Badge variant="secondary">{query.department.name}</Badge>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Submitted By</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{query.user.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{query.user.email}</span>
                    </div>
                    {query.user.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{query.user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates Section */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold">Updates & Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {query.updates && query.updates.length > 0 ? (
                <div className="space-y-6">
                  {query.updates.map((update) => (
                    <div key={update.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                        <div className="w-px h-full bg-border my-1" />
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{update.user.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {update.user.role}
                            </Badge>
                            <Badge variant={update.status === 'RESOLVED' ? 'default' : 'outline'} className="text-xs">
                              {update.status.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(update.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-foreground">{update.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No updates available for this query.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Update Form */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Update Status</CardTitle>
              <CardDescription>Update the status of this query and add a note.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    placeholder="Add an update note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Query Stats */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Query Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={statusVariant[query.status as keyof typeof statusVariant] || 'bg-gray-100 text-gray-800'}>
                  {query.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm font-medium">
                  {new Date(query.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Upvotes</span>
                <span className="text-sm font-medium">{query.upvoteCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Updates</span>
                <span className="text-sm font-medium">{query.updates?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
