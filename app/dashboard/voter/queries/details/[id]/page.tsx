import { notFound, redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Star } from "lucide-react"
import Link from "next/link"
import { SocialActions } from "@/components/voter/social-actions"
import { AttachmentItem } from "@/components/voter/attachment-item"
import { FileText, ImageIcon, Download, Building, Users } from "lucide-react"
import { QueryLocationMap } from "@/components/voter/query-location-map"
import { RatingForm } from "@/components/voter/rating-form"

interface QueryWithRelations {
  id: string
  title: string
  description: string
  status: string
  wardNumber: string
  createdAt: string | Date
  upvoteCount: number
  latitude: number | null
  longitude: number | null
  user: {
    name: string
    email: string
    phone: string | null
  }
  panchayat: {
    name: string
    district: string
    state: string
  } | null
  department: {
    id: string
    name: string
  } | null
  updates: Array<{
    id: string
    note: string
    createdAt: string | Date
    user: {
      name: string
      role: string
    }
  }>
  attachments: Array<{
    id: string
    url: string
    filename: string
    type: string
    size: number
  }>
  assignedOffices: Array<{
    office: {
      id: string
      name: string
      department: {
        id: string
        name: string
      }
      rating: number | null
    }
  }>
}

const statusVariant = {
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  ACCEPTED: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  IN_PROGRESS: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  RESOLVED: 'bg-green-100 text-green-800 hover:bg-green-200',
  ACCEPTED: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  IN_PROGRESS: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  RESOLVED: 'bg-green-100 text-green-800 hover:bg-green-200',
}

export default async function QueryDetailsPage({ params }: { params: { id: string } }) {
  const authUser = await getAuthUser()
  
  if (!authUser) {
    redirect("/auth/login")
  }

  try {
    // Fetch the specific query
    const queryId = (await params).id
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        panchayat: {
          select: {
            name: true,
            district: true,
            state: true
          }
        },
        department: true,
        updates: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                role: true
              }
            }
          }
        },
        attachments: true,
        assignedOffices: {
          include: {
            office: {
              include: {
                department: true
              }
            }
          }
        },
        assignedNgos: {
          include: {
            ngo: true
          }
        },
      }
    })

    if (!query) {
      notFound()
    }

    return (
      <div className="container mx-auto p-4 md:p-8 max-w-5xl">
        <div className="mb-6">
          <Link href="/dashboard/voter/queries">
            <Button variant="outline" className="flex items-center gap-2 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Queries</span>
            </Button>
          </Link>
        </div>

        <Card className="mb-8 shadow-sm border-gray-100 dark:border-gray-800">
          <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <Badge className={`mb-3 ${statusVariant[query.status as keyof typeof statusVariant]} text-sm font-medium`}>
                  {query.status.replace('_', ' ')}
                </Badge>
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{query.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <span>Posted on {format(new Date(query.createdAt), 'MMMM d, yyyy')}</span>
                </div>
              </div>
              <div className="flex justify-end">
                <SocialActions 
                  queryId={query.id}
                  initialUpvotes={query.upvoteCount}
                  initialLikes={0}
                  initialComments={0}
                  initialShares={0}
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="prose max-w-none mb-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 dark:bg-black dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-500 mb-2 bg:text-white dark:text-white">Query Details</h3>
                <p className="text-gray-700 text-base leading-relaxed dark:text-white/500">{query.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2 dark:text-white">Attachments</h3>
              {query.attachments?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {query.attachments.map((file) => (
                    <AttachmentItem
                      key={file.id}
                      id={file.id}
                      url={file.url}
                      filename={file.filename}
                      type={file.type}
                      size={file.size}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-white/500">No attachments</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm dark:bg-black dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-500 flex items-center mb-3">
                  <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                  Location Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-white">Panchayat</p>
                    <p className="text-gray-900 dark:text-white/50">{query.panchayat?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-white">Ward Number</p>
                    <p className="text-gray-900 dark:text-white/50">{query.wardNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-white">District & State</p>
                    <p className="text-gray-900 dark:text-white/50">
                      {query.panchayat?.district || 'N/A'}, {query.panchayat?.state || 'N/A'}
                    </p>
                  </div>
                  
                  {/* Map display when coordinates are available */}
                  <div className="mt-4 dark:bg-black">
                    <p className="text-sm font-medium text-gray-500 mb-2 dark:text-white/50">Location on Map</p>
                    <QueryLocationMap 
                      latitude={query.latitude} 
                      longitude={query.longitude} 
                      title={query.title}
                      panchayatName={query.panchayat?.name}
                    />
                  </div>
                </div>
              </div>

              {query.department && (
                <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm dark:bg-black dark:border-gray-800">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-green-500">
                      <rect width="7" height="9" x="3" y="3" rx="1" />
                      <rect width="7" height="5" x="14" y="3" rx="1" />
                      <rect width="7" height="9" x="14" y="12" rx="1" />
                      <rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                    Department
                  </h3>
                  <div className="flex items-center">
                    <div className="bg-blue-50 text-blue-700 dark:bg-blue-800 dark:text-blue-100 px-3 py-1.5 rounded-full text-sm font-medium">
                      {query.department.name}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Add Assigned Office Information */}
              {query.assignedOffices && query.assignedOffices.length > 0 && (
                <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm mt-4 md:mt-0 dark:bg-black dark:border-gray-800">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center mb-3 dark:text-white/50">
                    <Building className="mr-2 h-4 w-4 text-indigo-500" />
                    Assigned Office
                  </h3>
                  <div className="space-y-3">
                    {query.assignedOffices.map((assignment) => (
                      <div key={assignment.office.id} className="border-l-2 border-indigo-400 pl-3">
                        <p className="font-medium text-gray-900 dark:text-white">{assignment.office.name}</p>
                        <p className="text-sm text-gray-500">{assignment.office.address}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {assignment.office.department?.name || 'Department not specified'}
                        </p>
                        
                        {/* Rating Section for Resolved Queries */}
                        {query.status === 'RESOLVED' && (
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center dark:text-white/50">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              Rate this Office
                            </h4>
                            <p className="text-xs text-gray-500 mb-2 dark:text-white/50">
                              How would you rate the service provided by {assignment.office.name}?
                            </p>
                            <RatingForm 
                              officeId={assignment.office.id}
                              officeName={assignment.office.name}
                              departmentName={assignment.office.department?.name || 'the department'}
                              queryId={query.id}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {query.updates && query.updates.length > 0 && (
          <Card className="border-gray-100 shadow-sm dark:bg-black dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg font-semibold flex items-center dark:text-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Updates & Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {query.updates.map((update) => (
                  <div key={update.id} className="p-6 hover:bg-gray-50 transition-colors dark:hover:bg-gray-800 dark:text-white/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 dark:text-white/50">
                            {update.user.role === 'ADMIN' ? 'Administrator' : 'Official'}
                          </span>
                          <span className="mx-2 text-gray-300 dark:text-white/50">•</span>
                          <span className="text-sm text-gray-500 dark:text-white/50">
                            {format(new Date(update.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-700 dark:text-white/50">{update.note}</p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-white/50">
                        {format(new Date(update.createdAt), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error fetching query:', error)
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Query</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load query details. Please try again later.</p>
            {process.env.NODE_ENV === 'development' && error instanceof Error && (
              <pre className="mt-4 p-4 bg-white rounded text-xs overflow-auto">
                {error.message}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
}