// // app/admin/notifications/page.tsx (or your component's path)
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Bell, Users, CheckCircle, AlertCircle, Info } from "lucide-react"

// // Define types for the data we'll fetch
// type Panchayat = {
//   id: string
//   name: string
// }

// type User = {
//   id: string
//   name: string
//   email: string
//   role: string
//   createdAt: string
//   panchayat: {
//     name: string
//   } | null
// }

// export default function NotificationsPage() {
//   const [users, setUsers] = useState<User[]>([])
//   const [panchayats, setPanchayats] = useState<Panchayat[]>([])
//   const [selectedPanchayat, setSelectedPanchayat] = useState("all")
//   const [loading, setLoading] = useState(false)

//   // Fetch all panchayats for the filter dropdown on component mount
//   useEffect(() => {
//     const fetchPanchayats = async () => {
//       const response = await fetch("/api/panchayats")
//       const data = await response.json()
//       setPanchayats(data)
//     }
//     fetchPanchayats()
//   }, [])

//   // Fetch users whenever the selectedPanchayat filter changes
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true)
//       const response = await fetch(`/api/users?panchayatId=${selectedPanchayat}`)
//       const data = await response.json()
//       setUsers(data)
//       setLoading(false)
//     }
//     fetchUsers()
//   }, [selectedPanchayat])

//   return (
//     <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
//             <Bell className="h-8 w-8" />
//             Notifications & Activities
//           </h2>
//           <p className="text-muted-foreground">
//             Review recent system activities and notifications.
//           </p>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {/* This card will now trigger the modal to show registered users */}
//         <Dialog>
//           <DialogTrigger asChild>
//             <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Recent Registrations
//                 </CardTitle>
//                 <Users className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{users.length} Users</div>
//                 <p className="text-xs text-muted-foreground">
//                   Click to view all registered users
//                 </p>
//               </CardContent>
//             </Card>
//           </DialogTrigger>
//           <DialogContent className="max-w-4xl">
//             <DialogHeader>
//               <DialogTitle>Registered Users</DialogTitle>
//             </DialogHeader>
//             <div className="flex items-center py-4">
//               <Select
//                 value={selectedPanchayat}
//                 onValueChange={setSelectedPanchayat}
//               >
//                 <SelectTrigger className="w-[280px]">
//                   <SelectValue placeholder="Filter by Panchayat" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Panchayats</SelectItem>
//                   {panchayats.map((panchayat) => (
//                     <SelectItem key={panchayat.id} value={panchayat.id}>
//                       {panchayat.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Email</TableHead>
//                     <TableHead>Panchayat</TableHead>
//                     <TableHead>Role</TableHead>
//                     <TableHead>Registered On</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {loading ? (
//                     <TableRow>
//                       <TableCell colSpan={5} className="h-24 text-center">
//                         Loading...
//                       </TableCell>
//                     </TableRow>
//                   ) : users.length > 0 ? (
//                     users.map((user) => (
//                       <TableRow key={user.id}>
//                         <TableCell className="font-medium">{user.name}</TableCell>
//                         <TableCell>{user.email}</TableCell>
//                         <TableCell>
//                           {user.panchayat?.name || "N/A"}
//                         </TableCell>
//                         <TableCell>{user.role}</TableCell>
//                         <TableCell>
//                           {new Date(user.createdAt).toLocaleDateString()}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={5} className="h-24 text-center">
//                         No users found.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </DialogContent>
//         </Dialog>
        
//         {/* You can add other static or dynamic notification cards here */}
//         <Card>
//            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">Scheduled Maintenance</CardTitle>
//                 <AlertCircle className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">Tomorrow 2 AM</div>
//                 <p className="text-xs text-muted-foreground">
//                   System will be offline for updates
//                 </p>
//               </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// app/admin/notifications/page.tsx (or your component's path)
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
// AlertCircle is added back for the maintenance card
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

  // --- DATA FETCHING ---
  // Fetch all panchayats for the filter dropdowns on component mount
  useEffect(() => {
    const fetchPanchayats = async () => {
      const response = await fetch("/api/panchayats")
      const data = await response.json()
      setPanchayats(data)
    }
    fetchPanchayats()
  }, [])

  // Fetch users whenever the user filter changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true)
      const response = await fetch(`/api/users?panchayatId=${selectedPanchayatForUsers}`)
      const data = await response.json()
      setUsers(data)
      setLoadingUsers(false)
    }
    fetchUsers()
  }, [selectedPanchayatForUsers])

  // Fetch queries whenever the query filter changes
  useEffect(() => {
    const fetchQueries = async () => {
      setLoadingQueries(true)
      const response = await fetch(`/api/queries?panchayatId=${selectedPanchayatForQueries}`)
      const data = await response.json()
      // Adjusting based on your API's response shape
      setQueries(data.queries || [])
      setLoadingQueries(false)
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8" />
           Nortification & Activities Dashboard
          </h2>
          <p className="text-muted-foreground">
            Review recent system activities and notifications.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Registered Users</DialogTitle>
            </DialogHeader>
            <div className="flex items-center py-4">
              <Select value={selectedPanchayatForUsers} onValueChange={setSelectedPanchayatForUsers}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Filter by Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Panchayats</SelectItem>
                  {panchayats.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
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
                  {loadingUsers ? (
                    <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell></TableRow>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.panchayat?.name || "N/A"}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="h-24 text-center">No users found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
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
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Recent Queries</DialogTitle>
            </DialogHeader>
            <div className="flex items-center py-4">
              <Select value={selectedPanchayatForQueries} onValueChange={setSelectedPanchayatForQueries}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Filter by Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Panchayats</SelectItem>
                  {panchayats.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
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
                  {loadingQueries ? (
                    <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell></TableRow>
                  ) : queries.length > 0 ? (
                    queries.map((query) => (
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
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="h-24 text-center">No queries found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
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