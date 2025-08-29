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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react"
import Link from "next/link"

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
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
  department?: {
    name: string
  }
  office?: {
    name: string
  }
}

export default function ActiveQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [updateStatus, setUpdateStatus] = useState("")
  const [updateNote, setUpdateNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchQueries()
  }, [])

  useEffect(() => {
    let filtered = queries

    if (searchTerm) {
      filtered = filtered.filter(
        (query) =>
          query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          query.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((query) => query.status === statusFilter)
    }

    setFilteredQueries(filtered)
  }, [queries, searchTerm, statusFilter])

  const fetchQueries = async () => {
    setIsLoading(true) // Set loading at the start
    try {
      const response = await fetch("/api/queries")
      if (response.ok) {
        const data = await response.json()
        const allQueries = data.queries || []

        // Only show ACCEPTED and IN_PROGRESS queries on this page
        const activeQueries = allQueries.filter(
          (q: Query) => q.status === "ACCEPTED" || q.status === "IN_PROGRESS"
        )

        setQueries(activeQueries)
        setFilteredQueries(activeQueries)
      }
    } catch (error) {
      console.error("Failed to fetch queries:", error)
    } finally {
      setIsLoading(false) // Stop loading at the end
    }
  }

  // --- MODIFICATION START: Updated handleStatusUpdate function ---
  const handleStatusUpdate = async () => {
    if (!selectedQuery || !updateStatus) {
      alert("Please select a status.")
      return
    }

    // Define which statuses require a remark
    const requiresRemark = ["DECLINED", "REJECTED", "WAITLISTED"]

    // Check if the selected status requires a remark and if the note is empty
    if (requiresRemark.includes(updateStatus) && !updateNote.trim()) {
      alert(
        "A remark is required to decline, reject, or waitlist this query."
      )
      return // Stop the submission
    }

    setIsUpdating(true)
    try {
      // Using the more consistent '/updates' endpoint from your first file
      const response = await fetch(`/api/queries/${selectedQuery.id}/updates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: updateStatus,
          note: updateNote,
        }),
      })

      if (response.ok) {
        setSelectedQuery(null)
        setUpdateStatus("")
        setUpdateNote("")
        await fetchQueries() // Refetch to update the list
      } else {
        alert("Failed to update status. Please try again.")
      }
    } catch (error) {
      console.error("Failed to update status:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }
  // --- MODIFICATION END ---

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "DECLINED":
      case "REJECTED":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return "bg-yellow-100 text-yellow-800"
      case "ACCEPTED":
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      case "WAITLISTED":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Active Queries
        </h1>
        <p className="text-muted-foreground">
          Manage and update queries submitted to your panchayat
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search queries or submitter name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Queries List */}
      <Card>
        <CardHeader>
          <CardTitle>Queries ({filteredQueries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse p-4 border border-border rounded-lg"
                >
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredQueries.length > 0 ? (
            <div className="space-y-4">
              {filteredQueries.map((query) => (
                <div
                  key={query.id}
                  className="p-4 border border-border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(query.status)}
                        <h4 className="font-medium">{query.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {query.description}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={getStatusColor(query.status)}
                        >
                          {query.status.replace("_", " ")}
                        </Badge>
                        {query.department && (
                          <Badge variant="secondary">
                            {query.department.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link href={`/dashboard/panchayat/queries/${query.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Dialog
                        onOpenChange={(isOpen) => {
                          if (!isOpen) setSelectedQuery(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedQuery(query)
                              setUpdateStatus(query.status) // Pre-fill current status
                              setUpdateNote("") // Reset note
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Update
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Query Status</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <p className="text-sm font-medium">
                                Query: {selectedQuery?.title}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="status">New Status</Label>
                              <Select
                                value={updateStatus}
                                onValueChange={setUpdateStatus}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select new status" />
                                </SelectTrigger>
                                {/* --- MODIFICATION START: Updated status options --- */}
                                <SelectContent>
                                  {/* <SelectItem value="ACCEPTED">
                                    Accept
                                  </SelectItem> */}
                                  <SelectItem value="IN_PROGRESS">
                                    Mark In Progress
                                  </SelectItem>
                                  <SelectItem value="WAITLISTED">
                                    Add to Waitlist
                                  </SelectItem>
                                  <SelectItem value="RESOLVED">
                                    Mark Resolved
                                  </SelectItem>
                                  {/* <SelectItem value="DECLINED">
                                    Decline
                                  </SelectItem> */}
                                  {/* <SelectItem value="REJECTED">
                                    Reject
                                  </SelectItem> */}
                                  <SelectItem value="CLOSED">Close</SelectItem>
                                </SelectContent>
                                {/* --- MODIFICATION END --- */}
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="note">
                                Remark (Required for Decline/Reject/Waitlist)
                              </Label>
                              <Textarea
                                id="note"
                                placeholder="Add a note about this status update..."
                                value={updateNote}
                                onChange={(e) => setUpdateNote(e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedQuery(null)}
                                disabled={isUpdating}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleStatusUpdate}
                                disabled={!updateStatus || isUpdating}
                              >
                                {isUpdating ? "Updating..." : "Update Status"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {/* <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{query.user.name}</span>
                    </div> */}
                    <span>
                      {new Date(query.createdAt).toLocaleDateString()}
                    </span>
                    {query.budgetIssued && (
                      <span>
                        Budget: ₹{query.budgetIssued.toLocaleString()}
                      </span>
                    )}
                    {query.officialIncharge && (
                      <span>Officer: {query.officialIncharge}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active queries found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}