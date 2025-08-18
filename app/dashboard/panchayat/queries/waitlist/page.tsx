"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Clock, User, ArrowUpDown, Check, X, Clock as ClockIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

type QueryStatus = "PENDING" | "IN_PROGRESS" | "ESCALATED"

type Query = {
  id: string
  title: string
  description: string
  status: QueryStatus
  submittedDate: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  category: string
  submittedBy: string
  contactNumber: string
  location: string
  assignedTo?: string
  lastUpdated: string
}

export default function WaitlistPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Query; direction: 'asc' | 'desc' } | null>({
    key: 'submittedDate',
    direction: 'asc'
  })

  // Fetch waitlist queries from API
  useEffect(() => {
    const fetchWaitlistQueries = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch("/api/panchayat/queries/waitlist")
        // const data = await response.json()
        // setQueries(data.queries)
        
        // Mock data for now
        const mockQueries: Query[] = [
          {
            id: "1",
            title: "Water Supply Issue",
            description: "No water supply in our area for the past 3 days",
            status: "PENDING",
            submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            priority: "HIGH",
            category: "Water Supply",
            submittedBy: "Rahul Sharma",
            contactNumber: "+919876543210",
            location: "Ward 5, Sector 12",
            lastUpdated: new Date().toISOString()
          },
          {
            id: "2",
            title: "Garbage Collection",
            description: "Garbage not being collected in our locality",
            status: "IN_PROGRESS",
            submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            priority: "MEDIUM",
            category: "Sanitation",
            submittedBy: "Priya Patel",
            contactNumber: "+919876543211",
            location: "Ward 3, Sector 8",
            assignedTo: "Sanjay Kumar",
            lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString()
          },
          {
            id: "3",
            title: "Street Light Repair",
            description: "Street light not working in front of house no. 45",
            status: "ESCALATED",
            submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            priority: "HIGH",
            category: "Infrastructure",
            submittedBy: "Amit Kumar",
            contactNumber: "+919876543212",
            location: "Ward 7, Sector 15",
            lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
          },
        ]
        
        setQueries(mockQueries)
      } catch (error) {
        console.error("Error fetching waitlist queries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWaitlistQueries()
  }, [])

  const handleSort = (key: keyof Query) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedQueries = [...queries].sort((a, b) => {
    if (!sortConfig) return 0
    
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const filteredQueries = sortedQueries.filter(query => 
    query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: QueryStatus) => {
    switch (status) {
      case "IN_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
      case "ESCALATED":
        return <Badge variant="destructive">Escalated</Badge>
      case "PENDING":
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge variant="destructive">High</Badge>
      case "MEDIUM":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
      case "LOW":
      default:
        return <Badge variant="outline">Low</Badge>
    }
  }

  const handleAssign = (queryId: string) => {
    // Implement assign functionality
    console.log(`Assign query ${queryId}`)
  }

  const handleResolve = (queryId: string) => {
    // Implement resolve functionality
    console.log(`Resolve query ${queryId}`)
  }

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Query Waitlist
          </h2>
          <p className="text-muted-foreground">
            Manage and assign pending queries to team members
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
                placeholder="Search queries..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <ClockIcon className="h-4 w-4" />
                Last 7 days
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center gap-1">
                        Query
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </div>
                    </TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleSort('priority')}
                    >
                      <div className="flex items-center gap-1">
                        Priority
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                        <TableCell>
                          <div className="font-medium">{query.submittedBy}</div>
                          <div className="text-sm text-muted-foreground">
                            {query.contactNumber}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {query.location}
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(query.priority)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(query.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(query.submittedDate)}
                          </div>
                          {query.assignedTo && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Assigned to: {query.assignedTo}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAssign(query.id)}
                            >
                              Assign
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleResolve(query.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {searchTerm 
                              ? "No matching queries found" 
                              : "No queries in waitlist"}
                          </p>
                          {searchTerm && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSearchTerm("")}
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
