// import { Suspense } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
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
// import { AlertTriangle, Search, MessageSquare } from "lucide-react"

// async function getDirectComplaints() {
//   // In a real app, this would fetch from API
//   return [
//     {
//       id: "1",
//       subject: "Corruption in Road Contract",
//       description: "Irregularities observed in road construction tender process...",
//       user: { name: "Anonymous", email: "anonymous@example.com" },
//       status: "PENDING",
//       createdAt: "2024-01-20T10:00:00Z",
//       resolutionNote: null,
//     },
//     {
//       id: "2",
//       subject: "Misuse of Funds",
//       description: "Funds allocated for water supply project being diverted...",
//       user: { name: "Concerned Citizen", email: "citizen@example.com" },
//       status: "UNDER_REVIEW",
//       createdAt: "2024-01-18T14:30:00Z",
//       resolutionNote: "Investigation initiated. Audit team assigned.",
//     },
//     {
//       id: "3",
//       subject: "Nepotism in Hiring",
//       description: "Unfair hiring practices in panchayat staff recruitment...",
//       user: { name: "Whistleblower", email: "whistleblower@example.com" },
//       status: "RESOLVED",
//       createdAt: "2024-01-15T09:15:00Z",
//       resolutionNote: "Matter investigated and resolved. Proper procedures now in place.",
//     },
//   ]
// }

// function getStatusColor(status: string) {
//   switch (status) {
//     case "PENDING":
//       return "bg-yellow-100 text-yellow-800"
//     case "UNDER_REVIEW":
//       return "bg-blue-100 text-blue-800"
//     case "RESOLVED":
//       return "bg-green-100 text-green-800"
//     case "DISMISSED":
//       return "bg-gray-100 text-gray-800"
//     default:
//       return "bg-gray-100 text-gray-800"
//   }
// }

// function ComplaintUpdateDialog({ complaint }: { complaint: any }) {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="sm">
//           <MessageSquare className="mr-2 h-4 w-4" />
//           Update
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[525px]">
//         <DialogHeader>
//           <DialogTitle>Update Complaint Status</DialogTitle>
//           <DialogDescription>Update the status and add resolution notes for this complaint.</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Status</label>
//             <Select defaultValue={complaint.status}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="PENDING">Pending</SelectItem>
//                 <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
//                 <SelectItem value="RESOLVED">Resolved</SelectItem>
//                 <SelectItem value="DISMISSED">Dismissed</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Resolution Note</label>
//             <Textarea
//               placeholder="Add notes about the resolution or current status..."
//               defaultValue={complaint.resolutionNote || ""}
//               rows={4}
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button type="submit">Update Complaint</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// function ComplaintsTable({ complaints }: { complaints: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <AlertTriangle className="h-5 w-5" />
//           Direct Complaints
//         </CardTitle>
//         <CardDescription>Complaints filed directly with admin authority</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {/* Search Controls */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search complaints..." className="pl-8" />
//             </div>
//             <Select>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="under-review">Under Review</SelectItem>
//                 <SelectItem value="resolved">Resolved</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Complaints Table */}
//           <div className="rounded-md border">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b bg-muted/50">
//                     <th className="h-12 px-4 text-left align-middle font-medium">Complaint</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Complainant</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {complaints.map((complaint) => (
//                     <tr key={complaint.id} className="border-b">
//                       <td className="p-4">
//                         <div>
//                           <div className="font-medium">{complaint.subject}</div>
//                           <div className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div>
//                           <div className="font-medium">{complaint.user.name}</div>
//                           <div className="text-sm text-muted-foreground">{complaint.user.email}</div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <Badge className={getStatusColor(complaint.status)}>{complaint.status.replace("_", " ")}</Badge>
//                       </td>
//                       <td className="p-4">
//                         <div className="text-sm">{new Date(complaint.createdAt).toLocaleDateString("en-IN")}</div>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex gap-2">
//                           <ComplaintUpdateDialog complaint={complaint} />
//                           <Button variant="outline" size="sm">
//                             View Details
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export default async function AdminComplaintsPage() {
//   const complaints = await getDirectComplaints()

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">Complaints Management</h2>
//       </div>

//       <Suspense fallback={<div>Loading complaints...</div>}>
//         <ComplaintsTable complaints={complaints} />
//       </Suspense>
//     </div>
//   )
// }

// app/dashboard/admin/complaints/page.tsx (your file path)

// app/dashboard/admin/complaints/page.tsx (your file path)
// app/dashboard/admin/complaints/page.tsx (your file path)

// import { Suspense } from "react"
// import { headers } from "next/headers"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
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
// import { AlertTriangle, Search, MessageSquare } from "lucide-react"

// async function getDirectComplaints() {
//   const host = headers().get("host")
//   const protocol = process.env.NODE_ENV === "development" ? "http" : "https"

//   const response = await fetch(`${protocol}://${host}/api/admin/complaints`, {
//     headers: new Headers(headers()),
//   })

//   if (!response.ok) {
//     console.error("Failed to fetch complaints")
//     return []
//   }

//   return response.json()
// }

// function getStatusColor(status: string) {
//   switch (status) {
//     case "OPEN":
//       return "bg-yellow-100 text-yellow-800"
//     case "UNDER_REVIEW":
//       return "bg-blue-100 text-blue-800"
//     case "RESOLVED":
//     case "CLOSED":
//       return "bg-green-100 text-green-800"
//     default:
//       return "bg-gray-100 text-gray-800"
//   }
// }

// function ComplaintUpdateDialog({ complaint }: { complaint: any }) {
//   // NOTE: The logic to submit this form still needs to be implemented.
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="sm">
//           <MessageSquare className="mr-2 h-4 w-4" />
//           Update
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[525px]">
//         <DialogHeader>
//           <DialogTitle>Update Complaint Status</DialogTitle>
//           <DialogDescription>Update the status and add resolution notes for this complaint.</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Status</label>
//             <Select defaultValue={complaint.status}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="OPEN">Open</SelectItem>
//                 <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
//                 <SelectItem value="RESOLVED">Resolved</SelectItem>
//                 <SelectItem value="CLOSED">Closed</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Resolution Note</label>
//             <Textarea
//               placeholder="Add notes about the resolution or current status..."
//               defaultValue={complaint.resolution || ""}
//               rows={4}
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button type="submit">Update Complaint</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// function ComplaintsTable({ complaints }: { complaints: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <AlertTriangle className="h-5 w-5" />
//           Direct Complaints
//         </CardTitle>
//         <CardDescription>Complaints filed directly with admin authority</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search complaints..." className="pl-8" />
//             </div>
//             <Select>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="OPEN">Open</SelectItem>
//                 <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
//                 <SelectItem value="RESOLVED">Resolved</SelectItem>
//                 <SelectItem value="CLOSED">Closed</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="rounded-md border">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b bg-muted/50">
//                     <th className="h-12 px-4 text-left align-middle font-medium">Complaint</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Complainant</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {complaints.map((complaint) => (
//                     <tr key={complaint.id} className="border-b">
//                       <td className="p-4 align-top">
//                         <div>
//                           <div className="font-medium">{complaint.subject}</div>
//                           <div className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</div>
//                         </div>
//                       </td>
//                       {/* --- THIS IS THE UPDATED COMPLAINANT CELL --- */}
//                       <td className="p-4 align-top">
//                         <div>
//                           <div className="font-medium">Anonymous</div>
//                           {complaint.user.panchayat ? (
//                             <div className="text-sm text-muted-foreground">
//                               {complaint.user.panchayat.name}
//                             </div>
//                           ) : (
//                             <div className="text-sm text-muted-foreground italic">
//                               No Panchayat
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="p-4 align-top">
//                         <Badge className={getStatusColor(complaint.status)}>{complaint.status.replace("_", " ")}</Badge>
//                       </td>
//                       <td className="p-4 align-top">
//                         <div className="text-sm">{new Date(complaint.createdAt).toLocaleDateString("en-IN")}</div>
//                       </td>
//                       <td className="p-4 align-top">
//                         <div className="flex gap-2">
//                           <ComplaintUpdateDialog complaint={complaint} />
//                           <Button variant="outline" size="sm">
//                             View Details
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export default async function AdminComplaintsPage() {
//   const complaints = await getDirectComplaints()

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">Complaints Management</h2>
//       </div>

//       <Suspense fallback={<div>Loading complaints...</div>}>
//         <ComplaintsTable complaints={complaints} />
//       </Suspense>
//     </div>
//   )
// }

// app/dashboard/admin/complaints/page.tsx

import { Suspense } from "react"
import { headers } from "next/headers"
import { ComplaintsTable } from "@/components/admin/complaints-table"
import { Complaint } from "@/lib/types" // It's good practice to define types in a central file

// This function fetches data on the server
async function getDirectComplaints(): Promise<Complaint[]> {
  // Construct the full URL for server-side fetching
  const host = headers().get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const url = `${protocol}://${host}/api/admin/complaints`

  const response = await fetch(url, {
    headers: new Headers(headers()), // Forward headers for authentication
    cache: "no-store", // Ensure fresh data on every request
  })

  if (!response.ok) {
    console.error("Failed to fetch complaints:", await response.text())
    return []
  }

  return response.json()
}

export default async function AdminComplaintsPage() {
  const complaints = await getDirectComplaints()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Complaints Management</h2>
      </div>

      <Suspense fallback={<div>Loading complaints...</div>}>
        <ComplaintsTable initialComplaints={complaints} />
      </Suspense>
    </div>
  )
}