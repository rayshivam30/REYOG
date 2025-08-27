// app/dashboard/voter/queries/page.tsx
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SocialActions } from "@/components/voter/social-actions"
import { MapPin, Calendar, Paperclip } from "lucide-react"
import { getAuthUser } from "@/lib/auth"

const statusVariant = {
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  ACCEPTED: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  IN_PROGRESS: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  RESOLVED: 'bg-green-100 text-green-800 hover:bg-green-200',
  DECLINED: 'bg-red-100 text-red-800 hover:bg-red-200',
  CLOSED: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  WAITLISTED: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
};

export default async function VoterQueriesPage() {
  const authUser = await getAuthUser();
  
  if (!authUser || authUser.role !== 'VOTER') {
    redirect('/auth/login');
  }

  try {
    const queries = await prisma.query.findMany({
      where: {
        userId: authUser.userId,
      },
      include: {
        department: true,
        office: true,
        panchayat: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        updates: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          }
        },
        attachments: true,
        _count: {
          select: {
            updates: true,
            upvotes: true,
            likes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      skip: 0
    });

    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">My Queries</h1>
          <Link href="/dashboard/voter/queries/new">
            <Button>Raise New Query</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {queries.map((query) => (
            <Card key={query.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">
                    <Link href={`/dashboard/voter/queries/details/${query.id}`} className="hover:underline">
                      {query.title}
                    </Link>
                  </CardTitle>
                  <Badge className={statusVariant[query.status as keyof typeof statusVariant]}>
                    {query.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(query.createdAt), 'MMM d, yyyy')}
                  {query.panchayat && (
                    <>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      {query.panchayat.name}
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-2">{query.description}</p>
                {query.attachments && query.attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {query.attachments.map((file) => (
                      <a
                        key={file.id}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Paperclip className="h-3 w-3 mr-1.5" />
                        {file.filename || 'Attachment'}
                      </a>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <SocialActions 
                    queryId={query.id} 
                    likeCount={query.likeCount || 0}
                    commentCount={query.commentCount || 0}
                    shareCount={query.shareCount || 0}
                    retweetCount={query.retweetCount || 0}
                  />
                  <Link href={`/dashboard/voter/queries/details/${query.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {queries.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No queries yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by raising a new query.
              </p>
              <div className="mt-6">
                <Link href="/dashboard/voter/queries/new">
                  <Button>Create Query</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching queries:", error);
    return (
      <div className="container mx-auto p-8 max-w-4xl text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Queries</h2>
        <p className="text-gray-600">There was a problem loading your queries. Please try again later.</p>
        <Button 
          className="mt-4" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }
}