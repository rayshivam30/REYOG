"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Building, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface QueryDetails {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  department?: {
    name: string
  }
}

export default function QueryDetailPage() {
  const params = useParams<{ id: string }>()
  const [query, setQuery] = useState<QueryDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQueryDetails = async () => {
      if (!params.id) return

      try {
        console.log('Fetching query with ID:', params.id)
        const res = await fetch(`/api/queries/${params.id}`)
        const data = await res.json()
        console.log('API Response:', data)
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch query details.")
        }
        
        setQuery(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQueryDetails()
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW": return "bg-yellow-100 text-yellow-800"
      case "ACCEPTED":
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800"
      case "RESOLVED":
      case "CLOSED": return "bg-green-100 text-green-800"
      case "DECLINED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading query details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <p className="font-medium">Error loading query</p>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!query) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div className="bg-muted/50 p-8 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Query not found</h3>
          <p className="text-muted-foreground mb-6">The query you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link href="/dashboard/voter/queries">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Queries
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/dashboard/voter">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <CardTitle className="text-2xl sm:text-3xl">{query.title}</CardTitle>
              <CardDescription className="mt-2 flex items-center gap-4 text-sm">
                <span className="flex items-center">
                  <Calendar className="mr-1.5 h-4 w-4" />
                  {new Date(query.createdAt).toLocaleDateString()}
                </span>
                {query.department && (
                  <span className="flex items-center">
                    <Building className="mr-1.5 h-4 w-4" />
                    {query.department.name}
                  </span>
                )}
              </CardDescription>
            </div>
            <Badge className={`mt-2 sm:mt-0 text-base ${getStatusColor(query.status)}`}>
              {query.status.replace(/_/g, " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 border-t pt-4">
            <h3 className="flex items-center text-lg font-semibold mb-2">
                <FileText className="mr-2 h-5 w-5"/>
                Full Query Description
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {query.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}