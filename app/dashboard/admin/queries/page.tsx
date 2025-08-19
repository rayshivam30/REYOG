// import { Suspense } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Search, Download } from "lucide-react"

// async function getAllQueries() {
//   // In a real app, this would fetch from API with filters
//   return [
//     {
//       id: "1",
//       title: "Water Supply Issue",
//       user: { name: "Rajesh Kumar", email: "rajesh@example.com" },
//       panchayat: { name: "Bhopal Rural" },
//       department: { name: "Water Supply" },
//       status: "IN_PROGRESS",
//       budgetIssued: 50000,
//       budgetSpent: 25000,
//       createdAt: "2024-01-15T10:00:00Z",
//       estimatedEnd: "2024-02-15T10:00:00Z",
//     },
//     {
//       id: "2",
//       title: "Road Repair Request",
//       user: { name: "Priya Sharma", email: "priya@example.com" },
//       panchayat: { name: "Sehore Urban" },
//       department: { name: "Roads" },
//       status: "PENDING_REVIEW",
//       budgetIssued: 0,
//       budgetSpent: 0,
//       createdAt: "2024-01-20T14:30:00Z",
//       estimatedEnd: null,
//     },
//     {
//       id: "3",
//       title: "Electricity Connection",
//       user: { name: "Amit Patel", email: "amit@example.com" },
//       panchayat: { name: "Indore Rural" },
//       department: { name: "Electricity" },
//       status: "RESOLVED",
//       budgetIssued: 15000,
//       budgetSpent: 12000,
//       createdAt: "2024-01-10T09:15:00Z",
//       estimatedEnd: "2024-01-25T09:15:00Z",
//     },
//   ]
// }

// function getStatusColor(status: string) {
//   switch (status) {
//     case "PENDING_REVIEW":
//       return "bg-yellow-100 text-yellow-800"
//     case "ACCEPTED":
//       return "bg-blue-100 text-blue-800"
//     case "IN_PROGRESS":
//       return "bg-purple-100 text-purple-800"
//     case "RESOLVED":
//       return "bg-green-100 text-green-800"
//     case "CLOSED":
//       return "bg-gray-100 text-gray-800"
//     case "DECLINED":
//       return "bg-red-100 text-red-800"
//     default:
//       return "bg-gray-100 text-gray-800"
//   }
// }

// function formatCurrency(amount: number) {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(amount)
// }

// function QueriesTable({ queries }: { queries: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>All Queries</CardTitle>
//         <CardDescription>Global view of all queries across panchayats</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {/* Search and Filter Controls */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input placeholder="Search queries..." className="pl-8" />
//             </div>
//             <Select>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="pending">Pending Review</SelectItem>
//                 <SelectItem value="in-progress">In Progress</SelectItem>
//                 <SelectItem value="resolved">Resolved</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Panchayat" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Panchayats</SelectItem>
//                 <SelectItem value="bhopal">Bhopal Rural</SelectItem>
//                 <SelectItem value="sehore">Sehore Urban</SelectItem>
//                 <SelectItem value="indore">Indore Rural</SelectItem>
//               </SelectContent>
//             </Select>
//             <Button variant="outline" size="sm">
//               <Download className="mr-2 h-4 w-4" />
//               Export
//             </Button>
//           </div>

//           {/* Queries Table */}
//           <div className="rounded-md border">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b bg-muted/50">
//                     <th className="h-12 px-4 text-left align-middle font-medium">Query</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">User</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Panchayat</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Budget</th>
//                     <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {queries.map((query) => (
//                     <tr key={query.id} className="border-b">
//                       <td className="p-4">
//                         <div>
//                           <div className="font-medium">{query.title}</div>
//                           <div className="text-sm text-muted-foreground">{query.department.name}</div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div>
//                           <div className="font-medium">{query.user.name}</div>
//                           <div className="text-sm text-muted-foreground">{query.user.email}</div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="font-medium">{query.panchayat.name}</div>
//                       </td>
//                       <td className="p-4">
//                         <Badge className={getStatusColor(query.status)}>{query.status.replace("_", " ")}</Badge>
//                       </td>
//                       <td className="p-4">
//                         <div>
//                           <div className="font-medium">{formatCurrency(query.budgetIssued)}</div>
//                           {query.budgetSpent > 0 && (
//                             <div className="text-sm text-muted-foreground">
//                               Spent: {formatCurrency(query.budgetSpent)}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <Button variant="outline" size="sm">
//                           View Details
//                         </Button>
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

// export default async function AdminQueriesPage() {
//   const queries = await getAllQueries()

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">Global Query Tracker</h2>
//       </div>

//       <Suspense fallback={<div>Loading queries...</div>}>
//         <QueriesTable queries={queries} />
//       </Suspense>
//     </div>
//   )
// }
// app/dashboard/admin/queries/page.tsx (your file path)

import { Suspense } from "react"
import { headers } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download } from "lucide-react"

// --- THIS FUNCTION NOW FETCHES REAL DATA ---
async function getAllQueries() {
  const host = headers().get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"

  const response = await fetch(`${protocol}://${host}/api/queries`, {
    headers: new Headers(headers()), // Forward headers for auth
  })

  if (!response.ok) {
    console.error("Failed to fetch queries")
    return []
  }

  const data = await response.json()
  return data.queries || []
}

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

function QueriesTable({ queries }: { queries: any[] }) {
  // NOTE: Filter and search logic is not yet connected.
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Queries</CardTitle>
        <CardDescription>Global view of all queries across panchayats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter Controls */}
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
                {/* Add other statuses as needed */}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Panchayat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Panchayats</SelectItem>
                {/* This could be populated dynamically */}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Queries Table */}
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
                      {/* --- UPDATED: User cell now shows "Anonymous" --- */}
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
                            <div className="text-sm text-muted-foreground">
                              Spent: {formatCurrency(query.budgetSpent)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <Button variant="outline" size="sm">
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
  )
}

export default async function AdminQueriesPage() {
  const queries = await getAllQueries()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Global Query Tracker</h2>
      </div>

      <Suspense fallback={<div>Loading queries...</div>}>
        <QueriesTable queries={queries} />
      </Suspense>
    </div>
  )
}