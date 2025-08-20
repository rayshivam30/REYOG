// components/admin/queries-table.tsx

"use client"

import { useState } from "react"
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

// Define a detailed interface for our Query object
interface Query {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  acceptedAt?: string | null
  resolvedAt?: string | null
  latitude?: number | null
  longitude?: number | null
  budgetIssued: number
  budgetSpent: number
  department?: { name: string } | null
  panchayat?: { name: string } | null
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

export function QueriesTable({ initialQueries }: { initialQueries: Query[] }) {
  const [queries, setQueries] = useState<Query[]>(initialQueries)
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)

  // A small helper component for displaying details in the dialog
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
                <Input placeholder="Search queries..." className="pl-8" />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Panchayat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Panchayats</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">Query</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Panchayat</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Budget</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queries.map((query) => (
                      <tr key={query.id} className="border-b">
                        <td className="p-4 align-top">
                          <div>
                            <div className="font-medium">{query.title}</div>
                            <div className="text-sm text-muted-foreground">{query.department?.name || "N/A"}</div>
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="font-medium">Anonymous</div>
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