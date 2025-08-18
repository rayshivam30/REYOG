import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bell, Users, FileText, Building2, AlertTriangle } from "lucide-react"

async function getAdminStats() {
  // In a real app, this would fetch from API
  return {
    totalQueries: 156,
    pendingQueries: 23,
    totalComplaints: 12,
    activeUsers: 89,
    totalPanchayats: 15,
    recentNotifications: [
      {
        id: "1",
        title: "New Query Accepted",
        message: "Water supply query accepted by Bhopal Rural Panchayat",
        time: "2 hours ago",
        type: "INFO",
      },
      {
        id: "2",
        title: "Complaint Filed",
        message: "Direct complaint filed against road maintenance",
        time: "4 hours ago",
        type: "WARNING",
      },
      {
        id: "3",
        title: "Query Resolved",
        message: "Electricity issue resolved in Sehore",
        time: "6 hours ago",
        type: "SUCCESS",
      },
    ],
  }
}

function AdminStatsCards({ stats }: { stats: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalQueries}</div>
          <p className="text-xs text-muted-foreground">{stats.pendingQueries} pending review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">Across {stats.totalPanchayats} panchayats</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Complaints</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalComplaints}</div>
          <p className="text-xs text-muted-foreground">Direct to admin</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Panchayats</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPanchayats}</div>
          <p className="text-xs text-muted-foreground">Active jurisdictions</p>
        </CardContent>
      </Card>
    </div>
  )
}

function RecentNotifications({ notifications }: { notifications: any[] }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "bg-green-100 text-green-800"
      case "WARNING":
        return "bg-yellow-100 text-yellow-800"
      case "ERROR":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Notifications
        </CardTitle>
        <CardDescription>Latest system activities and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start justify-between space-x-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
              <Badge className={getTypeColor(notification.type)}>{notification.type}</Badge>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          View All Notifications
        </Button>
      </CardContent>
    </Card>
  )
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/admin/users">
            <Button>Manage Users</Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <AdminStatsCards stats={stats} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RecentNotifications notifications={stats.recentNotifications} />
        </div>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              View All Queries
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Handle Complaints
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              Manage NGOs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
