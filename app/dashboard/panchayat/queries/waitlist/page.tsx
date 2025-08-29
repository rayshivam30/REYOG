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
import { formatDistanceToNow, format } from "date-fns"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

type QueryStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "WAITLISTED" | "REJECTED" | "ACCEPTED"

interface Query {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  updatedAt: string
  wardNumber?: number
  user: {
    name: string
    email: string
    phone: string | null
  }
  panchayat?: {
    name: string
    district: string
    state: string
  }
  department?: {
    name: string
  }
  office?: {
    name: string
  }
}

export default function WaitlistPage() {
  const [queries, setQueries] = useState<Query[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Query; direction: 'asc' | 'desc' } | null>({
    key: 'createdAt',
    direction: 'desc'
  })
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Fetch waitlist queries from API
  useEffect(() => {
    const fetchWaitlistQueries = async () => {
      if (isAuthLoading) return
      
      setIsLoading(true)
      try {
        const response = await fetch("/api/queries?status=WAITLISTED")
        if (!response.ok) {
          throw new Error('Failed to fetch waitlist queries')
        }
        const data = await response.json()
        setQueries(data.queries || [])
      } catch (error) {
        console.error("Error fetching waitlist queries:", error)
        toast({
          title: "Error",
          description: "Failed to load waitlist queries",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWaitlistQueries()
  }, [isAuthLoading, toast])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/auth/login')
    }
  }, [isAuthLoading, user, router])

  const handleSort = (key: keyof Query) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      IN_PROGRESS: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      RESOLVED: 'bg-green-100 text-green-800 hover:bg-green-200',
      REJECTED: 'bg-red-100 text-red-800 hover:bg-red-200',
      WAITLISTED: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      ACCEPTED: 'bg-green-100 text-green-800 hover:bg-green-200'
    }
    
    return (
      <Badge className={statusMap[status] || 'bg-gray-100 text-gray-800'}>
        {status.replace(/_/g, ' ')}
      </Badge>
    )
  }

  const sortedQueries = [...queries].sort((a, b) => {
    if (!sortConfig) return 0
    
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue === bValue) return 0
    
    const direction = sortConfig.direction === 'asc' ? 1 : -1
    
    if (aValue === undefined) return 1 * direction
    if (bValue === undefined) return -1 * direction
    
    return (aValue < bValue ? -1 : 1) * direction
  })

  const filteredQueries = sortedQueries.filter(query => 
    query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.wardNumber?.toString().includes(searchTerm)
  )

  if (isLoading || isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Waitlist Queries</h1>
          <p className="text-muted-foreground">Manage queries that are currently on the waitlist</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search queries..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  {/* <TableHead>Submitted By</TableHead> */}
                  <TableHead>Ward</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Submitted
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.length > 0 ? (
                  filteredQueries.map((query) => (
                    <TableRow key={query.id}>
                      <TableCell className="font-medium">
                        <div className="line-clamp-1">
                          {query.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {query.description}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="font-medium">{query.user?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {query.user?.phone || 'No contact'}
                        </div>
                      </TableCell> */}
                      <TableCell>Ward {query.wardNumber || 'N/A'}</TableCell>
                      <TableCell>
                        {format(new Date(query.createdAt), 'MMM d, yyyy')}
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(query.createdAt), { addSuffix: true })}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(query.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/panchayat/queries/${query.id}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchTerm ? 'No matching queries found' : 'No queries in waitlist'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
