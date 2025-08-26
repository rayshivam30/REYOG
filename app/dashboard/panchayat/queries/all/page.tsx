"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Search, Users, Clock, Inbox, Check, X, Hourglass } from "lucide-react"

interface Query {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string
  }
  department?: {
    name: string
  }
}

export default function AllQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [updateNote, setUpdateNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [actionStatus, setActionStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchQueries()
  }, [])

  useEffect(() => {
    let filtered = queries
    if (searchTerm) {
      filtered = filtered.filter((query) => query.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    setFilteredQueries(filtered)
  }, [queries, searchTerm])

  const fetchQueries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/queries")
      if (response.ok) {
        const data = await response.json()
        const allQueries = data.queries || []
        const pendingQueries = allQueries.filter((q: Query) => q.status === "PENDING_REVIEW")
        setQueries(pendingQueries)
        setFilteredQueries(pendingQueries)
      }
    } catch (error) {
      console.error("Failed to fetch queries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedQuery) return

    // Making remark mandatory for declining or waitlisting
    if ((newStatus === "DECLINED" || newStatus === "WAITLISTED") && !updateNote.trim()) {
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
        await fetchQueries()
        setSelectedQuery(null)
        setUpdateNote("")
      } else {
        console.error("Failed to update status:", await response.text())
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">All New Queries</h1>
        <p className="text-muted-foreground">Review and take action on newly submitted queries.</p>
      </div>

      <Card className="mb-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Pending Review ({filteredQueries.length})</CardTitle>
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
                <div
                  key={query.id}
                  className="p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSelectedQuery(query)
                    setUpdateNote("")
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium mb-2">{query.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Anonymous
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(query.createdAt).toLocaleDateString()}
                        </div>
                        {query.department && <Badge variant="secondary">{query.department.name}</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No new queries pending review.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuery} onOpenChange={(isOpen) => !isOpen && setSelectedQuery(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedQuery?.title}</DialogTitle>
            <DialogDescription className="pt-4 text-base text-foreground/90 whitespace-pre-wrap">
              {selectedQuery?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Add a Remark (Required for Decline/Waitlist)</Label>
              <Textarea
                id="note"
                placeholder="Provide a reason for declining, waitlisting, or any initial note for acceptance..."
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedQuery(null)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleStatusUpdate("DECLINED")}
              disabled={isUpdating}
            >
              {actionStatus === "DECLINED" ? "Declining..." : <><X className="h-4 w-4 mr-2" /> Decline</>}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleStatusUpdate("WAITLISTED")}
              disabled={isUpdating}
            >
              {actionStatus === "WAITLISTED" ? "Waitlisting..." : <><Hourglass className="h-4 w-4 mr-2" /> Waitlist</>}
            </Button>
            <Button onClick={() => handleStatusUpdate("ACCEPTED")} disabled={isUpdating}>
              {actionStatus === "ACCEPTED" ? "Accepting..." : <><Check className="h-4 w-4 mr-2" /> Accept</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}