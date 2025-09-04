"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle, AlertCircle, Users, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"

interface QueryStats {
  total: number
  pending: number
  active: number
  resolved: number
  declined: number
}

interface RecentQuery {
  id: string
  title: string
  status: string
  createdAt: string
  user: {
    name: string
  }
  department?: {
    name: string
  }
   panchayat?: {
    name: string
  }
}

export default function PanchayatDashboard() {
  const [queryStats, setQueryStats] = useState<QueryStats>({
    total: 0,
    pending: 0,
    active: 0,
    resolved: 0,
    declined: 0,
  })
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/queries?limit=10")
        if (response.ok) {
          const data = await response.json()
          const queries = data.queries || []
          setRecentQueries(queries.slice(0, 5))

          // Calculate stats
          const stats = queries.reduce(
            (acc: QueryStats, query: RecentQuery) => {
              acc.total++
              switch (query.status) {
                case "PENDING_REVIEW":
                  acc.pending++
                  break
                case "ACCEPTED":
                case "IN_PROGRESS":
                  acc.active++
                  break
                case "RESOLVED":
                case "CLOSED":
                  acc.resolved++
                  break
                case "DECLINED":
                  acc.declined++
                  break
              }
              return acc
            },
            { total: 0, pending: 0, active: 0, resolved: 0, declined: 0 },
          )

          setQueryStats(stats)
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
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Panchayat Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage queries, track progress, and maintain service statistics for your panchayat
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queryStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inbox</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queryStats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queryStats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queryStats.resolved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Declined</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{queryStats.declined}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Queries */}
        <Card>
          <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle>Recent Queries</CardTitle>
            <CardDescription>Latest queries submitted to your panchayat</CardDescription>
          </div>
          <Link href="/dashboard/panchayat/queries">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              View All
            </Button>
          </Link>
        </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentQueries.length > 0 ? (
              <div className="space-y-4">
                {recentQueries.map((query) => (
                  <div key={query.id} className="flex items-start justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(query.status)}
                        <h4 className="font-medium">{query.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getStatusColor(query.status)}>
                          {query.status.replace("_", " ")}
                        </Badge>
                        {query.department && <Badge variant="secondary">{query.department.name}</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {query.user.name}
                        </div>
                        <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {/* View Button */}
                    <Link href={`/dashboard/panchayat/queries/${query.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No queries yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
