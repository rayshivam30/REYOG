"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Eye, Clock, CheckCircle, AlertCircle, Users } from "lucide-react"
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

export default function PastQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

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
      const response = await fetch("/api/queries") // This endpoint fetches all queries
      if (response.ok) {
        const data = await response.json()
        const allQueries = data.queries || []
        // **MODIFICATION: Filter for RESOLVED and DECLINED queries**
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "DECLINED":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      // **MODIFICATION: Added specific color for DECLINED status**
      case "DECLINED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        {/* **MODIFICATION: Updated Title** */}
        <h1 className="text-3xl font-bold text-foreground mb-2">Past Queries</h1>
        <p className="text-muted-foreground">Review resolved and declined queries submitted to your panchayat</p>
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
            {/* **MODIFICATION: Updated Filter Options** */}
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
                    {/* **MODIFICATION: Removed "Update" button** */}
                    <div className="flex gap-2 ml-4">
                      <Link href={`/dashboard/panchayat/queries/${query.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {query.user.name}
                    </div>
                    <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                    {query.resolvedAt && <span>Resolved On: {new Date(query.resolvedAt).toLocaleDateString()}</span>}
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
  )
}