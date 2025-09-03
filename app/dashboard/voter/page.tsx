"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Star, MessageSquare, Plus, Clock, CheckCircle, AlertCircle, Eye, TrendingUp, Users, Award, User } from "lucide-react"
import Link from "next/link"

interface Query {
  id: string
  title: string
  status: string
  createdAt: string
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
        // Fetch only user queries instead of all queries
        const [queriesRes, complaintsRes] = await Promise.all([
          fetch("/api/queries?scope=user&limit=5"), 
          fetch("/api/complaints")
        ])

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Welcome Header */}
      <div className="mb-4 md:mb-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-5 sm:p-6 lg:p-8 text-white shadow-xl">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-start sm:items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">Welcome back! 👋</h1>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg max-w-2xl">
                Track your queries, explore services, and stay connected with your local government.
              </p>
            </div>
            <div className="mt-2 sm:mt-0 sm:ml-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs sm:text-sm md:text-base">
                <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" />
                <span>Active Voter</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
              <CardTitle className="text-[10px] xs:text-xs sm:text-sm font-medium text-blue-100">Total Queries</CardTitle>
              <FileText className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-blue-200" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-xl xs:text-2xl sm:text-3xl font-bold">{stats.totalQueries}</div>
              <p className="text-[10px] xs:text-xs text-blue-200 mt-0.5">Your submitted queries</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
              <CardTitle className="text-[10px] xs:text-xs sm:text-sm font-medium text-yellow-100">Pending</CardTitle>
              <Clock className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-yellow-200" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-xl xs:text-2xl sm:text-3xl font-bold">{stats.pendingQueries}</div>
              <p className="text-[10px] xs:text-xs text-yellow-200 mt-0.5">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
              <CardTitle className="text-[10px] xs:text-xs sm:text-sm font-medium text-green-100">Resolved</CardTitle>
              <CheckCircle className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-green-200" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-xl xs:text-2xl sm:text-3xl font-bold">{stats.resolvedQueries}</div>
              <p className="text-[10px] xs:text-xs text-green-200 mt-0.5">Successfully resolved</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-1 sm:pb-2">
              <CardTitle className="text-[10px] xs:text-xs sm:text-sm font-medium text-purple-100">Complaints</CardTitle>
              <MessageSquare className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-purple-200" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-xl xs:text-2xl sm:text-3xl font-bold">{stats.totalComplaints}</div>
              <p className="text-[10px] xs:text-xs text-purple-200 mt-0.5">Filed complaints</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Queries - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Recent Queries</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Your most recent queries and their status</CardDescription>
                  </div>
                  <Button size="sm" className="w-full xs:w-auto mt-2 xs:mt-0" asChild>
                    <Link href="/dashboard/voter/queries/new" className="flex items-center justify-center">
                      <Plus className="mr-2 h-4 w-4" /> New Query
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : recentQueries.length > 0 ? (
                  <div className="divide-y">
                    {recentQueries.map((query) => (
                      <Link
                        key={query.id}
                        href={`/dashboard/voter/queries/${query.id}`}
                        className="block hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start sm:items-center justify-between p-3 sm:p-4">
                          <div className="flex items-start space-x-2 sm:space-x-3">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 mt-0.5">
                              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-sm sm:text-base leading-tight sm:leading-normal line-clamp-2 sm:line-clamp-1">
                                {query.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-2 mt-0.5">
                                <p className="text-xs text-muted-foreground">
                                  {new Date(query.createdAt).toLocaleDateString()}
                                </p>
                                {query.department && (
                                  <span className="hidden xs:inline text-xs text-muted-foreground">• {query.department.name}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-2 mt-0.5">
                            <Badge className={`text-[10px] sm:text-xs ${getStatusColor(query.status)}`}>
                              {query.status.replace(/_/g, " ")}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <div className="p-3 sm:p-4 border-t">
                      <Button variant="ghost" size="sm" className="w-full" asChild>
                        <Link href="/dashboard/voter/queries" className="text-sm sm:text-base">
                          View All Queries
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 sm:p-8">
                    <FileText className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                    <h3 className="mt-3 text-sm sm:text-base font-medium">No queries yet</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
                      Submit your first query to get started with the platform.
                    </p>
                    <Button className="mt-4" size="sm" asChild>
                      <Link href="/dashboard/voter/queries/new" className="text-sm">
                        <Plus className="mr-2 h-4 w-4" /> New Query
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Quick Actions & Recent Complaints */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions Card */}
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription className="text-sm sm:text-base">Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
                  <Button className="w-full justify-start h-auto py-2 sm:py-3" asChild>
                    <Link href="/dashboard/voter/queries/new" className="text-left text-sm sm:text-base">
                      <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>New Query</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-2 sm:py-3" asChild>
                    <Link href="/dashboard/voter/queries" className="text-left text-sm sm:text-base">
                      <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>All Queries</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-2 sm:py-3" asChild>
                    <Link href="/dashboard/voter/complaints/new" className="text-left text-sm sm:text-base">
                      <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>File Complaint</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-2 sm:py-3" asChild>
                    <Link href="/dashboard/voter/profile" className="text-left text-sm sm:text-base">
                      <User className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>My Profile</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Complaints Card */}
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-lg">Recent Complaints</CardTitle>
                <CardDescription className="text-sm sm:text-base">Your recent complaints</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : recentComplaints.length > 0 ? (
                  <div className="divide-y">
                    {recentComplaints.map((complaint) => (
                      <Link
                        key={complaint.id}
                        href={`/dashboard/voter/complaints/${complaint.id}`}
                        className="block hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start sm:items-center justify-between p-3 sm:p-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium truncate">{complaint.subject}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-2 flex-shrink-0 text-[10px] sm:text-xs">
                            {complaint.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                    <div className="p-3 sm:p-4 border-t">
                      <Button variant="ghost" size="sm" className="w-full text-sm sm:text-base" asChild>
                        <Link href="/dashboard/voter/complaints">
                          View All Complaints
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-3 text-sm font-medium">No complaints yet</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      File a complaint if you have any issues.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}