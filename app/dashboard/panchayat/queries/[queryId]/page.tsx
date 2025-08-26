"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  MapPin,
  Building,
  ClipboardList,
  Home,
  File as FileIcon,
  FileImage,
  FileText,
  Download,
  Users,
  Clock,
  UserCheck,
  Users2,
  Calendar,
  IndianRupee,
  ThumbsUp,
  ArrowUp,
  MessageSquare,
} from "lucide-react"

// Define the complete shape of the data for a single query
interface Query {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  wardNumber?: number
  latitude?: number
  longitude?: number
  attachments: { url: string; filename: string; type: string }[]
  user: { name: string }
  panchayat?: { name: string }
  department?: { name: string }
  office?: { name: string }
  budgetIssued?: number
  budgetSpent?: number
  officialIncharge?: string
  teamAssigned?: string
  estimatedStart?: string
  estimatedEnd?: string
  upvoteCount: number
  likeCount: number
  commentCount: number
}

// Helper to get file icons
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) return <FileImage className="h-5 w-5 flex-shrink-0" />
  if (fileType === "application/pdf") return <FileText className="h-5 w-5 flex-shrink-0" />
  return <FileIcon className="h-5 w-5 flex-shrink-0" />
}

export default function QueryDetailPage() {
  const [query, setQuery] = useState<Query | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const params = useParams()
  const router = useRouter()
  const queryId = params.queryId as string

  useEffect(() => {
    if (queryId) {
      fetch(`/api/queries/${queryId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Query not found")
          return res.json()
        })
        .then((data) => setQuery(data.query))
        .catch((err) => {
          console.error("Failed to fetch query:", err)
          setError("Could not load query details.")
        })
        .finally(() => setIsLoading(false))
    }
  }, [queryId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !query) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2 text-destructive">{error || "Query Not Found"}</h2>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    )
  }

  const budgetProgress =
    query.budgetIssued && query.budgetSpent ? (query.budgetSpent / query.budgetIssued) * 100 : 0

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <Button onClick={() => router.back()} variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Queries
        </Button>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">{query.title}</h1>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-4 text-sm text-muted-foreground border-r pr-4">
              <div className="flex items-center gap-1.5"><ArrowUp className="h-4 w-4" /> {query.upvoteCount}</div>
              <div className="flex items-center gap-1.5"><ThumbsUp className="h-4 w-4" /> {query.likeCount}</div>
              <div className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> {query.commentCount}</div>
            </div>
            <Badge className="text-base py-1 px-3">{query.status.replace("_", " ")}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5"><Users className="h-4 w-4" /><span>Submitted by {query.user.name ?? "Anonymous"}</span></div>
          <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /><span>on {new Date(query.createdAt).toLocaleString()}</span></div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Detailed Description</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground whitespace-pre-wrap">{query.description}</p></CardContent>
          </Card>

          {query.attachments && query.attachments.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Attachments</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {query.attachments.map((file, index) => (
                  <a key={index} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    {getFileIcon(file.type)}
                    <span className="flex-grow text-sm text-foreground truncate">{file.filename}</span>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Voter Information</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3"><Home className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" /><p><span className="font-medium text-foreground">Panchayat:</span> {query.panchayat?.name ?? "N/A"}</p></div>
              <div className="flex items-start gap-3"><ClipboardList className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" /><p><span className="font-medium text-foreground">Ward Number:</span> {query.wardNumber ?? "N/A"}</p></div>
              <div className="flex items-start gap-3"><Building className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" /><p><span className="font-medium text-foreground">Department:</span> {query.department?.name ?? "N/A"}</p></div>
              <div className="flex items-start gap-3"><Building className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" /><p><span className="font-medium text-foreground">Specific Office:</span> {query.office?.name ?? "N/A"}</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Internal Status & Assignments</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3"><UserCheck className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" /><p><span className="font-medium text-foreground">Official In-charge:</span> {query.officialIncharge ?? "Not Assigned"}</p></div>
              <div className="flex items-start gap-3"><Users2 className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" /><p><span className="font-medium text-foreground">Team Assigned:</span> {query.teamAssigned ?? "Not Assigned"}</p></div>
              <div className="flex items-start gap-3"><Calendar className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" /><p><span className="font-medium text-foreground">Estimated Timeline:</span> {query.estimatedStart ? `${new Date(query.estimatedStart).toLocaleDateString()} to ${new Date(query.estimatedEnd!).toLocaleDateString()}` : "Not Set"}</p></div>
              <div className="space-y-2">
                <div className="flex items-start gap-3"><IndianRupee className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" /><p className="font-medium text-foreground">Budget</p></div>
                <div className="pl-7">
                  <p className="text-xs text-muted-foreground">Spent {query.budgetSpent?.toLocaleString("en-IN", { style: "currency", currency: "INR" }) ?? "₹0"} of {query.budgetIssued?.toLocaleString("en-IN", { style: "currency", currency: "INR" }) ?? "₹0"}</p>
                  <Progress value={budgetProgress} className="mt-1 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {query.latitude && query.longitude && (
            <Card>
              <CardHeader><CardTitle>Location</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"><MapPin className="h-5 w-5 text-muted-foreground" /><p className="text-xs text-muted-foreground">{query.latitude.toFixed(5)}, {query.longitude.toFixed(5)}</p></div>
                <a href={`http://googleusercontent.com/maps/place/${query.latitude},${query.longitude}`} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="outline" className="w-full">View on Map</Button>
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}