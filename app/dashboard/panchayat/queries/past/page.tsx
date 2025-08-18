"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, CheckCircle, XCircle, Clock } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type QueryStatus = "RESOLVED" | "REJECTED" | "PENDING"

type Query = {
  id: string
  title: string
  description: string
  status: QueryStatus
  submittedDate: string
  resolvedDate?: string
  category: string
  submittedBy: string
}

export default function PastQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<QueryStatus | "ALL">("ALL")

  // Fetch past queries from API
  useEffect(() => {
    const fetchPastQueries = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch("/api/panchayat/queries/past")
        // const data = await response.json()
        // setQueries(data.queries)
        
        // Mock data for now
        const mockQueries: Query[] = [
          {
            id: "1",
            title: "Water Supply Issue",
            description: "No water supply in our area for the past 3 days",
            status: "RESOLVED",
            submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
            resolvedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            category: "Water Supply",
            submittedBy: "Rahul Sharma"
          },
          {
            id: "2",
            title: "Road Repair Needed",
            description: "Potholes on main road causing accidents",
            status: "REJECTED",
            submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
            resolvedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
            category: "Infrastructure",
            submittedBy: "Priya Patel"
          },
          {
            id: "3",
            title: "Garbage Collection",
            description: "Garbage not being collected regularly in sector 5",
            status: "PENDING",
            submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            category: "Sanitation",
            submittedBy: "Amit Kumar"
          },
        ]
        
        setQueries(mockQueries)
      } catch (error) {
        console.error("Error fetching past queries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPastQueries()
  }, [])

  const filteredQueries = queries.filter(query => {
    const matchesSearch = 
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "ALL" || query.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: QueryStatus) => {
    switch (status) {
      case "RESOLVED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>
      case "PENDING":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Past Queries
          </h2>
          <p className="text-muted-foreground">
            View and manage resolved and rejected queries
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search past queries..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as QueryStatus | "ALL")}
              >
                <option value="ALL">All Status</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.length > 0 ? (
                  filteredQueries.map((query) => (
                    <TableRow key={query.id}>
                      <TableCell className="font-medium">
                        <div className="font-medium">{query.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {query.description}
                        </div>
                      </TableCell>
                      <TableCell>{query.submittedBy}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{query.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(query.submittedDate)}
                        </div>
                        {query.resolvedDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {query.status === 'RESOLVED' ? 'Resolved: ' : 'Rejected: '}
                            {formatDate(query.resolvedDate)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(query.status)}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm || statusFilter !== "ALL"
                            ? "No matching queries found"
                            : "No past queries available"}
                        </p>
                        {(searchTerm || statusFilter !== "ALL") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSearchTerm("")
                              setStatusFilter("ALL")
                            }}
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
