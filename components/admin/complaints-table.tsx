
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
import { AlertTriangle, Search, MessageSquare, Calendar, Building, FileText, User, MapPin, Phone, Mail, Eye } from "lucide-react"

// Define the interface for a single complaint
interface Complaint {
  id: string
  subject: string
  description: string
  status: string
  createdAt: string
  resolution: string | null
  user: {
    id: string
    name: string
    email: string
    phone?: string
    panchayat?: {
      id: string
      name: string
      district: string
      state: string
    } | null
  }
  query?: {
    id: string
    title: string
    description: string
    status: string
    createdAt: string
    updatedAt: string
    latitude?: number
    longitude?: number
    attachments: {
      id: string
      url: string
      filename: string
      type: string
      size: number
    }[]
    department?: {
      id: string
      name: string
      description?: string
    }
    panchayat?: {
      id: string
      name: string
      district: string
      state: string
    }
    office?: {
      id: string
      name: string
      address: string
      contactPhone?: string
      contactEmail?: string
    }
    user: {
      id: string
      name: string
      email: string
      phone?: string
      panchayat?: {
        id: string
        name: string
        district: string
        state: string
      }
    }
  } | null
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

// --- Details Dialog Component ---
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{complaint.subject}</DialogTitle>
          <DialogDescription>Full details for complaint ID: {complaint.id}</DialogDescription>
        </DialogHeader>
                <div className="py-4 space-y-6">
                    {/* Complaint Details */}
                    <div className="p-4 bg-muted/50 dark:bg-gray-800/70 rounded-lg">
                        <h4 className="font-semibold mb-2 dark:text-white">Complaint Description</h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-300 whitespace-pre-wrap">{complaint.description}</p>
                    </div>
                    
                    {/* Complainant Details */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 dark:text-white">
                            <User className="h-4 w-4" />
                            Complainant Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailItem
                                icon={<User size={20} />}
                                label="Name"
                                value={complaint.user.name}
                            />
                            <DetailItem
                                icon={<Mail size={20} />}
                                label="Email"
                                value={complaint.user.email}
                            />
                            {complaint.user.phone && (
                                <DetailItem
                                    icon={<Phone size={20} />}
                                    label="Phone"
                                    value={complaint.user.phone}
                                />
                            )}
                            <DetailItem
                                icon={<Building size={20} />}
                                label="Panchayat"
                                value={complaint.user.panchayat ? `${complaint.user.panchayat.name}, ${complaint.user.panchayat.district}, ${complaint.user.panchayat.state}` : "Not available"}
                            />
                        </div>
                    </div>

                    {/* Query Details (if complaint is related to a query) */}
                    {complaint.query && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 rounded-lg">
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-800 dark:text-red-300">
                                <FileText className="h-4 w-4" />
                                Related Query Details (Declined Query)
                            </h4>
                            
                            <div className="space-y-4">
                                {/* Query Basic Info */}
                                <div>
                                    <h5 className="font-medium text-red-700 mb-2">Query Information</h5>
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-700">
                                        <p className="font-medium text-gray-900 dark:text-white mb-1">{complaint.query.title}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 whitespace-pre-wrap">{complaint.query.description}</p>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-red-100 text-red-800 dark:bg-red-700 dark:text-white">
                                                {complaint.query.status.replace('_', ' ')}
                                            </Badge>
                                            {complaint.query.department && (
                                                <Badge variant="secondary">
                                                    {complaint.query.department.name}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Query Submitter Details */}
                                <div>
                                    <h5 className="font-medium text-red-700 mb-2">Query Submitted By</h5>
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-700">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{complaint.query.user.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{complaint.query.user.email}</p>
                                            </div>
                                            {complaint.query.user.phone && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</p>
                                                    <p className="text-sm text-gray-900 dark:text-white">{complaint.query.user.phone}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Panchayat</p>
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {complaint.query.user.panchayat ? 
                                                        `${complaint.query.user.panchayat.name}, ${complaint.query.user.panchayat.district}, ${complaint.query.user.panchayat.state}` : 
                                                        "Not available"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Query Attachments */}
                                {complaint.query.attachments && complaint.query.attachments.length > 0 && (
                                    <div>
                                        <h5 className="font-medium text-red-700 mb-2">Query Attachments</h5>
                                        <div className="bg-white p-3 rounded border dark:border-gray-700">
                                            <div className="flex flex-wrap gap-2">
                                                {complaint.query.attachments.map((attachment) => (
                                                    <a
                                                        key={attachment.id}
                                                        href={attachment.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
                                                    >
                                                        <FileText className="h-3 w-3 mr-1" />
                                                        {attachment.filename}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Query Office/Department Info */}
                                {(complaint.query.office || complaint.query.panchayat) && (
                                    <div>
                                        <h5 className="font-medium text-red-700 mb-2">Query Assignment</h5>
                                        <div className="bg-white p-3 rounded border dark:border-gray-700 dark:bg-gray-800">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {complaint.query.office && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Office</p>
                                                        <p className="text-sm text-gray-900 dark:text-white">{complaint.query.office.name}</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{complaint.query.office.address}</p>
                                                    </div>
                                                )}
                                                {complaint.query.panchayat && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Query Panchayat</p>
                                                        <p className="text-sm text-gray-900 dark:text-white">
                                                            {complaint.query.panchayat.name}, {complaint.query.panchayat.district}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="text-xs text-red-600">
                                    Query submitted on: {formatDate(complaint.query.createdAt)}
                                </div>
                            </div>
                        </div>
                    )}

                     {complaint.resolution && (
                        <div className="p-4 bg-green-50 rounded-lg dark:bg-gray-800">
                            <h4 className="font-semibold mb-2">Resolution Note</h4>
                            <p className="text-sm text-green-800 whitespace-pre-wrap dark:text-white/500">{complaint.resolution}</p>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            icon={<FileText size={20} />}
                            label="Type"
                            value={complaint.query ? "Query-related Complaint" : "Direct Complaint"}
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
            {/* Desktop Table */}
            <div className="hidden lg:block rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Complaint</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Panchayat</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
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
                            {complaint.query && (
                              <div className="mt-2 p-2 bg-red-50 rounded border-l-2 border-red-400">
                                <p className="text-xs text-red-700 font-medium">Related Query: {complaint.query.title}</p>
                                <p className="text-xs text-red-600">Status: {complaint.query.status.replace('_', ' ')}</p>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div>
                            {complaint.user.panchayat ? (
                              <div>
                                <div className="text-sm text-blue-600 font-medium">
                                  <MapPin className="h-3 w-3 inline mr-1" />
                                  {complaint.user.panchayat.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {complaint.user.panchayat.district}, {complaint.user.panchayat.state}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground italic">Anonymous</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex flex-col gap-1">
                            {complaint.query ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Query-related
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                                Direct
                              </Badge>
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
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" onClick={() => setComplaintToUpdate(complaint)}>
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setComplaintToView(complaint)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                            {complaint.query && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setComplaintToView(complaint)}
                                className="text-xs bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                View with Query
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredComplaints.map((complaint) => (
                <Card key={complaint.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base truncate">{complaint.subject}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{complaint.description}</p>
                      </div>
                      <Badge className={`ml-2 ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace("_", " ")}
                      </Badge>
                    </div>

                    {complaint.query && (
                      <div className="p-2 bg-red-50 rounded border-l-2 border-red-400">
                        <p className="text-xs text-red-700 font-medium">Related Query: {complaint.query.title}</p>
                        <p className="text-xs text-red-600">Status: {complaint.query.status.replace('_', ' ')}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(complaint.createdAt).toLocaleDateString("en-IN")}
                      </div>
                      <div className="flex items-center gap-2">
                        {complaint.query ? (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                            Query-related
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 text-xs">
                            Direct
                          </Badge>
                        )}
                      </div>
                    </div>

                    {complaint.user.panchayat && (
                      <div className="flex items-center text-sm text-blue-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {complaint.user.panchayat.name}, {complaint.user.panchayat.district}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setComplaintToUpdate(complaint)}
                        className="flex-1 min-h-9"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Update
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setComplaintToView(complaint)}
                        className="flex-1 min-h-9"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
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
