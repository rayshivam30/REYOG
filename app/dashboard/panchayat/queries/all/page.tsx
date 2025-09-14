"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  Users,
  Clock,
  Inbox,
  Check,
  X,
  Hourglass,
  ArrowUp,
  MessageSquare,
  MapPin,
  Building,
  ClipboardList,
  Home,
  File as FileIcon,
  FileImage,
  FileText,
  Download,
  Loader2,
} from "lucide-react"

// Interface for a single comment
interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    name: string
  }
}

// Interface for attachments
interface Attachment {
  url: string
  filename: string
  size: number
  type: string
}

// Fully updated Query interface
interface Query {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  upvoteCount: number
  commentCount: number
  comments: Comment[]
  wardNumber?: number
  latitude?: number
  longitude?: number
  attachments: Attachment[]
  user: {
    id: string
    name: string
  }
  panchayat?: {
    name: string
  }
  department?: {
    name: string
  }
  office?: {
    name: string
  }
}

// Helper to get file icons
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/"))
    return <FileImage className="h-5 w-5 flex-shrink-0" />
  if (fileType === "application/pdf")
    return <FileText className="h-5 w-5 flex-shrink-0" />
  return <FileIcon className="h-5 w-5 flex-shrink-0" />
}

export default function AllQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [viewingCommentsFor, setViewingCommentsFor] = useState<Query | null>(null)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [updateNote, setUpdateNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [actionStatus, setActionStatus] = useState<string | null>(null)

  const fetchComments = async (queryId: string) => {
    setIsLoadingComments(true)
    try {
      const response = await fetch(`/api/queries/${queryId}/comments`)
      if (!response.ok) throw new Error("Failed to fetch comments")
      const data = await response.json()

      setViewingCommentsFor((prev) =>
        prev ? { ...prev, comments: data.comments } : null
      )

      const updateList = (list: Query[]) =>
        list.map((q) =>
          q.id === queryId
            ? { ...q, comments: data.comments, commentCount: data.comments.length }
            : q
        )
      setQueries((prev) => updateList(prev))
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  const handleOpenComments = (query: Query) => {
    setViewingCommentsFor(query)
    fetchComments(query.id)
  }

  const fetchQueries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/queries")
      if (!response.ok) throw new Error("Network response was not ok")
      const data = await response.json()
      const allQueries = data.queries || []
      const pendingQueries = allQueries.filter(
        (q: Query) => q.status === "PENDING_REVIEW"
      )
      setQueries(pendingQueries)
    } catch (error) {
      console.error("Failed to fetch queries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQueries()
  }, [])

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase()
    const filtered = queries.filter((query) =>
      query.title.toLowerCase().includes(lowercasedFilter)
    )
    setFilteredQueries(filtered)
  }, [queries, searchTerm])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedQuery) return
    if (
      (newStatus === "DECLINED" || newStatus === "WAITLISTED") &&
      !updateNote.trim()
    ) {
      alert("A remark is required to decline or waitlist a query.")
      return
    }

    setIsUpdating(true)
    setActionStatus(newStatus)
    try {
      const response = await fetch(`/api/queries/${selectedQuery.id}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note: updateNote }),
      })

      if (response.ok) {
        setQueries((prev) => prev.filter((q) => q.id !== selectedQuery.id))
        setSelectedQuery(null)
        setUpdateNote("")
      } else {
        alert("Failed to update query status. Please try again.")
      }
    } catch (error) {
      console.error("Failed to update query:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsUpdating(false)
      setActionStatus(null)
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* --- Page Header and Search --- */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          To-Do
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Review and take action on newly submitted queries.
        </p>
      </div>

      <Card className="mb-4 sm:mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by query title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* --- Queries List --- */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Review ({filteredQueries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-muted rounded-lg h-28"
                ></div>
              ))}
            </div>
          ) : filteredQueries.length > 0 ? (
            <div className="space-y-4">
              {filteredQueries.map((query) => (
                <div
                  key={query.id}
                  className="border border-border rounded-lg overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedQuery(query)
                      setUpdateNote("")
                    }}
                  >
                    <h4 className="font-medium mb-2 text-base sm:text-lg">
                      {query.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(query.createdAt).toLocaleDateString()}
                      </div>
                      {query.department && (
                        <Badge variant="secondary">
                          {query.department.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/30 px-4 py-3 border-t border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <ArrowUp className="h-4 w-4" />
                          <span>{query.upvoteCount ?? 0}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1.5 h-auto py-1 px-2 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenComments(query)
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{query.commentCount ?? 0}</span>
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full sm:w-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/dashboard/panchayat/queries/${query.id}`}
                        >
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No new queries pending review.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- Dialog for Detailed View & Taking Action --- */}
      <Dialog
        open={!!selectedQuery}
        onOpenChange={(isOpen) => !isOpen && setSelectedQuery(null)}
      >
        {/* MODIFICATION: Removed flex layout classes from DialogContent */}
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedQuery?.title}
            </DialogTitle>
            <div className="flex items-center pt-2 gap-4 text-sm">
              <Badge variant="outline">
                Status: {selectedQuery?.status.replace("_", " ")}
              </Badge>
              <span className="text-muted-foreground">
                Submitted on{" "}
                {selectedQuery &&
                  new Date(selectedQuery.createdAt).toLocaleString()}
              </span>
            </div>
          </DialogHeader>
          
          {/* MODIFICATION: This div now contains everything that needs to scroll */}
          <div className="max-h-[65vh] overflow-y-auto p-1 pr-4 my-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-foreground">
                Detailed Description
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedQuery?.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-foreground">
                Query Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <Home className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <span className="font-medium text-foreground">
                      Panchayat
                    </span>
                    <p className="text-muted-foreground">
                      {selectedQuery?.panchayat?.name ?? "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <span className="font-medium text-foreground">
                      Ward Number
                    </span>
                    <p className="text-muted-foreground">
                      {selectedQuery?.wardNumber ?? "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <span className="font-medium text-foreground">
                      Department
                    </span>
                    <p className="text-muted-foreground">
                      {selectedQuery?.department?.name ?? "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <span className="font-medium text-foreground">
                      Specific Office
                    </span>
                    <p className="text-muted-foreground">
                      {selectedQuery?.office?.name ?? "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {selectedQuery?.latitude && selectedQuery?.longitude && (
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Location</h3>
                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Coordinates: {selectedQuery.latitude.toFixed(5)},{" "}
                    {selectedQuery.longitude.toFixed(5)}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`https://www.google.com/maps/place/${selectedQuery.latitude},${selectedQuery.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Map
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {selectedQuery?.attachments &&
              selectedQuery.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">
                    Attachments
                  </h3>
                  <div className="space-y-2">
                    {selectedQuery.attachments.map((file) => (
                      <a
                        key={file.url}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        {getFileIcon(file.type)}
                        <span className="flex-grow text-sm text-foreground truncate">
                          {file.filename}
                        </span>
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            
            {/* MODIFICATION: The former footer content is now inside the scrollable div */}
            <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                    <Label htmlFor="note-scrollable">
                        Add a Remark (Required for Decline/Waitlist)
                    </Label>
                    <Textarea
                        id="note-scrollable"
                        placeholder="Provide a reason for declining, waitlisting, or any initial note..."
                        value={updateNote}
                        onChange={(e) => setUpdateNote(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-row sm:justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setSelectedQuery(null)}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleStatusUpdate("DECLINED")}
                        disabled={isUpdating}
                    >
                        {actionStatus === "DECLINED" ? (
                        <><Loader2 className="h-4 w-4 mr-1 sm:mr-2 animate-spin" /> ...</>
                        ) : (
                        <>
                            <X className="h-4 w-4 mr-1 sm:mr-2" /> Decline
                        </>
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => handleStatusUpdate("WAITLISTED")}
                        disabled={isUpdating}
                    >
                        {actionStatus === "WAITLISTED" ? (
                        <><Loader2 className="h-4 w-4 mr-1 sm:mr-2 animate-spin" /> ...</>
                        ) : (
                        <>
                            <Hourglass className="h-4 w-4 mr-1 sm:mr-2" /> Waitlist
                        </>
                        )}
                    </Button>
                    <Button
                        onClick={() => handleStatusUpdate("ACCEPTED")}
                        disabled={isUpdating}
                    >
                        {actionStatus === "ACCEPTED" ? (
                        <><Loader2 className="h-4 w-4 mr-1 sm:mr-2 animate-spin" /> ...</>
                        ) : (
                        <>
                            <Check className="h-4 w-4 mr-1 sm:mr-2" /> Accept
                        </>
                        )}
                    </Button>
                </div>
            </div>
          </div>
          {/* MODIFICATION: The original DialogFooter is now removed */}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!viewingCommentsFor}
        onOpenChange={(open) => {
          if (!open) setViewingCommentsFor(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>
              For query: "{viewingCommentsFor?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-4 p-1 my-4">
            {isLoadingComments ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              </div>
            ) : viewingCommentsFor?.comments &&
              viewingCommentsFor.comments.length > 0 ? (
              viewingCommentsFor.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 bg-muted/50 rounded-lg text-sm"
                >
                  <p className="text-foreground">{comment.content}</p>
                  <div className="text-xs text-muted-foreground mt-2 flex justify-between items-center">
                    <span>- {comment.user?.name ?? "Anonymous"}</span>
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No comments yet.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
