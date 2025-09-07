"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Users, 
  FileText, 
  AlertCircle, 
  Loader2, 
  AlertTriangle,
  UserCheck,
  MessageSquare,
  AlertOctagon
} from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

type Panchayat = {
  id: string
  name: string
}

type User = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  panchayat: { name: string } | null
}

type Query = {
  id: string
  title: string
  status: string
  createdAt: string
  user: { name: string }
}

type Stats = {
  totalUsers: number
  activeQueries: number
  newUsers: number
  issues: number
}

// --- MAIN COMPONENT ---
const UserDataPage = () => {
  const [selectedPanchayat, setSelectedPanchayat] = useState<string>("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("7")
  const [panchayats, setPanchayats] = useState<Panchayat[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [recentQueries, setRecentQueries] = useState<Query[]>([])
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeQueries: 0,
    newUsers: 0,
    issues: 0
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"users" | "queries">("users")

  // Fetch data when component mounts or filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/admin/data?panchayat=${selectedPanchayat}&timeframe=${selectedTimeframe}`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const data = await response.json()
        
        setRecentUsers(data.users || [])
        setRecentQueries(data.queries || [])
        setPanchayats(data.panchayats || [])
        setStats(data.stats || {
          totalUsers: 0,
          activeQueries: 0,
          newUsers: 0,
          issues: 0
        })
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again later.")
        toast.error("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [selectedPanchayat, selectedTimeframe])

  // --- RENDER FUNCTIONS ---
  
  const renderUserTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Panchayat</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <p className="text-sm text-gray-500">Loading users...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <p className="text-sm text-red-600">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : recentUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Users className="h-8 w-8 text-gray-300" />
                  <p className="text-sm">No users found</p>
                  <p className="text-xs text-gray-400">
                    {selectedPanchayat !== 'all' ? 'Try changing your filter' : 'No users registered yet'}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            recentUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-sm">{user.email}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.role === "ADMIN" ? "destructive" : "default"}
                    className="text-xs"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {user.panchayat?.name || <span className="text-gray-400">N/A</span>}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
  
  const getStatusVariant = (status: string): 'secondary' | 'default' | 'destructive' | 'outline' => {
    switch (status) {
      case 'PENDING_REVIEW':
        return 'secondary';
      case 'ACCEPTED':
        return 'default';
      case 'DECLINED':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  const renderQueryTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <p className="text-sm text-gray-500">Loading queries...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  <p className="text-sm text-red-600">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : recentQueries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <FileText className="h-8 w-8 text-gray-300" />
                  <p className="text-sm">No queries found</p>
                  <p className="text-xs text-gray-400">
                    {selectedPanchayat !== 'all' ? 'Try changing your filter' : 'No queries submitted yet'}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            recentQueries.map((query) => (
              <TableRow key={query.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="max-w-[200px] truncate">
                    {query.title}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(query.status)} className="text-xs">
                    {query.status.replace(/_/g, " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {query.user?.name || 'Unknown User'}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDistanceToNow(new Date(query.createdAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  // --- MAIN RENDER ---
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Data Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor user activity and queries
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select 
            value={selectedPanchayat} 
            onValueChange={setSelectedPanchayat}
            disabled={isLoading || panchayats.length === 0}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={
                panchayats.length === 0 ? 'Loading panchayats...' : 'Select Panchayat'
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Panchayats</SelectItem>
              {panchayats.map((panchayat) => (
                <SelectItem key={panchayat.id} value={panchayat.id}>
                  {panchayat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedTimeframe} 
            onValueChange={setSelectedTimeframe}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '--' : stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.newUsers > 0 ? `+${stats.newUsers} this week` : 'No new users'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Queries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '--' : stats.activeQueries.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.activeQueries > 0 ? 'Currently active' : 'No active queries'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Users (7d)</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '--' : stats.newUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.newUsers > 0 ? 'Recently joined' : 'No new users'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues</CardTitle>
              <AlertOctagon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? '--' : stats.issues}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.issues > 0 ? 'Needs attention' : 'No issues reported'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Users
              {recentUsers.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {recentUsers.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("queries")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "queries"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Recent Queries
              {recentQueries.length > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {recentQueries.length}
                </span>
              )}
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-lg overflow-hidden">
          {activeTab === "users" ? renderUserTable() : renderQueryTable()}
        </div>
      </div>
    </div>
  )
}

// Export the component
export default function UserDataPageWrapper() {
  return <UserDataPage />
}

