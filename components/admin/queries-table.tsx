
"use client"

import { useState, useEffect } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Search, Download, Calendar, MapPin, Building, Banknote, 
  Filter, FileText, RefreshCw, Eye, ChevronLeft, ChevronRight,
  ArrowUpDown, SlidersHorizontal, X
} from "lucide-react"
import { Loading } from "@/components/ui/loading"

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
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "ACCEPTED":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "RESOLVED":
      return "bg-green-100 text-green-800 border-green-200"
    case "CLOSED":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "DECLINED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
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

function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING_REVIEW": return "Pending Review"
    case "ACCEPTED": return "Accepted"
    case "IN_PROGRESS": return "In Progress"
    case "RESOLVED": return "Resolved"
    case "CLOSED": return "Closed"
    case "DECLINED": return "Declined"
    default: return status
  }
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
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const queriesPerPage = 10
  
  // Apply filters
  useEffect(() => {
    setIsLoading(true)
    
    let queriesToFilter = [...initialQueries]
    
    // Apply search filter
    if (searchTerm) {
      queriesToFilter = queriesToFilter.filter((query) =>
        query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      queriesToFilter = queriesToFilter.filter((query) => query.status === statusFilter)
    }
    
    // Apply panchayat filter
    if (panchayatFilter !== "all") {
      queriesToFilter = queriesToFilter.filter((query) => query.panchayat?.id === panchayatFilter)
    }
    
    // Apply sorting
    if (sortField) {
      queriesToFilter.sort((a, b) => {
        let valueA, valueB;
        
        switch (sortField) {
          case 'title':
            valueA = a.title.toLowerCase();
            valueB = b.title.toLowerCase();
            break;
          case 'date':
            valueA = new Date(a.createdAt).getTime();
            valueB = new Date(b.createdAt).getTime();
            break;
          case 'budget':
            valueA = a.budgetIssued || 0;
            valueB = b.budgetIssued || 0;
            break;
          default:
            return 0;
        }
        
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredQueries(queriesToFilter)
    setCurrentPage(1)
    
    // Simulate loading for better UX
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }, [initialQueries, searchTerm, statusFilter, panchayatFilter, sortField, sortDirection])

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPanchayatFilter("all")
    setSortField(null)
    setSortDirection('desc')
    setIsFilterOpen(false)
  }

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(18)
    doc.text("Queries Report", 14, 22)
    
    // Add filters info
    doc.setFontSize(10)
    doc.text(`Status: ${statusFilter === 'all' ? 'All' : getStatusLabel(statusFilter)}`, 14, 30)
    doc.text(`Panchayat: ${panchayatFilter === 'all' ? 'All' : panchayats.find(p => p.id === panchayatFilter)?.name || 'Unknown'}`, 14, 35)
    if (searchTerm) doc.text(`Search: "${searchTerm}"`, 14, 40)
    
    // Add date
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45)
    
    // Create table
    const tableColumn = ["Title", "Status", "Panchayat", "Date", "Budget"]
    const tableRows = filteredQueries.map(query => [
      query.title,
      getStatusLabel(query.status),
      query.panchayat?.name || "N/A",
      formatDate(query.createdAt),
      formatCurrency(query.budgetIssued)
    ])
    
    // Add table to document
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] }
    })
    
    // Save document
    doc.save("queries-report.pdf")
  }

  // Pagination
  const totalPages = Math.ceil(filteredQueries.length / queriesPerPage)
  const paginatedQueries = filteredQueries.slice(
    (currentPage - 1) * queriesPerPage,
    currentPage * queriesPerPage
  )

  return (
    <Card className="shadow-md border-border/60">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Queries Management</CardTitle>
            <CardDescription>
              View and manage all citizen queries across panchayats
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={generatePDF}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Filters Section */}
      {isFilterOpen && (
        <div className="px-6 pb-3 border-b border-border/60 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={panchayatFilter} onValueChange={setPanchayatFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by panchayat" />
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
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-muted-foreground">
              {filteredQueries.length} queries found
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Reset filters
            </Button>
          </div>
        </div>
      )}
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loading size="lg" text="Loading queries..." />
          </div>
        ) : paginatedQueries.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-medium">No queries found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters or search term</p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    <button 
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort('title')}
                    >
                      Title
                      {sortField === 'title' && (
                        <ArrowUpDown className={`h-3.5 w-3.5 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Panchayat</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    <button 
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort('date')}
                    >
                      Date
                      {sortField === 'date' && (
                        <ArrowUpDown className={`h-3.5 w-3.5 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    <button 
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort('budget')}
                    >
                      Budget
                      {sortField === 'budget' && (
                        <ArrowUpDown className={`h-3.5 w-3.5 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedQueries.map((query) => (
                  <tr 
                    key={query.id} 
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium">{query.title}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge className={`${getStatusColor(query.status)} border`}>
                        {getStatusLabel(query.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">{query.panchayat?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(query.createdAt)}</td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(query.budgetIssued)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedQuery(query)}
                        className="hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
      
      {/* Pagination */}
      {!isLoading && filteredQueries.length > 0 && (
        <CardFooter className="flex items-center justify-between border-t border-border/60 p-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * queriesPerPage + 1} to {Math.min(currentPage * queriesPerPage, filteredQueries.length)} of {filteredQueries.length} entries
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm px-3">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      )}
      
      {/* Query Details Dialog */}
      <Dialog open={!!selectedQuery} onOpenChange={(open) => !open && setSelectedQuery(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedQuery?.title}</DialogTitle>
            <DialogDescription>
              <Badge className={`${selectedQuery?.status ? getStatusColor(selectedQuery.status) : ''} mt-2 border`}>
                {selectedQuery?.status ? getStatusLabel(selectedQuery.status) : ''}
              </Badge>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Date Submitted
              </h4>
              <p className="text-sm">{formatDate(selectedQuery?.createdAt)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                <Building className="h-4 w-4 text-muted-foreground" />
                Panchayat
              </h4>
              <p className="text-sm">{selectedQuery?.panchayat?.name || "N/A"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                <Banknote className="h-4 w-4 text-muted-foreground" />
                Budget Issued
              </h4>
              <p className="text-sm">{formatCurrency(selectedQuery?.budgetIssued || 0)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                <Banknote className="h-4 w-4 text-muted-foreground" />
                Budget Spent
              </h4>
              <p className="text-sm">{formatCurrency(selectedQuery?.budgetSpent || 0)}</p>
            </div>
            
            {selectedQuery?.latitude && selectedQuery?.longitude && (
              <div className="col-span-2">
                <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Location
                </h4>
                <p className="text-sm">
                  Latitude: {selectedQuery.latitude}, Longitude: {selectedQuery.longitude}
                </p>
              </div>
            )}
            
            <div className="col-span-2">
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm whitespace-pre-wrap border rounded-md p-3 bg-muted/30">
                {selectedQuery?.description}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedQuery(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
