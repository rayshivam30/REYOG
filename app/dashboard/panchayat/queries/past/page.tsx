"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Search, Eye, Clock, CheckCircle, AlertCircle, Users, MessageSquareText, FileText, ThumbsUp, ArrowUpCircle, MessageCircle 
} from "lucide-react"

interface CommentUser {
  name: string;
}
interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: CommentUser;
}

interface QueryUpdate {
  note: string | null
  status: string | null
  createdAt: string
}

interface Query {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  resolvedAt?: string
  upvoteCount: number
  likeCount: number
  commentCount: number
  updates?: QueryUpdate[]
  comments?: Comment[]
  // Added department for badge consistency
  department?: {
    name: string
  }
}

export default function PastQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)

  useEffect(() => {
    fetchQueries()
  }, [])

  useEffect(() => {
    let filtered = queries;
    if (searchTerm) {
      filtered = filtered.filter(
        (query) =>
          query.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((query) => query.status === statusFilter);
    }
    setFilteredQueries(filtered);
  }, [queries, searchTerm, statusFilter]);

  const fetchQueries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/queries")
      if (response.ok) {
        const data = await response.json()
        const allQueries = data.queries || []
        const pastQueries = allQueries.filter((q: Query) => ["RESOLVED", "DECLINED"].includes(q.status))
        setQueries(pastQueries)
        setFilteredQueries(pastQueries)
      }
    } catch (error) {
      console.error("Failed to fetch queries:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const getFinalRemark = (query: Query | null) => {
    if (!query || !query.updates || query.updates.length === 0) {
      return "No remark provided."
    }
    const finalUpdate = [...query.updates].reverse().find(
      (update) => update.status === query.status && update.note
    )
    return finalUpdate?.note || "No remark provided."
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "DECLINED": return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED": return "bg-green-100 text-green-800"
      case "DECLINED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedQuery(null)}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Past Queries</h1>
          <p className="text-muted-foreground">Review resolved and declined queries from your panchayat</p>
        </div>

        {/* MODIFICATION: Top card now only contains the search bar */}
        <Card className="mb-6">
          <CardContent className="">
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

        <Card>
          {/* MODIFICATION: CardHeader now contains the title and the filter */}
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Queries ({filteredQueries.length})</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Past Statuses</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
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
                  <div key={query.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(query.status)}
                          <h4 className="font-medium">{query.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{query.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getStatusColor(query.status)}>
                            {query.status.replace("_", " ")}
                          </Badge>
                          {query.department && <Badge variant="secondary">{query.department.name}</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedQuery(query)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          A Local Resident
                        </div>
                        <span>Submitted: {new Date(query.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1"><ArrowUpCircle className="h-4 w-4"/>{query.upvoteCount}</div>
                        <div className="flex items-center gap-1"><ThumbsUp className="h-4 w-4"/>{query.likeCount}</div>
                        <div className="flex items-center gap-1"><MessageCircle className="h-4 w-4"/>{query.commentCount}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No past queries found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <DialogContent className="sm:max-w-2xl">
        {selectedQuery && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedQuery.title}</DialogTitle>
              <DialogDescription>
                Submitted by a local resident on {new Date(selectedQuery.createdAt).toLocaleDateString()}
              </DialogDescription>
              <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5"><ArrowUpCircle className="h-4 w-4"/>{selectedQuery.upvoteCount} Upvotes</div>
                <div className="flex items-center gap-1.5"><ThumbsUp className="h-4 w-4"/>{selectedQuery.likeCount} Likes</div>
                <div className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4"/>{selectedQuery.comments?.length || 0} Comments</div>
              </div>
            </DialogHeader>

            <ScrollArea className="max-h-[70vh] pr-6">
              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center"><FileText className="h-4 w-4 mr-2" />Full Description</h3>
                  <div className="w-full rounded-md border p-4 text-sm text-muted-foreground bg-background">
                    {selectedQuery.description}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center"><MessageSquareText className="h-4 w-4 mr-2" />Authority's Remark</h3>
                  <div className="w-full rounded-md border bg-muted/50 p-4 text-sm text-foreground">
                    <p className="italic">{getFinalRemark(selectedQuery)}</p>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h3 className="font-semibold text-foreground mb-4 flex items-center"><MessageCircle className="h-4 w-4 mr-2" />Community Discussion</h3>
                  <div className="space-y-4">
                    {selectedQuery.comments && selectedQuery.comments.length > 0 ? (
                      selectedQuery.comments.map((comment) => (
                        <div key={comment.id} className="p-3 border rounded-lg bg-background">
                          <p className="text-sm text-foreground">{comment.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            - A Resident on {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No comments on this query yet.</p>
                    )}
                  </div>
                </div>

              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}