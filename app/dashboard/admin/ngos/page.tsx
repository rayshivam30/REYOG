// import { Suspense } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Building2, Search, Plus, Phone, Mail, MapPin, Users } from "lucide-react"

// async function getNGOs() {
//   // In a real app, this would fetch from API
//   return [
//     {
//       id: "1",
//       name: "Rural Development Foundation",
//       focusArea: "Education, Healthcare",
//       coverage: "Bhopal District",
//       contactPerson: "Dr. Rajesh Gupta",
//       phone: "+91-9876543210",
//       email: "contact@rdf.org",
//       address: "123 Gandhi Road, Bhopal, MP 462001",
//     },
//     {
//       id: "2",
//       name: "Water for All Initiative",
//       focusArea: "Water Supply, Sanitation",
//       coverage: "Sehore, Raisen Districts",
//       contactPerson: "Ms. Priya Sharma",
//       phone: "+91-9876543211",
//       email: "info@waterforall.org",
//       address: "456 Nehru Nagar, Sehore, MP 466001",
//     },
//     {
//       id: "3",
//       name: "Green Earth Society",
//       focusArea: "Environment, Agriculture",
//       coverage: "Indore Division",
//       contactPerson: "Mr. Amit Patel",
//       phone: "+91-9876543212",
//       email: "greenearth@example.org",
//       address: "789 Vijay Nagar, Indore, MP 452010",
//     },
//   ]
// }

// function AddNGODialog() {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button>
//           <Plus className="mr-2 h-4 w-4" />
//           Add NGO
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[525px]">
//         <DialogHeader>
//           <DialogTitle>Add New NGO</DialogTitle>
//           <DialogDescription>Add a new NGO to the directory for potential collaboration.</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">NGO Name</label>
//               <Input placeholder="Enter NGO name" />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Contact Person</label>
//               <Input placeholder="Contact person name" />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Phone</label>
//               <Input placeholder="+91-XXXXXXXXXX" />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Email</label>
//               <Input placeholder="contact@ngo.org" />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Focus Area</label>
//             <Input placeholder="e.g., Education, Healthcare, Environment" />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Coverage Area</label>
//             <Input placeholder="e.g., Bhopal District, Rural Areas" />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Address</label>
//             <Input placeholder="Complete address" />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button type="submit">Add NGO</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// function IntroduceToPanchayatDialog({ ngo }: { ngo: any }) {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="sm">
//           <Users className="mr-2 h-4 w-4" />
//           Introduce
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Introduce to Panchayat</DialogTitle>
//           <DialogDescription>Connect {ngo.name} with a panchayat for potential collaboration.</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Select Panchayat</label>
//             <Select>
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose panchayat" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="bhopal">Bhopal Rural Panchayat</SelectItem>
//                 <SelectItem value="sehore">Sehore Urban Panchayat</SelectItem>
//                 <SelectItem value="indore">Indore Rural Panchayat</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Introduction Message</label>
//             <Input
//               placeholder="Brief message about the collaboration opportunity"
//               defaultValue={`Introducing ${ngo.name} - specializing in ${ngo.focusArea}`}
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button type="submit">Send Introduction</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// function NGOsTable({ ngos }: { ngos: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Building2 className="h-5 w-5" />
//           NGO Directory
//         </CardTitle>
//         <CardDescription>Manage NGO contacts and facilitate panchayat collaborations</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {/* Search and Filter Controls */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search NGOs..." className="pl-8" />
//             </div>
//             <Select>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Focus Area" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Areas</SelectItem>
//                 <SelectItem value="education">Education</SelectItem>
//                 <SelectItem value="healthcare">Healthcare</SelectItem>
//                 <SelectItem value="environment">Environment</SelectItem>
//                 <SelectItem value="water">Water & Sanitation</SelectItem>
//               </SelectContent>
//             </Select>
//             <AddNGODialog />
//           </div>

//           {/* NGOs Grid */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {ngos.map((ngo) => (
//               <Card key={ngo.id}>
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg">{ngo.name}</CardTitle>
//                   <CardDescription>{ngo.contactPerson}</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2 text-sm">
//                       <Phone className="h-4 w-4 text-muted-foreground" />
//                       {ngo.phone}
//                     </div>
//                     <div className="flex items-center gap-2 text-sm">
//                       <Mail className="h-4 w-4 text-muted-foreground" />
//                       {ngo.email}
//                     </div>
//                     <div className="flex items-start gap-2 text-sm">
//                       <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
//                       <span className="line-clamp-2">{ngo.address}</span>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div>
//                       <span className="text-sm font-medium">Focus: </span>
//                       <span className="text-sm text-muted-foreground">{ngo.focusArea}</span>
//                     </div>
//                     <div>
//                       <span className="text-sm font-medium">Coverage: </span>
//                       <span className="text-sm text-muted-foreground">{ngo.coverage}</span>
//                     </div>
//                   </div>

//                   <div className="flex gap-2 pt-2">
//                     <IntroduceToPanchayatDialog ngo={ngo} />
//                     <Button variant="outline" size="sm">
//                       Edit
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export default async function AdminNGOsPage() {
//   const ngos = await getNGOs()

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">NGO Management</h2>
//       </div>

//       <Suspense fallback={<div>Loading NGOs...</div>}>
//         <NGOsTable ngos={ngos} />
//       </Suspense>
//     </div>
//   )
// }

// "use client"

// import { useEffect, useState } from "react"
// import { Suspense } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Building2, Search, Plus, Phone, Mail, MapPin, Users } from "lucide-react"

// function AddNGODialog({ onAdd }: { onAdd: (ngo: any) => void }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     contactName: "",
//     contactPhone: "",
//     contactEmail: "",
//     focusArea: "",
//     coverage: "",
//     address: "",
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async () => {
//     const res = await fetch("/api/ngos", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     })
//     if (res.ok) {
//       const newNGO = await res.json()
//       onAdd(newNGO) // update UI immediately
//     }
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button>
//           <Plus className="mr-2 h-4 w-4" />
//           Add NGO
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[525px]">
//         <DialogHeader>
//           <DialogTitle>Add New NGO</DialogTitle>
//           <DialogDescription>Add a new NGO to the directory for potential collaboration.</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">NGO Name</label>
//               <Input name="name" value={formData.name} onChange={handleChange} />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Contact Person</label>
//               <Input name="contactName" value={formData.contactName} onChange={handleChange} />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Phone</label>
//               <Input name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Email</label>
//               <Input name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Focus Area</label>
//             <Input name="focusArea" value={formData.focusArea} onChange={handleChange} />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Coverage Area</label>
//             <Input name="coverage" value={formData.coverage} onChange={handleChange} />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Address</label>
//             <Input name="address" value={formData.address} onChange={handleChange} />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button type="button" onClick={handleSubmit}>Add NGO</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// function NGOsTable({ ngos }: { ngos: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Building2 className="h-5 w-5" />
//           NGO Directory
//         </CardTitle>
//         <CardDescription>Manage NGO contacts and facilitate panchayat collaborations</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {ngos.map((ngo) => (
//               <Card key={ngo.id}>
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg">{ngo.name}</CardTitle>
//                   <CardDescription>{ngo.contactName}</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="flex items-center gap-2 text-sm">
//                     <Phone className="h-4 w-4" /> {ngo.contactPhone}
//                   </div>
//                   <div className="flex items-center gap-2 text-sm">
//                     <Mail className="h-4 w-4" /> {ngo.contactEmail}
//                   </div>
//                   <div className="flex items-start gap-2 text-sm">
//                     <MapPin className="h-4 w-4" /> {ngo.address}
//                   </div>
//                   <div>
//                     <span className="font-medium">Focus:</span> {ngo.focusArea}
//                   </div>
//                   <div>
//                     <span className="font-medium">Coverage:</span> {ngo.coverage}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export default function AdminNGOsPage() {
//   const [ngos, setNgos] = useState<any[]>([])

//   useEffect(() => {
//     fetch("/api/ngos")
//       .then((res) => res.json())
//       .then((data) => setNgos(data))
//   }, [])

//   const handleAddNGO = (newNGO: any) => {
//     setNgos((prev) => [newNGO, ...prev])
//   }

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">NGO Management</h2>
//         <AddNGODialog onAdd={handleAddNGO} />
//       </div>

//       <Suspense fallback={<div>Loading NGOs...</div>}>
//         <NGOsTable ngos={ngos} />
//       </Suspense>
//     </div>
//   )
// }

// "use client"

// import { useEffect, useState } from "react"
// import { Suspense } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Building2, Search, Plus, Phone, Mail, MapPin, Users } from "lucide-react"

// // ✅ Add NGO Dialog
// function AddNGODialog({ onAdd }: { onAdd: (ngo: any) => void }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     contactName: "",
//     contactPhone: "",
//     contactEmail: "",
//     focusArea: "",
//     coverage: "",
//     address: "",
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async () => {
//     const res = await fetch("/api/ngos", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     })
//     if (res.ok) {
//       const newNGO = await res.json()
//       onAdd(newNGO)
//     }
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button>
//           <Plus className="mr-2 h-4 w-4" />
//           Add NGO
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[525px]">
//         <DialogHeader>
//           <DialogTitle>Add New NGO</DialogTitle>
//           <DialogDescription>Add a new NGO to the directory for potential collaboration.</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">NGO Name</label>
//               <Input name="name" placeholder="Enter NGO name" value={formData.name} onChange={handleChange} />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Contact Person</label>
//               <Input name="contactName" placeholder="Contact person name" value={formData.contactName} onChange={handleChange} />
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Phone</label>
//               <Input name="contactPhone" placeholder="+91-XXXXXXXXXX" value={formData.contactPhone} onChange={handleChange} />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Email</label>
//               <Input name="contactEmail" placeholder="contact@ngo.org" value={formData.contactEmail} onChange={handleChange} />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Focus Area</label>
//             <Input name="focusArea" placeholder="e.g., Education, Healthcare" value={formData.focusArea} onChange={handleChange} />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Coverage Area</label>
//             <Input name="coverage" placeholder="e.g., Bhopal District" value={formData.coverage} onChange={handleChange} />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Address</label>
//             <Input name="address" placeholder="Complete address" value={formData.address} onChange={handleChange} />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button type="button" onClick={handleSubmit}>Add NGO</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// // ✅ Introduce Dialog
// function IntroduceToPanchayatDialog({ ngo }: { ngo: any }) {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="sm">
//           <Users className="mr-2 h-4 w-4" />
//           Introduce
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Introduce to Panchayat</DialogTitle>
//           <DialogDescription>Connect {ngo.name} with a panchayat for potential collaboration.</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Select Panchayat</label>
//             <Select>
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose panchayat" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="bhopal">Bhopal Rural Panchayat</SelectItem>
//                 <SelectItem value="sehore">Sehore Urban Panchayat</SelectItem>
//                 <SelectItem value="indore">Indore Rural Panchayat</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Introduction Message</label>
//             <Input defaultValue={`Introducing ${ngo.name} - specializing in ${ngo.focusArea}`} />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button type="submit">Send Introduction</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// // ✅ NGOs Table with Search & Filter
// function NGOsTable({ ngos }: { ngos: any[] }) {
//   const [search, setSearch] = useState("")
//   const [focusFilter, setFocusFilter] = useState("all")

//   const filteredNGOs = ngos.filter((ngo) =>
//     ngo.name.toLowerCase().includes(search.toLowerCase()) &&
//     (focusFilter === "all" || ngo.focusArea.toLowerCase().includes(focusFilter))
//   )

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Building2 className="h-5 w-5" />
//           NGO Directory
//         </CardTitle>
//         <CardDescription>Manage NGO contacts and facilitate panchayat collaborations</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {/* Search and Filter */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search NGOs..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
//             </div>
//             <Select onValueChange={(val) => setFocusFilter(val)}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Focus Area" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Areas</SelectItem>
//                 <SelectItem value="education">Education</SelectItem>
//                 <SelectItem value="healthcare">Healthcare</SelectItem>
//                 <SelectItem value="environment">Environment</SelectItem>
//                 <SelectItem value="water">Water & Sanitation</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* NGOs Grid */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {filteredNGOs.map((ngo) => (
//               <Card key={ngo.id}>
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg">{ngo.name}</CardTitle>
//                   <CardDescription>{ngo.contactName}</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2 text-sm">
//                       <Phone className="h-4 w-4 text-muted-foreground" /> {ngo.contactPhone}
//                     </div>
//                     <div className="flex items-center gap-2 text-sm">
//                       <Mail className="h-4 w-4 text-muted-foreground" /> {ngo.contactEmail}
//                     </div>
//                     <div className="flex items-start gap-2 text-sm">
//                       <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /> {ngo.address}
//                     </div>
//                   </div>
//                   <div>
//                     <span className="font-medium">Focus: </span>{ngo.focusArea}
//                   </div>
//                   <div>
//                     <span className="font-medium">Coverage: </span>{ngo.coverage}
//                   </div>
//                   <div className="flex gap-2 pt-2">
//                     <IntroduceToPanchayatDialog ngo={ngo} />
//                     <Button variant="outline" size="sm">Edit</Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// // ✅ Main Page
// export default function AdminNGOsPage() {
//   const [ngos, setNgos] = useState<any[]>([])

//   useEffect(() => {
//     fetch("/api/ngos")
//       .then((res) => res.json())
//       .then((data) => setNgos(data))
//   }, [])

//   const handleAddNGO = (newNGO: any) => {
//     setNgos((prev) => [newNGO, ...prev])
//   }

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-3xl font-bold tracking-tight">NGO Management</h2>
//         <AddNGODialog onAdd={handleAddNGO} />
//       </div>

//       <Suspense fallback={<div>Loading NGOs...</div>}>
//         <NGOsTable ngos={ngos} />
//       </Suspense>
//     </div>
//   )
// }

"use client"

import { useEffect, useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Search, Plus, Phone, Mail, MapPin, Users, Trash2 } from "lucide-react"

// ✅ Add NGO Dialog
function AddNGODialog({ onAdd }: { onAdd: (ngo: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    focusArea: "",
    coverage: "",
    address: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const res = await fetch("/api/ngos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    if (res.ok) {
      const newNGO = await res.json()
      onAdd(newNGO)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add NGO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New NGO</DialogTitle>
          <DialogDescription>Add a new NGO to the directory for potential collaboration.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">NGO Name</label>
              <Input name="name" placeholder="Enter NGO name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Person</label>
              <Input name="contactName" placeholder="Contact person name" value={formData.contactName} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input name="contactPhone" placeholder="+91-XXXXXXXXXX" value={formData.contactPhone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input name="contactEmail" placeholder="contact@ngo.org" value={formData.contactEmail} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Focus Area</label>
            <Input name="focusArea" placeholder="e.g., Education, Healthcare" value={formData.focusArea} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Coverage Area</label>
            <Input name="coverage" placeholder="e.g., Bhopal District" value={formData.coverage} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input name="address" placeholder="Complete address" value={formData.address} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>Add NGO</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ✅ Introduce Dialog
function IntroduceToPanchayatDialog({ ngo }: { ngo: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          Introduce
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Introduce to Panchayat</DialogTitle>
          <DialogDescription>Connect {ngo.name} with a panchayat for potential collaboration.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Panchayat</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose panchayat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bhopal">Bhopal Rural Panchayat</SelectItem>
                <SelectItem value="sehore">Sehore Urban Panchayat</SelectItem>
                <SelectItem value="indore">Indore Rural Panchayat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Introduction Message</label>
            <Input defaultValue={`Introducing ${ngo.name} - specializing in ${ngo.focusArea}`} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Send Introduction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ✅ NGOs Table with Search & Filter
function NGOsTable({ ngos, onDelete }: { ngos: any[]; onDelete: (id: string) => void }) {
  const [search, setSearch] = useState("")
  const [focusFilter, setFocusFilter] = useState("all")

  const filteredNGOs = ngos.filter((ngo) =>
    ngo.name.toLowerCase().includes(search.toLowerCase()) &&
    (focusFilter === "all" || ngo.focusArea.toLowerCase().includes(focusFilter))
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          NGO Directory
        </CardTitle>
        <CardDescription>Manage NGO contacts and facilitate panchayat collaborations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search NGOs..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select onValueChange={(val) => setFocusFilter(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Focus Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="water">Water & Sanitation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NGOs Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNGOs.map((ngo) => (
              <Card key={ngo.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{ngo.name}</CardTitle>
                  <CardDescription>{ngo.contactName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" /> {ngo.contactPhone}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" /> {ngo.contactEmail}
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /> {ngo.address}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Focus: </span>{ngo.focusArea}
                  </div>
                  <div>
                    <span className="font-medium">Coverage: </span>{ngo.coverage}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <IntroduceToPanchayatDialog ngo={ngo} />
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(ngo.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ✅ Main Page
export default function AdminNGOsPage() {
  const [ngos, setNgos] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/ngos")
      .then((res) => res.json())
      .then((data) => setNgos(data))
  }, [])

  const handleAddNGO = (newNGO: any) => {
    setNgos((prev) => [newNGO, ...prev])
  }

  const handleDeleteNGO = async (ngoId: string) => {
    try {
      const res = await fetch(`/api/ngos/${ngoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNgos((prevNgos) => prevNgos.filter((ngo) => ngo.id !== ngoId));
      }
    } catch (error) {
      console.error("Failed to delete NGO:", error);
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">NGO Management</h2>
        <AddNGODialog onAdd={handleAddNGO} />
      </div>

      <Suspense fallback={<div>Loading NGOs...</div>}>
        <NGOsTable ngos={ngos} onDelete={handleDeleteNGO} />
      </Suspense>
    </div>
  )
}
