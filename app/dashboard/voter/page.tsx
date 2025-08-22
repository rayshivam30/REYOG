"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, MapPin, Star, MessageSquare, Plus, Clock, CheckCircle, AlertCircle, ThumbsUp } from "lucide-react"
import Link from "next/link"

interface Query {
  id: string
  title: string
  status: string
  createdAt: string
  upvoteCount: number // ADDED THIS
  department?: {
    name: string
  }
}

interface Complaint {
  id: string
  subject: string
  status: string
  createdAt: string
}

export default function VoterDashboard() {
  const [recentQueries, setRecentQueries] = useState<Query[]>([])
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([])
  const [stats, setStats] = useState({
    totalQueries: 0,
    pendingQueries: 0,
    resolvedQueries: 0,
    totalComplaints: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [queriesRes, complaintsRes] = await Promise.all([fetch("/api/queries?limit=5"), fetch("/api/complaints")])

        if (queriesRes.ok) {
          const queriesData = await queriesRes.json()
          const queries = queriesData.queries || []
          setRecentQueries(queries)

          // Calculate stats
          setStats((prev) => ({
            ...prev,
            totalQueries: queries.length,
            pendingQueries: queries.filter((q: Query) =>
              ["PENDING_REVIEW", "ACCEPTED", "IN_PROGRESS"].includes(q.status),
            ).length,
            resolvedQueries: queries.filter((q: Query) => ["RESOLVED", "CLOSED"].includes(q.status)).length,
          }))
        }

        if (complaintsRes.ok) {
          const complaintsData = await complaintsRes.json()
          const complaints = complaintsData.complaints || []
          setRecentComplaints(complaints.slice(0, 3))
          setStats((prev) => ({
            ...prev,
            totalComplaints: complaints.length,
          }))
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "RESOLVED":
      case "CLOSED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "DECLINED":
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
      case "CLOSED":
        return "bg-green-100 text-green-800"
      case "DECLINED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground">
            Track your queries, explore services, and stay connected with your local government.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQueries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingQueries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolvedQueries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complaints</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalComplaints}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/dashboard/voter/queries/new">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                  <Plus className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Raise Query</CardTitle>
                <CardDescription>Submit a new query or request</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/voter/map">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Find Offices</CardTitle>
                <CardDescription>Locate nearby government offices</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/voter/top-rated">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Top Rated</CardTitle>
                <CardDescription>View highly rated offices</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/voter/complaints">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">File Complaint</CardTitle>
                <CardDescription>Report issues or concerns</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Queries */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Queries</CardTitle>
                <Link href="/dashboard/voter/queries">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentQueries.length > 0 ? (
                <div className="space-y-4">
                  {recentQueries.map((query) => (
                    <div
                      key={query.id}
                      className="flex items-start justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(query.status)}
                          <h4 className="font-medium text-sm">{query.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(query.status)}>
                            {query.status.replace("_", " ")}
                          </Badge>
                          {query.department && <Badge variant="secondary">{query.department.name}</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(query.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {/* ADDED UPVOTE COUNT DISPLAY */}
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{query.upvoteCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No queries yet</p>
                  <Link href="/dashboard/voter/queries/new">
                    <Button className="mt-2">Raise Your First Query</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Complaints */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Complaints</CardTitle>
                <Link href="/dashboard/voter/complaints">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentComplaints.length > 0 ? (
                <div className="space-y-4">
                  {recentComplaints.map((complaint) => (
                    <div key={complaint.id} className="p-3 border border-border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">{complaint.subject}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(complaint.status)}>
                          {complaint.status.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No complaints filed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  )
}