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
        const res = await fetch(`/api/queries/${params.id}`)
        if (!res.ok) {
          throw new Error("Failed to fetch query details.")
        }
        const data = await res.json()
        setQuery(data.query)
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !query) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <h2 className="text-2xl font-semibold text-red-600">Error</h2>
        <p className="text-muted-foreground mt-2">{error || "Query not found."}</p>
        <Button asChild variant="link" className="mt-4">
            <Link href="/dashboard/voter">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go back to Dashboard
            </Link>
        </Button>
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