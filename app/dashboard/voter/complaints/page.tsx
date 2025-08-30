import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Eye, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function VoterComplaintsPage() {
  const authUser = await getAuthUser()
  
  if (!authUser) {
    redirect("/auth/login")
  }

  // Fetch all complaints from the database using Prisma directly
  const complaints = await prisma.complaint.findMany({
    where: {
      userId: authUser.userId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      query: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          department: {
            select: {
              name: true
            }
          },
          panchayat: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Complaints</h1>
          <p className="text-muted-foreground">View and manage your complaints</p>
        </div>
        <Link href="/dashboard/voter/complaints/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Complaint
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No complaints found</p>
            </CardContent>
          </Card>
        ) : (
          complaints.map((complaint: any) => (
            <Card key={complaint.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{complaint.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      Status: {complaint.status.replace('_', ' ').toLowerCase()}
                    </CardDescription>
                    {complaint.query && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Related to Query:</span>
                        </div>
                        <p className="text-sm text-blue-700 font-medium">{complaint.query.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs bg-red-100 text-red-800">
                            {complaint.query.status.replace('_', ' ')}
                          </Badge>
                          {complaint.query.department && (
                            <Badge variant="secondary" className="text-xs">
                              {complaint.query.department.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{complaint.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      complaint.status === 'RESOLVED' 
                        ? 'bg-green-100 text-green-800' 
                        : complaint.status === 'UNDER_REVIEW'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complaint.status.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {complaint.query && (
                      <Link href={`/dashboard/voter/complaints/${complaint.id}?showQuery=true`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          View with Query
                        </Button>
                      </Link>
                    )}
                    <Link href={`/dashboard/voter/complaints/${complaint.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
