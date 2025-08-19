import { notFound, redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Mail, MapPin, User as UserIcon } from "lucide-react"
import Link from "next/link"

const statusVariant = {
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  ACCEPTED: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  IN_PROGRESS: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  RESOLVED: 'bg-green-100 text-green-800 hover:bg-green-200',
  DECLINED: 'bg-red-100 text-red-800 hover:bg-red-200',
  CLOSED: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  WAITLISTED: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
}

export default async function QueryDetailsPage({ params }: { params: { id: string } }) {
  const authUser = await getAuthUser()
  
  if (!authUser) {
    redirect("/auth/login")
  }

  try {
    // Fetch the specific query
    const queryId = params.id
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
        }
      }
    })

    if (!query) {
      notFound()
    }

    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/dashboard/voter/queries">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Queries
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl font-bold">{query.title}</CardTitle>
              <Badge className={`${statusVariant[query.status as keyof typeof statusVariant]}`}>
                {query.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              {format(new Date(query.createdAt), 'MMMM d, yyyy')}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700">{query.description}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Raised By
                </h3>
                <div className="pl-6">
                  {/* <p className="font-medium">{query.user.name}</p> */}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-1 h-4 w-4" />
                    {query.user.email}
                  </div>
                  {query.user.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      {query.user.phone}
                    </div>
                  )}
                </div>
              </div>

              {query.panchayat && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Location
                  </h3>
                  <div className="pl-6">
                    <p className="font-medium">{query.panchayat.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {query.panchayat.district}, {query.panchayat.state}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {query.updates && query.updates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {query.updates.map((update) => (
                  <div key={update.id} className="border-l-2 border-gray-200 pl-4 py-2">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium">
                        {update.user.name}
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({update.user.role.toLowerCase()})
                        </span>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(update.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{update.note}</p>
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
