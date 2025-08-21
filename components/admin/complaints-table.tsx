// components/admin/complaints-table.tsx

// "use client"

// import { useState, useEffect } from "react"
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

// // Define the interface for a single complaint
// interface Complaint {
//   id: string
//   subject: string
//   description: string
//   status: string
//   createdAt: string
//   resolution: string | null
//   user: {
//     panchayat?: {
//       name: string
//     } | null
//   }
// }

// // Helper functions and sub-components
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

// function ComplaintUpdateDialog({ complaint }: { complaint: Complaint }) {
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

// export function ComplaintsTable({ initialComplaints }: { initialComplaints: Complaint[] }) {
//   const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(initialComplaints)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")

//   useEffect(() => {
//     let complaintsToFilter = [...initialComplaints]

//     // Apply search filter (by subject)
//     if (searchTerm) {
//       complaintsToFilter = complaintsToFilter.filter((complaint) =>
//         complaint.subject.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     }

//     // Apply status filter
//     if (statusFilter !== "all") {
//       complaintsToFilter = complaintsToFilter.filter((complaint) => complaint.status === statusFilter)
//     }

//     setFilteredComplaints(complaintsToFilter)
//   }, [searchTerm, statusFilter, initialComplaints])

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
//               <Input
//                 placeholder="Search by subject..."
//                 className="pl-8"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
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
//                   {filteredComplaints.map((complaint) => (
//                     <tr key={complaint.id} className="border-b">
//                       <td className="p-4 align-top">
//                         <div>
//                           <div className="font-medium">{complaint.subject}</div>
//                           <div className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</div>
//                         </div>
//                       </td>
//                       <td className="p-4 align-top">
//                         <div>
//                           <div className="font-medium">Anonymous</div>
//                           {complaint.user.panchayat ? (
//                             <div className="text-sm text-muted-foreground">{complaint.user.panchayat.name}</div>
//                           ) : (
//                             <div className="text-sm text-muted-foreground italic">No Panchayat</div>
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

// components/admin/complaints-table.tsx

// "use client"

// import { useState, useEffect } from "react"
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
// } from "@/components/ui/dialog"
// import { AlertTriangle, Search, MessageSquare } from "lucide-react"

// // Define the interface for a single complaint
// interface Complaint {
//   id: string
//   subject: string
//   description: string
//   status: string
//   createdAt: string
//   resolution: string | null
//   user: {
//     panchayat?: {
//       name: string
//     } | null
//   }
// }

// // Helper function
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

// // DIALOG COMPONENT
// function ComplaintUpdateDialog({
//   complaint,
//   open,
//   onOpenChange,
//   onUpdateSuccess,
// }: {
//   complaint: Complaint
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   onUpdateSuccess: (updatedComplaint: Complaint) => void
// }) {
//   const [status, setStatus] = useState(complaint.status)
//   const [resolutionNote, setResolutionNote] = useState(complaint.resolution || "")
//   const [isUpdating, setIsUpdating] = useState(false)

//   const handleSubmit = async () => {
//     setIsUpdating(true)
//     try {
//       const response = await fetch(`/api/admin/complaints/${complaint.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           status: status,
//           resolution: resolutionNote,
//         }),
//       })

//       if (response.ok) {
//         const updatedData = await response.json()
//         onUpdateSuccess(updatedData)
//       } else {
//         console.error("Failed to update complaint")
//       }
//     } catch (error) {
//       console.error("An error occurred:", error)
//     } finally {
//       setIsUpdating(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[525px]">
//         <DialogHeader>
//           <DialogTitle>Update Complaint Status</DialogTitle>
//           <DialogDescription>Update the status and add resolution notes for this complaint.</DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Status</label>
//             <Select value={status} onValueChange={setStatus}>
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
//               value={resolutionNote}
//               onChange={(e) => setResolutionNote(e.target.value)}
//               rows={4}
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button onClick={handleSubmit} disabled={isUpdating}>
//             {isUpdating ? "Updating..." : "Update Complaint"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// // MAIN TABLE COMPONENT
// export function ComplaintsTable({ initialComplaints }: { initialComplaints: Complaint[] }) {
//   const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints)
//   const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(initialComplaints)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)

//   useEffect(() => {
//     let complaintsToFilter = [...complaints]
//     if (searchTerm) {
//       complaintsToFilter = complaintsToFilter.filter((c) => c.subject.toLowerCase().includes(searchTerm.toLowerCase()))
//     }
//     if (statusFilter !== "all") {
//       complaintsToFilter = complaintsToFilter.filter((c) => c.status === statusFilter)
//     }
//     setFilteredComplaints(complaintsToFilter)
//   }, [searchTerm, statusFilter, complaints])

//   const handleUpdateSuccess = (updatedComplaint: Complaint) => {
//     const newComplaints = complaints.map((c) => (c.id === updatedComplaint.id ? updatedComplaint : c))
//     setComplaints(newComplaints)
//     setSelectedComplaint(null)
//   }

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <AlertTriangle className="h-5 w-5" />
//             Direct Complaints
//           </CardTitle>
//           <CardDescription>Complaints filed directly with admin authority</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search by subject..."
//                   className="pl-8"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="OPEN">Open</SelectItem>
//                   <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
//                   <SelectItem value="RESOLVED">Resolved</SelectItem>
//                   <SelectItem value="CLOSED">Closed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="rounded-md border">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b bg-muted/50">
//                       <th className="h-12 px-4 text-left align-middle font-medium">Complaint</th>
//                       <th className="h-12 px-4 text-left align-middle font-medium">Complainant</th>
//                       <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
//                       <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
//                       <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredComplaints.map((complaint) => (
//                       <tr key={complaint.id} className="border-b">
//                         <td className="p-4 align-top">
//                           <div>
//                             <div className="font-medium">{complaint.subject}</div>
//                             <div className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</div>
//                           </div>
//                         </td>
//                         <td className="p-4 align-top">
//                           <div>
//                             <div className="font-medium">Anonymous</div>
//                             {complaint.user.panchayat ? (
//                               <div className="text-sm text-muted-foreground">{complaint.user.panchayat.name}</div>
//                             ) : (
//                               <div className="text-sm text-muted-foreground italic">No Panchayat</div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="p-4 align-top">
//                           <Badge className={getStatusColor(complaint.status)}>{complaint.status.replace("_", " ")}</Badge>
//                         </td>
//                         <td className="p-4 align-top">
//                           <div className="text-sm">{new Date(complaint.createdAt).toLocaleDateString("en-IN")}</div>
//                         </td>
//                         <td className="p-4 align-top">
//                           <div className="flex gap-2">
//                             <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(complaint)}>
//                               <MessageSquare className="mr-2 h-4 w-4" />
//                               Update
//                             </Button>
//                             <Button variant="outline" size="sm">
//                               View Details
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//       {selectedComplaint && (
//         <ComplaintUpdateDialog
//           complaint={selectedComplaint}
//           open={!!selectedComplaint}
//           onOpenChange={() => setSelectedComplaint(null)}
//           onUpdateSuccess={handleUpdateSuccess}
//         />
//       )}
//     </>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { AlertTriangle, Search, MessageSquare, Calendar, Building } from "lucide-react"

// Define the interface for a single complaint
interface Complaint {
  id: string
  subject: string
  description: string
  status: string
  createdAt: string
  resolution: string | null
  user: {
    panchayat?: {
      name: string
    } | null
  }
}

// Helper functions
function getStatusColor(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-yellow-100 text-yellow-800"
    case "UNDER_REVIEW":
      return "bg-blue-100 text-blue-800"
    case "RESOLVED":
    case "CLOSED":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Update Dialog Component
function ComplaintUpdateDialog({
  complaint,
  open,
  onOpenChange,
  onUpdateSuccess,
}: {
  complaint: Complaint
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateSuccess: (updatedComplaint: Complaint) => void
}) {
  const [status, setStatus] = useState(complaint.status)
  const [resolutionNote, setResolutionNote] = useState(complaint.resolution || "")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSubmit = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/complaints/${complaint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status,
          resolution: resolutionNote,
        }),
      })

      if (response.ok) {
        const updatedData = await response.json()
        onUpdateSuccess(updatedData)
      } else {
        console.error("Failed to update complaint")
      }
    } catch (error) {
      console.error("An error occurred:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update Complaint Status</DialogTitle>
          <DialogDescription>Update the status and add resolution notes for this complaint.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Resolution Note</label>
            <Textarea
              placeholder="Add notes about the resolution or current status..."
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Complaint"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- NEW: Details Dialog Component ---
function ComplaintDetailsDialog({ complaint, open, onOpenChange }: { complaint: Complaint; open: boolean; onOpenChange: (open: boolean) => void }) {
    const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
        <div className="flex items-start">
          <div className="flex-shrink-0 w-6 h-6 text-muted-foreground">{icon}</div>
          <div className="ml-2">
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="text-md">{value}</p>
          </div>
        </div>
      );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{complaint.subject}</DialogTitle>
                    <DialogDescription>Full details for complaint ID: {complaint.id}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{complaint.description}</p>
                    </div>
                     {complaint.resolution && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Resolution Note</h4>
                            <p className="text-sm text-blue-800">{complaint.resolution}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailItem
                            icon={<Badge className={getStatusColor(complaint.status)}> </Badge>}
                            label="Status"
                            value={complaint.status.replace("_", " ")}
                        />
                        <DetailItem
                            icon={<Calendar size={20} />}
                            label="Submitted On"
                            value={formatDate(complaint.createdAt)}
                        />
                        <DetailItem
                            icon={<Building size={20} />}
                            label="Panchayat"
                            value={complaint.user.panchayat?.name || "Not available"}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}


// MAIN TABLE COMPONENT
export function ComplaintsTable({ initialComplaints }: { initialComplaints: Complaint[] }) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints)
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(initialComplaints)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [complaintToUpdate, setComplaintToUpdate] = useState<Complaint | null>(null)
  const [complaintToView, setComplaintToView] = useState<Complaint | null>(null)

  useEffect(() => {
    let complaintsToFilter = [...complaints]
    if (searchTerm) {
      complaintsToFilter = complaintsToFilter.filter((c) => c.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (statusFilter !== "all") {
      complaintsToFilter = complaintsToFilter.filter((c) => c.status === statusFilter)
    }
    setFilteredComplaints(complaintsToFilter)
  }, [searchTerm, statusFilter, complaints])

  const handleUpdateSuccess = (updatedComplaint: Complaint) => {
    const newComplaints = complaints.map((c) => (c.id === updatedComplaint.id ? updatedComplaint : c))
    setComplaints(newComplaints)
    setComplaintToUpdate(null) // Close the update dialog
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Direct Complaints
          </CardTitle>
          <CardDescription>Complaints filed directly with admin authority</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by subject..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Complaint</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Complainant</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((complaint) => (
                      <tr key={complaint.id} className="border-b">
                        <td className="p-4 align-top">
                          <div>
                            <div className="font-medium">{complaint.subject}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</div>
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div>
                            <div className="font-medium">Anonymous</div>
                            {complaint.user.panchayat ? (
                              <div className="text-sm text-muted-foreground">{complaint.user.panchayat.name}</div>
                            ) : (
                              <div className="text-sm text-muted-foreground italic">No Panchayat</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <Badge className={getStatusColor(complaint.status)}>{complaint.status.replace("_", " ")}</Badge>
                        </td>
                        <td className="p-4 align-top">
                          <div className="text-sm">{new Date(complaint.createdAt).toLocaleDateString("en-IN")}</div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setComplaintToUpdate(complaint)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Update
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setComplaintToView(complaint)}>
                              View Details
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {complaintToUpdate && (
        <ComplaintUpdateDialog
          complaint={complaintToUpdate}
          open={!!complaintToUpdate}
          onOpenChange={() => setComplaintToUpdate(null)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {complaintToView && (
          <ComplaintDetailsDialog
            complaint={complaintToView}
            open={!!complaintToView}
            onOpenChange={() => setComplaintToView(null)}
          />
      )}
    </>
  )
}
