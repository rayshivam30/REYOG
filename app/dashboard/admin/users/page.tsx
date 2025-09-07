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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

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
    panchayatId: "" as string | undefined,
    newPanchayatName: "",
    newPanchayatEmail: "",
    newPanchayatPassword: ""
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
    // Only show VOTER role users
    if (user.role !== 'VOTER') return false;
    
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPanchayat = panchayatFilter === "all" || 
      (panchayatFilter === "none" && !user.panchayat) ||
      user.panchayat?.id === panchayatFilter
    
    return matchesSearch && matchesPanchayat
  })

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      const realUsers = data.users.map((user: any) => ({
        ...user,
        status: user.status || "ACTIVE",
      }));
      setUsers(realUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const requestBody: any = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      };

      // Handle panchayat assignment for both VOTER and PANCHAYAT roles
      if (newUser.role === 'VOTER' || newUser.role === 'PANCHAYAT') {
        if (newUser.panchayatId === 'new') {
          // Include new panchayat details
          requestBody.newPanchayatName = newUser.newPanchayatName;
          requestBody.newPanchayatEmail = newUser.newPanchayatEmail;
          requestBody.newPanchayatPassword = newUser.newPanchayatPassword;
        } else if (newUser.panchayatId && newUser.panchayatId !== 'none') {
          // Include existing panchayat ID
          requestBody.panchayatId = newUser.panchayatId;
        } else if (newUser.role === 'PANCHAYAT') {
          throw new Error('Panchayat is required for PANCHAYAT role');
        }
      }

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create user");
      }
      
      // Get the created user with panchayat data
      const createdUser = responseData.user;
      
      // Update the users list with the new user
      setUsers(prevUsers => [
        {
          ...createdUser,
          status: createdUser.status || "ACTIVE",
          panchayat: createdUser.panchayat
            ? {
                id: createdUser.panchayat.id,
                name: createdUser.panchayat.name,
                district: createdUser.panchayat.district,
                state: createdUser.panchayat.state
              }
            : null
        },
        ...prevUsers
      ]);
      
      // If a new panchayat was created, update the panchayats list
      if (newUser.panchayatId === 'new' && createdUser.panchayat) {
        setPanchayats(prevPanchayats => [
          {
            id: createdUser.panchayat.id,
            name: createdUser.panchayat.name
          },
          ...prevPanchayats
        ]);
      }
      
      // Close the dialog and reset the form
      setIsCreateDialogOpen(false);
      
      setNewUser({
        name: "",
        email: "",
        role: "VOTER",
        password: "",
        panchayatId: "",
        newPanchayatName: "",
        newPanchayatEmail: "",
        newPanchayatPassword: ""
      })
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 sm:h-8 w-6 sm:w-8" />
            User Management
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage system users and their permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
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
                {(newUser.role === "VOTER" || newUser.role === "PANCHAYAT") && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="panchayat" className="text-right mt-2">
                      {newUser.role === "PANCHAYAT" ? "Assign to Panchayat" : "Panchayat"}
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Select 
                        value={newUser.panchayatId === 'new' ? 'new' : (newUser.panchayatId || '')}
                        onValueChange={(value) => {
                          if (value === 'new') {
                            setNewUser(prev => ({ ...prev, panchayatId: 'new', newPanchayatName: '' }));
                          } else {
                            setNewUser(prev => ({ ...prev, panchayatId: value || undefined, newPanchayatName: '' }));
                          }
                        }}
                        required={newUser.role === "PANCHAYAT"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            newUser.role === "PANCHAYAT" 
                              ? "Select Panchayat to Assign" 
                              : "Select Panchayat"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {newUser.role === "VOTER" && (
                            <SelectItem value="none">No Panchayat</SelectItem>
                          )}
                          <SelectItem value="new">+ Add New Panchayat</SelectItem>
                          {panchayats.map((panchayat) => (
                            <SelectItem key={panchayat.id} value={panchayat.id}>
                              {panchayat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {newUser.panchayatId === 'new' && (
                        <div className="mt-2 space-y-3 p-4 border rounded-md bg-muted/10">
                          <div className="space-y-1">
                            <Label className="text-sm font-medium">New Panchayat Details</Label>
                            <Input
                              placeholder="Panchayat Name"
                              value={newUser.newPanchayatName}
                              onChange={(e) => setNewUser(prev => ({ ...prev, newPanchayatName: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Input
                              type="email"
                              placeholder="Panchayat Email"
                              value={newUser.newPanchayatEmail || ''}
                              onChange={(e) => setNewUser(prev => ({ ...prev, newPanchayatEmail: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <Input
                              type="password"
                              placeholder="Panchayat Password"
                              value={newUser.newPanchayatPassword}
                              onChange={(e) => setNewUser(prev => ({ ...prev, newPanchayatPassword: e.target.value }))}
                              required
                            />
                            <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <CardTitle>User Management</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="flex items-center space-x-4">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search voters..." 
                    className="w-full bg-background pl-8" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={panchayatFilter} onValueChange={setPanchayatFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by panchayat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Panchayats</SelectItem>
                    <SelectItem value="none">No Panchayat</SelectItem>
                    {panchayats.map((panchayat) => (
                      <SelectItem key={panchayat.id} value={panchayat.id}>
                        {panchayat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  <TableHead>Role</TableHead>
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
                        <Badge variant="outline" className="capitalize">
                          {user.role.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.panchayat ? (
                          <div className="flex flex-col">
                            <span className="font-medium">{user.panchayat.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {user.panchayat.district}, {user.panchayat.state}
                            </span>
                          </div>
                        ) : user.role === 'VOTER' ? (
                          <span className="text-muted-foreground text-sm">No panchayat assigned</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
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