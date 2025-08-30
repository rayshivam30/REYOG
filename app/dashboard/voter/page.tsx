"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Star, MessageSquare, Plus, Clock, CheckCircle, AlertCircle, Eye, TrendingUp, Users, Award } from "lucide-react"
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
      <div className="p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
                <p className="text-blue-100 text-lg">
                  Track your queries, explore services, and stay connected with your local government.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Award className="w-4 h-4 mr-1" />
                  Active Voter
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Queries</CardTitle>
              <FileText className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalQueries}</div>
              <p className="text-xs text-blue-200 mt-1">Your submitted queries</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">Pending</CardTitle>
              <Clock className="h-5 w-5 text-yellow-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingQueries}</div>
              <p className="text-xs text-yellow-200 mt-1">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Resolved</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.resolvedQueries}</div>
              <p className="text-xs text-green-200 mt-1">Successfully resolved</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Complaints</CardTitle>
              <MessageSquare className="h-5 w-5 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalComplaints}</div>
              <p className="text-xs text-purple-200 mt-1">Filed complaints</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/voter/queries/new">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Raise Query</CardTitle>
                <CardDescription className="text-gray-600">Submit a new query or request</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/voter/top-rated">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-yellow-200 bg-gradient-to-br from-white to-yellow-50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Top Rated</CardTitle>
                <CardDescription className="text-gray-600">View highly rated offices</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/voter/complaints">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-red-200 bg-gradient-to-br from-white to-red-50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">File Complaint</CardTitle>
                <CardDescription className="text-gray-600">Report issues or concerns</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Queries */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold">My Recent Queries</CardTitle>
                </div>
                <Link href="/dashboard/voter/my-queries">
                  <Button variant="outline" size="sm" className="bg-white hover:bg-blue-50">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentQueries.length > 0 ? (
                <div className="space-y-4">
                  {recentQueries.map((query) => (
                    <div
                      key={query.id}
                      className="flex items-start justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(query.status)}
                          <h4 className="font-medium text-gray-900">{query.title}</h4>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getStatusColor(query.status)}>
                            {query.status.replace("_", " ")}
                          </Badge>
                          {query.department && (
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                              {query.department.name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(query.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {/* View Button instead of like count */}
                      <Link href={`/dashboard/voter/queries/details/${query.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No queries yet</h3>
                  <p className="text-gray-500 mb-4">Start by raising your first query</p>
                  <Link href="/dashboard/voter/queries/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Raise Your First Query
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Complaints */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-lg font-semibold">My Recent Complaints</CardTitle>
                </div>
                <Link href="/dashboard/voter/complaints">
                  <Button variant="outline" size="sm" className="bg-white hover:bg-red-50">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentComplaints.length > 0 ? (
                <div className="space-y-4">
                  {recentComplaints.map((complaint) => (
                    <div key={complaint.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                      <h4 className="font-medium text-gray-900 mb-2">{complaint.subject}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getStatusColor(complaint.status)}>
                          {complaint.status.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints filed</h3>
                  <p className="text-gray-500 mb-4">You haven't filed any complaints yet</p>
                  <Link href="/dashboard/voter/complaints">
                    <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      File Complaint
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}