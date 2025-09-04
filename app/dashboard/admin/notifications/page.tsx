// app/admin/notifications/page.tsx (or your component's path)
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Bell, Users, FileText, AlertCircle } from "lucide-react"
import { QueryStatus } from "@prisma/client"

// --- TYPE DEFINITIONS ---
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
  status: QueryStatus
  wardNumber: number | null
  createdAt: string
  panchayat: { name: string } | null
}

// --- HOOK FOR MEDIA QUERIES ---
// A simple hook to check for screen size, making our component adaptive.
const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);

    return matches;
};


export default function NotificationsPage() {
  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState<User[]>([])
  const [queries, setQueries] = useState<Query[]>([])
  const [panchayats, setPanchayats] = useState<Panchayat[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingQueries, setLoadingQueries] = useState(false)

  // Filters
  const [selectedPanchayatForUsers, setSelectedPanchayatForUsers] = useState("all")
  const [selectedPanchayatForQueries, setSelectedPanchayatForQueries] = useState("all")

  // Use the hook to check for mobile screen size (Tailwind's md breakpoint is 768px)
  const isMobile = useMediaQuery("(max-width: 767px)");


  // --- DATA FETCHING ---
  // Fetch all panchayats for the filter dropdowns on component mount
  useEffect(() => {
    const fetchPanchayats = async () => {
      try {
        const response = await fetch("/api/panchayats")
        const data = await response.json()
        setPanchayats(data.panchayats || [])
      } catch (error) {
        console.error("Error fetching panchayats:", error)
        setPanchayats([])
      }
    }
    fetchPanchayats()
  }, [])

  // Fetch users whenever the user filter changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true)
      try {
        const response = await fetch(`/api/users?panchayatId=${selectedPanchayatForUsers}`)
        const data = await response.json()
        setUsers(data || [])
      } catch (error) {
        console.error("Error fetching users:", error)
        setUsers([])
      } finally {
        setLoadingUsers(false)
      }
    }
    fetchUsers()
  }, [selectedPanchayatForUsers])

  // Fetch queries whenever the query filter changes
  useEffect(() => {
    const fetchQueries = async () => {
      setLoadingQueries(true)
      try {
        const response = await fetch(`/api/queries?panchayatId=${selectedPanchayatForQueries}`)
        const data = await response.json()
        setQueries(data.queries || [])
      } catch (error) {
        console.error("Error fetching queries:", error)
        setQueries([])
      } finally {
        setLoadingQueries(false)
      }
    }
    fetchQueries()
  }, [selectedPanchayatForQueries])

  // --- HELPER FUNCTIONS ---
  const getStatusVariant = (status: QueryStatus) => {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return "success"
      case "DECLINED":
        return "destructive"
      case "IN_PROGRESS":
        return "default"
      case "PENDING_REVIEW":
      case "WAITLISTED":
        return "secondary"
      default:
        return "outline"
    }
  }

  // --- JSX RENDER ---
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 sm:h-8 w-6 sm:w-8" />
            Notification & Activities Dashboard
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Review recent system activities and notifications.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card for Registered Users */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors h-56 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center">
                <div className="text-2xl font-bold">{users.length} Users</div>
                <p className="text-xs text-muted-foreground">Click to view all registered users</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Registered Users</DialogTitle>
            </DialogHeader>
            <div className="flex items-center pt-4">
              <Select value={selectedPanchayatForUsers} onValueChange={setSelectedPanchayatForUsers}>
                <SelectTrigger className="w-full sm:w-[280px]">
                  <SelectValue placeholder="Filter by Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Panchayats</SelectItem>
                  {panchayats.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-grow overflow-y-auto mt-4 pr-2">
              {loadingUsers ? (
                <div className="h-24 text-center flex items-center justify-center">Loading...</div>
              ) : users.length > 0 ? (
                isMobile ? (
                  // --- MOBILE CARD VIEW FOR USERS ---
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div key={user.id} className="p-4 border rounded-lg text-sm">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-muted-foreground">{user.email}</div>
                        <div className="text-xs mt-2">
                          <strong>Panchayat:</strong> {user.panchayat?.name || "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <strong>Registered:</strong> {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // --- DESKTOP TABLE VIEW FOR USERS ---
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Panchayat</TableHead>
                          <TableHead>Registered On</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.panchayat?.name || "N/A"}</TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )
              ) : (
                <div className="h-24 text-center flex items-center justify-center">No users found.</div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Card for Recent Queries */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors h-56 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Queries</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center">
                <div className="text-2xl font-bold">{queries.length} Queries</div>
                <p className="text-xs text-muted-foreground">Click to view all queries</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Recent Queries</DialogTitle>
            </DialogHeader>
            <div className="flex items-center pt-4">
              <Select value={selectedPanchayatForQueries} onValueChange={setSelectedPanchayatForQueries}>
                <SelectTrigger className="w-full sm:w-[280px]">
                  <SelectValue placeholder="Filter by Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Panchayats</SelectItem>
                  {panchayats.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-grow overflow-y-auto mt-4 pr-2">
              {loadingQueries ? (
                <div className="h-24 text-center flex items-center justify-center">Loading...</div>
              ) : queries.length > 0 ? (
                isMobile ? (
                  // --- MOBILE CARD VIEW FOR QUERIES ---
                  <div className="space-y-3">
                    {queries.map((query) => (
                      <div key={query.id} className="p-4 border rounded-lg text-sm">
                          <div className="flex justify-between items-start">
                              <p className="font-semibold pr-2">{query.title}</p>
                              <Badge variant={getStatusVariant(query.status)} className="whitespace-nowrap">{query.status.replace(/_/g, ' ')}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                              {query.panchayat?.name || "N/A"}
                              {query.wardNumber && ` (Ward ${query.wardNumber})`}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(query.createdAt).toLocaleDateString()}
                          </div>
                      </div>
                    ))}
                  </div>
                ) : (
                 // --- DESKTOP TABLE VIEW FOR QUERIES ---
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Panchayat & Ward</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {queries.map((query) => (
                          <TableRow key={query.id}>
                            <TableCell className="font-medium">{query.title}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(query.status)}>{query.status.replace(/_/g, ' ')}</Badge>
                            </TableCell>
                            <TableCell>
                              {query.panchayat?.name || "N/A"}
                              {query.wardNumber && ` (Ward ${query.wardNumber})`}
                            </TableCell>
                            <TableCell>{new Date(query.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )
              ) : (
                <div className="h-24 text-center flex items-center justify-center">No queries found.</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* --- STATIC MAINTENANCE CARD ADDED BACK --- */}
        <Card className="h-56 flex flex-col">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Maintenance</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center">
              <div className="text-2xl font-bold">Tomorrow 2 AM</div>
              <p className="text-xs text-muted-foreground">
                System will be offline for updates
              </p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}