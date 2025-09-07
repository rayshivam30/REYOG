
"use client"

import { useState, useEffect } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Search, Download, Calendar, MapPin, Building, Banknote } from "lucide-react"

// Define interfaces for our data
interface Panchayat {
  id: string
  name: string
}

interface Query {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  budgetIssued: number
  budgetSpent: number
  latitude?: number | null
  longitude?: number | null
  department?: { name: string } | null
  panchayat?: Panchayat | null
}

// Helper functions
function getStatusColor(status: string) {
  switch (status) {
    case "PENDING_REVIEW":
      return "bg-yellow-100 text-yellow-800"
    case "ACCEPTED":
      return "bg-blue-100 text-blue-800"
    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-800"
    case "RESOLVED":
      return "bg-green-100 text-green-800"
    case "CLOSED":
      return "bg-gray-100 text-gray-800"
    case "DECLINED":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function formatCurrency(amount: number) {
  if (typeof amount !== "number") return "N/A"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function QueriesTable({
  initialQueries,
  panchayats,
}: {
  initialQueries: Query[]
  panchayats: Panchayat[]
}) {
  const [filteredQueries, setFilteredQueries] = useState<Query[]>(initialQueries)
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [panchayatFilter, setPanchayatFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    let queriesToFilter = [...initialQueries]
    if (searchTerm) {
      queriesToFilter = queriesToFilter.filter((query) =>
        query.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (statusFilter !== "all") {
      queriesToFilter = queriesToFilter.filter((query) => query.status === statusFilter)
    }
    if (panchayatFilter !== "all") {
      queriesToFilter = queriesToFilter.filter((query) => query.panchayat?.id === panchayatFilter)
    }
    setFilteredQueries(queriesToFilter)
  }, [searchTerm, statusFilter, panchayatFilter, initialQueries])

  const exportToPDF = () => {
    // Create a new PDF document in landscape mode
    const doc = new (jsPDF as any)({ orientation: 'landscape' });
    
    // Add title and generation date
    doc.setFontSize(18);
    doc.text("All Queries Report", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 27);
    
    // Define table columns
    const tableColumn = [
      'Title',
      'Panchayat',
      'Department',
      'Status',
      'Budget Issued',
      'Budget Spent'
    ];
    
    // Prepare table rows with formatted data
    const tableRows = filteredQueries.map((query: Query) => [
      query.title,
      query.panchayat?.name || 'N/A',
      query.department?.name || 'N/A',
      query.status.replace('_', ' '),
      formatCurrency(query.budgetIssued).replace(/[^\d,.-]/g, ''), // Remove currency symbol
      query.budgetSpent > 0 ? formatCurrency(query.budgetSpent).replace(/[^\d,.-]/g, '') : 'N/A'
    ]);

    // Generate the table with proper formatting
    (autoTable as any)(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap',
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 60 },  // Title
        1: { cellWidth: 40 },   // Panchayat
        2: { cellWidth: 40 },   // Department
        3: { cellWidth: 25 },   // Status
        4: { cellWidth: 30, halign: 'right' },   // Budget Issued
        5: { cellWidth: 30, halign: 'right' }    // Budget Spent
      },
      margin: { top: 35 }
    });

    // Add page numbers
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        (doc as any).internal.pageSize.width - 25,
        (doc as any).internal.pageSize.height - 10
      );
    }

    // Save the PDF with a timestamp in the filename
    doc.save(`queries-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
    <div className="flex items-start">
      <div className="flex-shrink-0 w-6 h-6 text-muted-foreground">{icon}</div>
      <div className="ml-2">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-md">{value}</p>
      </div>
    </div>
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Queries</CardTitle>
          <CardDescription>Global view of all queries across panchayats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by query title..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="DECLINED">Declined</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={panchayatFilter} onValueChange={setPanchayatFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Panchayats</SelectItem>
                  {panchayats.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={exportToPDF} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            {/* Desktop Table */}
            <div className="hidden lg:block rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Query</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Panchayat</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Budget</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueries.map((query) => (
                      <tr key={query.id} className="border-b">
                        <td className="p-4 align-top">
                          <div>
                            <div className="font-medium">{query.title}</div>
                            <div className="text-sm text-muted-foreground">{query.department?.name || "N/A"}</div>
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="font-medium">{query.panchayat?.name || "N/A"}</div>
                        </td>
                        <td className="p-4 align-top">
                          <Badge className={getStatusColor(query.status)}>{query.status.replace("_", " ")}</Badge>
                        </td>
                        <td className="p-4 align-top">
                          <div>
                            <div className="font-medium">{formatCurrency(query.budgetIssued)}</div>
                            {query.budgetSpent > 0 && (
                              <div className="text-sm text-muted-foreground">Spent: {formatCurrency(query.budgetSpent)}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <Button variant="outline" size="sm" onClick={() => setSelectedQuery(query)}>
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredQueries.map((query) => (
                <Card key={query.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base truncate">{query.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {query.department?.name || "No department assigned"}
                        </p>
                      </div>
                      <Badge className={`ml-2 ${getStatusColor(query.status)}`}>
                        {query.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Panchayat</p>
                        <p className="font-medium">{query.panchayat?.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Budget Issued</p>
                        <p className="font-medium">{formatCurrency(query.budgetIssued)}</p>
                      </div>
                    </div>

                    {query.budgetSpent > 0 && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">Budget Spent</p>
                        <p className="font-medium">{formatCurrency(query.budgetSpent)}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(query.createdAt)}
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedQuery(query)}
                      className="w-full min-h-9"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuery} onOpenChange={(isOpen) => !isOpen && setSelectedQuery(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedQuery && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedQuery.title}</DialogTitle>
                <DialogDescription>Full details for query ID: {selectedQuery.id}</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedQuery.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem
                    icon={<Badge className={getStatusColor(selectedQuery.status)}> </Badge>}
                    label="Status"
                    value={selectedQuery.status.replace("_", " ")}
                  />
                  <DetailItem
                    icon={<Calendar size={20} />}
                    label="Submitted On"
                    value={formatDate(selectedQuery.createdAt)}
                  />
                  <DetailItem
                    icon={<Building size={20} />}
                    label="Panchayat"
                    value={selectedQuery.panchayat?.name || "Not available"}
                  />
                  <DetailItem
                    icon={<Building size={20} />}
                    label="Department"
                    value={selectedQuery.department?.name || "Not assigned"}
                  />
                  {selectedQuery.latitude && selectedQuery.longitude && (
                    <DetailItem
                      icon={<MapPin size={20} />}
                      label="Location"
                      value={`${selectedQuery.latitude.toFixed(4)}, ${selectedQuery.longitude.toFixed(4)}`}
                    />
                  )}
                  <DetailItem
                    icon={<Banknote size={20} />}
                    label="Budget (Spent / Issued)"
                    value={`${formatCurrency(selectedQuery.budgetSpent)} / ${formatCurrency(selectedQuery.budgetIssued)}`}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
