"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Search,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Briefcase,
  HeartHandshake,
  ArrowUp,
  MessageSquare,
  Heart,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"

interface Office {
  id: string
  name: string
}

interface NGO {
  id: string
  name: string
}

interface Query {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  budgetIssued?: number
  budgetSpent: number
  officialIncharge?: string
  teamAssigned?: string
  estimatedEnd?: string
  upvoteCount: number
  commentCount: number
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
  department?: {
    name: string
  }
  assignedOffices: { office: Office }[]
  assignedNgos: { ngo: NGO }[]
}

export default function ActiveQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  // State for viewing comments dialog
  const [viewingCommentsFor, setViewingCommentsFor] = useState<string | null>(null)
  const [comments, setComments] = useState<Array<{id: string, content: string, createdAt: string, user: {name: string}}>>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  // State for status update dialog
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [updateStatus, setUpdateStatus] = useState("")
  const [updateNote, setUpdateNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  // State for assignment dialog
  const [queryToAssign, setQueryToAssign] = useState<Query | null>(null)
  const [offices, setOffices] = useState<Office[]>([])
  const [ngos, setNgos] = useState<NGO[]>([])
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('')
  const [selectedNgoId, setSelectedNgoId] = useState<string>('')
  const [isAssigning, setIsAssigning] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)

  useEffect(() => {
    fetchQueries()
  }, [])

  useEffect(() => {
    let filtered = queries
    if (searchTerm) {
      filtered = filtered.filter(
        (query) =>
          query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((query) => query.status === statusFilter)
    }
    setFilteredQueries(filtered)
  }, [queries, searchTerm, statusFilter])

  const fetchQueries = async () => {
    setIsLoading(true)
    try {
      // Only fetch queries with these statuses
      const statuses = ["IN_PROGRESS", "ACCEPTED", "WAITLISTED"]
      const response = await fetch(`/api/queries?status=${statuses.join(",")}`)
      if (response.ok) {
        const data = await response.json()
        setQueries(data.queries || [])
      }
    } catch (error) {
      console.error("Failed to fetch queries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenAssignDialog = async (query: Query) => {
    setQueryToAssign(query)
    setSelectedOfficeId(query.assignedOffices?.[0]?.office.id || '')
    setSelectedNgoId(query.assignedNgos?.[0]?.ngo.id || '')
    setIsAssignDialogOpen(true)
    
    try {
      const [officesRes, ngosRes] = await Promise.all([
        fetch("/api/offices?for=assignment"),
        fetch("/api/ngos?for=assignment"),
      ])
      if (officesRes.ok) setOffices(await officesRes.json())
      if (ngosRes.ok) setNgos(await ngosRes.json())
    } catch (error) {
      console.error("Failed to fetch offices/NGOs:", error)
    }
  }
const handleSaveAssignment = async () => {
    if (!queryToAssign) return
    setIsAssigning(true)

    try {
      const payload = {
        officeId: selectedOfficeId || null,
        ngoId: selectedNgoId || null,
      }
      console.log("Sending payload:", payload)

      const response = await fetch(
        `/api/queries/${queryToAssign.id}/assignments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      )

      if (response.ok) {
        setIsAssignDialogOpen(false)
        await fetchQueries()
      } else {
        // This new block can handle empty or non-JSON responses
        const errorText = await response.text() // Get raw text from the response
        console.error("Failed to save. Server raw response:", errorText)
        try {
          const errorData = JSON.parse(errorText) // Try to parse it as JSON
          alert(`Failed to save: ${errorData.error || JSON.stringify(errorData)}`)
        } catch (e) {
          // If it fails to parse, show the raw text
          alert(`Failed to save. Server returned an invalid response: ${errorText || "Empty error response"}`)
        }
      }
    } catch (error) {
      console.error("A client-side error occurred:", error)
      alert("A client-side error occurred while saving.")
    } finally {
      setIsAssigning(false)
    }
  }
  const handleStatusUpdate = async () => {
    if (!selectedQuery || !updateStatus) {
      alert("Please select a status.")
      return
    }

    const requiresRemark = ["DECLINED", "REJECTED", "WAITLISTED"]
    if (requiresRemark.includes(updateStatus) && !updateNote.trim()) {
      alert("A remark is required for this status.")
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/queries/${selectedQuery.id}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: updateStatus,
          note: updateNote,
        }),
      })

      if (response.ok) {
        setIsUpdateDialogOpen(false)
        await fetchQueries()
      } else {
        alert("Failed to update status.")
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW": return <Clock className="h-4 w-4 text-yellow-500" />
      case "RESOLVED": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "DECLINED": case "REJECTED": return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW": return "bg-yellow-100 text-yellow-800"
      case "ACCEPTED": case "IN_PROGRESS": return "bg-blue-100 text-blue-800"
      case "RESOLVED": return "bg-green-100 text-green-800"
      case "WAITLISTED": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const eligibleForAssignment = (status: string) => ["PENDING_REVIEW", "ACCEPTED", "WAITLISTED", "IN_PROGRESS"].includes(status)

  const handleViewComments = async (queryId: string) => {
    setViewingCommentsFor(queryId);
    setIsLoadingComments(true);
    try {
      const response = await fetch(`/api/queries/${queryId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        toast.error('Failed to load comments');
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('An error occurred while loading comments');
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Active Queries</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage and update queries submitted to your panchayat</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <CardTitle>Queries ({filteredQueries.length})</CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredQueries.length > 0 ? (
            <div className="space-y-4">
              {filteredQueries.map((query) => (
                <div key={query.id} className="p-4 border border-border rounded-lg flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(query.status)}
                        <h4 className="font-medium">{query.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{query.description}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 ml-0 sm:ml-4 w-full sm:w-auto">
                      <Link href={`/dashboard/panchayat/queries/${query.id}`} className="w-full sm:w-auto">
                        <Button size="sm" variant="outline" className="w-full"><Eye className="h-4 w-4 mr-1" /> View</Button>
                      </Link>
                      <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => {
                        setSelectedQuery(query);
                        setUpdateStatus(query.status);
                        setUpdateNote("");
                        setIsUpdateDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4 mr-1" /> Update
                      </Button>
                      {eligibleForAssignment(query.status) && (
                        <Button size="sm" className="w-full sm:w-auto" onClick={() => handleOpenAssignDialog(query)}>
                          <Briefcase className="h-4 w-4 mr-1" /> Assign
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(query.status)}>
                      {query.status.replace("_", " ")}
                    </Badge>
                    {query.department && <Badge variant="secondary">{query.department.name}</Badge>}
                    {query.assignedOffices.length > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {query.assignedOffices[0].office.name}
                      </Badge>
                    )}
                    {query.assignedNgos.length > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <HeartHandshake className="h-3 w-3" />
                        {query.assignedNgos[0].ngo.name}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{query.user.name}</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                      {query.budgetIssued && <><span>•</span><span>Budget: ₹{query.budgetIssued.toLocaleString()}</span></>}
                      {query.officialIncharge && <><span>•</span><span>Officer: {query.officialIncharge}</span></>}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ArrowUp className="h-4 w-4" />
                        <span>{query.upvoteCount || 0}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleViewComments(query.id)}
                        className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{query.commentCount || 0}</span>
                      </button>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No queries found for the selected filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Query Status</DialogTitle>
            <DialogDescription>
              Select a new status and add a remark for: "{selectedQuery?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={updateStatus} onValueChange={setUpdateStatus}>
                <SelectTrigger><SelectValue placeholder="Select new status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACCEPTED">Accept</SelectItem>
                  <SelectItem value="IN_PROGRESS">Mark In Progress</SelectItem>
                  <SelectItem value="WAITLISTED">Add to Waitlist</SelectItem>
                  <SelectItem value="RESOLVED">Mark Resolved</SelectItem>
                  <SelectItem value="DECLINED">Decline</SelectItem>
                  <SelectItem value="CLOSED">Close</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Remark</Label>
              <Textarea id="note" placeholder="Add a note about this status update..." value={updateNote} onChange={(e) => setUpdateNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleStatusUpdate} disabled={!updateStatus || isUpdating}>
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Office & NGO</DialogTitle>
            <DialogDescription>For query: "{queryToAssign?.title}"</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="office">Assign Office</Label>
              <Select value={selectedOfficeId} onValueChange={(value) => setSelectedOfficeId(value)}>
                <SelectTrigger><SelectValue placeholder="Select an office" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {offices.map((office) => (
                    <SelectItem key={office.id} value={office.id}>{office.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ngo">Assign NGO (Optional)</Label>
              <Select value={selectedNgoId} onValueChange={(value) => setSelectedNgoId(value)}>
                <SelectTrigger><SelectValue placeholder="Select an NGO" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {ngos.map((ngo) => (
                    <SelectItem key={ngo.id} value={ngo.id}>{ngo.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSaveAssignment} disabled={isAssigning}>
              {isAssigning ? "Saving..." : "Save Assignments"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Comments Dialog */}
      <Dialog open={!!viewingCommentsFor} onOpenChange={(open) => {
        if (!open) {
          setViewingCommentsFor(null);
          setComments([]);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>
              Viewing comments for this query
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {isLoadingComments ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4 p-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{comment.user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No comments yet
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}