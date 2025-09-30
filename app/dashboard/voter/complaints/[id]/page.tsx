import { notFound, redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Mail, MapPin, User as UserIcon } from "lucide-react"
import Link from "next/link"

type PageProps = {
  params: { id: string }
}

export default async function ComplaintDetailsPage({ params }: PageProps) {
  const authUser = await getAuthUser()
  const complaintId = params.id
  
  if (!authUser) {
    redirect("/auth/login")
  }

  try {
    // Fetch the specific complaint
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        // Add other relations here if needed
      }
    })

    if (!complaint) {
      notFound()
    }

    // Check if the current user is the owner of the complaint
    if (complaint.userId !== authUser.userId) {
      // Optionally, you can check for admin role here if needed
      // For now, we'll just show a 404 to prevent information leakage
      notFound()
    }

    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/dashboard/voter/complaints" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Complaints
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">{complaint.subject}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span className="mr-2">Complaint ID: {complaint.id}</span>
                  <Badge variant="outline" className="text-xs">
                    {complaint.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Calendar className="mr-1 h-4 w-4" />
              Created on {format(new Date(complaint.createdAt), 'MMMM d, yyyy')}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line dark:text-gray-200">{complaint.description}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Submitted By
                </h3>
                <div className="pl-6">
                  <p className="font-medium">{complaint.user.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-1 h-4 w-4" />
                    {complaint.user.email}
                  </div>
                  {complaint.user.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      {complaint.user.phone}
                    </div>
                  )}
                </div>
              </div>

              {complaint.location && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Location
                  </h3>
                  <div className="pl-6">
                    <p className="text-sm">{complaint.location}</p>
                  </div>
                </div>
              )}
            </div>

            {complaint.attachments && complaint.attachments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Attachments</h3>
                <div className="flex flex-wrap gap-2">
                  {complaint.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Updates section removed as we don't have the updates relation in the schema
            You can add it back later by creating a ComplaintUpdate model and uncommenting this section */}
      </div>
    )
  } catch (error) {
    console.error('Error fetching complaint:', error)
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Complaint</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load complaint details. Please try again later.</p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 p-4 bg-white rounded text-xs overflow-auto">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
}
