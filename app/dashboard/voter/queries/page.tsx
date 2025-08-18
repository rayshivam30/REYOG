import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function VoterQueriesPage() {
  const authUser = await getAuthUser()
  
  if (!authUser) {
    redirect("/auth/login")
  }

  // Fetch all queries from the database
  const queries = await prisma.query.findMany({
    where: {},
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      panchayat: {
        select: {
          name: true,
        },
      },
    },
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Queries</h1>
          <p className="text-muted-foreground">View all queries raised by users</p>
        </div>
        <Link href="/dashboard/voter/queries/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Query
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {queries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No queries found</p>
            </CardContent>
          </Card>
        ) : (
          queries.map((query) => (
            <Card key={query.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{query.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Raised by: {query.user.name} • {query.panchayat?.name || 'No Panchayat'}
                    </CardDescription>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(query.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{query.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      query.status === 'ACCEPTED' 
                        ? 'bg-blue-100 text-blue-800' 
                        : query.status === 'PENDING_REVIEW'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {query.status.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                  <Link href={`/dashboard/voter/queries/${query.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
