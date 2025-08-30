
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Search, Plus, Users, Pencil, Trash2 } from "lucide-react"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// const [userToEdit, setUserToEdit] = useState<User | null>(null)
// // Updated User type to match our data (real + mock)
// type User = {
//   id: string
//   name: string
//   email: string
//   role: "ADMIN" | "PANCHAYAT" | "VOTER"
//   status: "ACTIVE" | "INACTIVE"
//   updatedAt: string // Using 'updatedAt' from schema instead of 'lastLogin'
// }

// // Hardcoded mock data for non-voter roles
// const mockUsers: User[] = [
//   {
//     id: "mock_admin_1",
//     name: "Admin User",
//     email: "admin@example.com",
//     role: "ADMIN",
//     status: "ACTIVE",
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: "mock_panchayat_1",
//     name: "Panchayat User",
//     email: "panchayat@example.com",
//     role: "PANCHAYAT",
//     status: "ACTIVE",
//     updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
//   },
// ]
//   // Add this component before the default export of UsersPage()
// // File: dashboard/admin/users/page.tsx

// function EditUserDialog({
//   user,
//   onUpdate,
//   onClose,
// }: {
//   user: User
//   onUpdate: (updatedUser: User) => void
//   onClose: () => void
// }) {
//   const [formData, setFormData] = useState({
//     name: user.name,
//     email: user.email,
//     role: user.role,
//   })

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const response = await fetch(`/api/admin/users/${user.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to update user")
//       }

//       const updatedUser = await response.json()
//       onUpdate(updatedUser.user)
//       onClose()
//     } catch (error) {
//       console.error("Error updating user:", error)
//       alert("Failed to update user.")
//     }
//   }

//   return (
//     <Dialog open={true} onOpenChange={onClose}>
//       <DialogContent>
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Edit User</DialogTitle>
//             <DialogDescription>
//               Update the details for {user.name}.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-name" className="text-right">Name</Label>
//               <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" required />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-email" className="text-right">Email</Label>
//               <Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="col-span-3" required />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit-role" className="text-right">Role</Label>
//               <Select value={formData.role} onValueChange={(value: "ADMIN" | "PANCHAYAT" | "VOTER") => setFormData({ ...formData, role: value })}>
//                 <SelectTrigger className="col-span-3">
//                   <SelectValue placeholder="Select role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ADMIN">Admin</SelectItem>
//                   <SelectItem value="PANCHAYAT">Panchayat</SelectItem>
//                   <SelectItem value="VOTER">Voter</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="submit">Save changes</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }
// export default function UsersPage() {
//   const [users, setUsers] = useState<User[]>([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [isLoading, setIsLoading] = useState(true)
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     role: "VOTER" as const,
//     password: "",
//   })

//   // Fetch users from API
//   useEffect(() => {
//     const fetchUsers = async () => {
//       setIsLoading(true)
//       try {
//         const response = await fetch("/api/admin/users")
//         if (!response.ok) {
//           throw new Error("Failed to fetch users")
//         }
//         const data = await response.json()
        
//         const realVoters = data.users.map((user: any) => ({
//           ...user,
//           status: "ACTIVE",
//         }))

//         setUsers([...mockUsers, ...realVoters])

//       } catch (error) {
//         console.error("Error fetching users:", error)
//         setUsers(mockUsers)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchUsers()
//   }, [])

//   const filteredUsers = users.filter(
//     (user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handleCreateUser = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const response = await fetch("/api/admin/users", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newUser),
//       })
      
//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to create user")
//       }

//       const { user: createdUser } = await response.json()

//       setUsers([...users, { ...createdUser, status: "ACTIVE" }])
      
//       setNewUser({ name: "", email: "", role: "VOTER", password: "" })
//       setIsCreateDialogOpen(false)

//     } catch (error) {
//       console.error("Error creating user:", error)
//       alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   const handleDeleteUser = async (userId: string) => {
//     if (userId.startsWith("mock_")) {
//         alert("This is a mock user and cannot be deleted.");
//         return;
//     }

//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         const response = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
//         if (!response.ok) {
//           throw new Error("Failed to delete user")
//         }
//         setUsers(users.filter((user) => user.id !== userId))
//       } catch (error) {
//         console.error("Error deleting user:", error)
//         alert("Failed to delete user.")
//       }
//     }
//   }

//   return (
//     <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
//             <Users className="h-8 w-8" />
//             User Management
//           </h2>
//           <p className="text-muted-foreground">
//             Manage system users and their permissions
//           </p>
//         </div>
//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Create User
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <form onSubmit={handleCreateUser}>
//               <DialogHeader>
//                 <DialogTitle>Create New User</DialogTitle>
//                 <DialogDescription>
//                   Fill in the details to create a new user account.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="name" className="text-right">Name</Label>
//                   <Input id="name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="col-span-3" required/>
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="email" className="text-right">Email</Label>
//                   <Input id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="col-span-3" required/>
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="role" className="text-right">Role</Label>
//                   <Select value={newUser.role} onValueChange={(value: "ADMIN" | "PANCHAYAT" | "VOTER") => setNewUser({ ...newUser, role: value })}>
//                     <SelectTrigger className="col-span-3">
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="ADMIN">Admin</SelectItem>
//                       <SelectItem value="PANCHAYAT">Panchayat</SelectItem>
//                       <SelectItem value="VOTER">Voter</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="password" className="text-right">Password</Label>
//                   <Input id="password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="col-span-3" required/>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="submit">Create User</Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>
      
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Users</CardTitle>
//             <div className="relative w-64">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input type="search" placeholder="Search users..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="flex justify-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Last Activity</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((user) => (
//                     <TableRow key={user.id}>
//                       <TableCell className="font-medium">{user.name}</TableCell>
//                       <TableCell>{user.email}</TableCell>
//                       <TableCell>
//                         <span className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
//                           {user.role}
//                         </span>
//                       </TableCell>
//                       <TableCell>
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             user.status === "ACTIVE"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {user.status}
//                         </span>
//                       </TableCell>
//                       <TableCell>
//                         {new Date(user.updatedAt).toLocaleString()}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="outline" size="sm" disabled={user.id.startsWith("mock_")}>
//                             <Pencil className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleDeleteUser(user.id)}
//                             disabled={user.id.startsWith("mock_")}
//                             className="text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center py-8">
//                       No users found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Users, Trash2, Ban } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Updated User type to match our data (real + mock)
type User = {
  id: string
  name: string
  email: string
  role: "ADMIN" | "PANCHAYAT" | "VOTER"
  status: "ACTIVE" | "BANNED"
  updatedAt: string
  panchayat?: {
    id: string
    name: string
    district: string
    state: string
  } | null
}

// Hardcoded mock data for non-voter roles
const mockUsers: User[] = [
  {
    id: "mock_admin_1",
    name: "Admin User",
    email: "admin@example.com",
    role: "ADMIN",
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mock_panchayat_1",
    name: "Panchayat User",
    email: "panchayat@example.com",
    role: "PANCHAYAT",
    status: "ACTIVE",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [panchayats, setPanchayats] = useState<{id: string, name: string}[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [panchayatFilter, setPanchayatFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "VOTER" as "ADMIN" | "PANCHAYAT" | "VOTER",
    password: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [usersResponse, panchayatsResponse] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/panchayats")
        ])
        
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users")
        }
        
        const usersData = await usersResponse.json()
        const realUsers = usersData.users.map((user: any) => ({
          ...user,
          status: user.status || "ACTIVE",
        }))

        setUsers(realUsers)

        if (panchayatsResponse.ok) {
          const panchayatsData = await panchayatsResponse.json()
          setPanchayats(panchayatsData.panchayats || [])
        }

      } catch (error) {
        console.error("Error fetching data:", error)
        setUsers(mockUsers)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPanchayat = panchayatFilter === "all" || 
      (panchayatFilter === "none" && !user.panchayat) ||
      user.panchayat?.id === panchayatFilter
    
    return matchesSearch && matchesPanchayat
  })

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create user")
      }

      const { user: createdUser } = await response.json()

      setUsers([...users, { ...createdUser, status: "ACTIVE" }])
      
      setNewUser({ name: "", email: "", role: "VOTER", password: "" })
      setIsCreateDialogOpen(false)

    } catch (error) {
      console.error("Error creating user:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleBanUser = async (userId: string) => {
    if (userId.startsWith("mock_")) {
        alert("This is a mock user and cannot be banned.");
        return;
    }

    if (window.confirm("Are you sure you want to ban this user? They will not be able to login.")) {
      try {
        const response = await fetch(`/api/admin/users/${userId}/ban`, { 
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "BANNED" })
        })
        if (!response.ok) {
          throw new Error("Failed to ban user")
        }
        
        // Update the user status in the local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: "BANNED" } : user
        ))
        
        alert("User has been banned successfully.")
      } catch (error) {
        console.error("Error banning user:", error)
        alert("Failed to ban user.")
      }
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            User Management
          </h2>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateUser}>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new user account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="col-span-3" required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="col-span-3" required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value as "ADMIN" | "PANCHAYAT" | "VOTER" })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="PANCHAYAT">Panchayat</SelectItem>
                      <SelectItem value="VOTER">Voter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Password</Label>
                  <Input id="password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="col-span-3" required/>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Registered Voters</CardTitle>
            <div className="flex gap-4">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search voters..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
              </div>
              <Select value={panchayatFilter} onValueChange={setPanchayatFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Panchayats</SelectItem>
                  <SelectItem value="none">No Panchayat</SelectItem>
                  {panchayats.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Panchayat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.panchayat ? (
                          <div>
                            <div className="font-medium text-sm">{user.panchayat.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {user.panchayat.district}, {user.panchayat.state}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-sm">No Panchayat</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(user.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {user.status === "ACTIVE" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBanUser(user.id)}
                              disabled={user.id.startsWith("mock_")}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          ) : (
                            <span className="text-sm text-muted-foreground">Banned</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No voters found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}