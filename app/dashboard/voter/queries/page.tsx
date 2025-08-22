// import { getAuthUser } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { prisma } from "@/lib/prisma"
// import { Button } from "@/components/ui/button"
// import { FileText, Plus } from "lucide-react"
// import Link from "next/link"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// export default async function VoterQueriesPage() {
//   const authUser = await getAuthUser()
  
//   if (!authUser) {
//     redirect("/auth/login")
//   }

//   // Fetch all queries from the database
//   const queries = await prisma.query.findMany({
//     where: {},
//     orderBy: { createdAt: 'desc' },
//     include: {
//       user: {
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//       panchayat: {
//         select: {
//           name: true,
//         },
//       },
//     },
//   })

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">All Queries</h1>
//           <p className="text-muted-foreground">View all queries raised by users</p>
//         </div>
//         <Link href="/dashboard/voter/queries/new">
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             New Query
//           </Button>
//         </Link>
//       </div>

//       <div className="space-y-4">
//         {queries.length === 0 ? (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-12">
//               <FileText className="h-12 w-12 text-muted-foreground mb-4" />
//               <p className="text-muted-foreground">No queries found</p>
//             </CardContent>
//           </Card>
//         ) : (
//           queries.map((query) => (
//             <Card key={query.id} className="hover:shadow-md transition-shadow">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle className="text-lg">{query.title}</CardTitle>
//                     <CardDescription className="mt-1">
//                       Raised by: 'AnonySmous' • {query.panchayat?.name || 'No Panchayat'}
//                     </CardDescription>
//                   </div>
//                   <span className="text-sm text-muted-foreground">
//                     {new Date(query.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-muted-foreground">{query.description}</p>
//                 <div className="mt-4 flex justify-between items-center">
//                   <div className="flex space-x-2">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       query.status === 'ACCEPTED' 
//                         ? 'bg-blue-100 text-blue-800' 
//                         : query.status === 'PENDING_REVIEW'
//                         ? 'bg-yellow-100 text-yellow-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {query.status.replace('_', ' ').toLowerCase()}
//                     </span>
//                   </div>
//                   <Link href={`/dashboard/voter/queries/details/${query.id}`}>
//                     <Button variant="outline" size="sm">
//                       View Details
//                     </Button>
//                   </Link>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }
import { notFound, redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThumbsUp } from "lucide-react"
import { UpvoteButton } from "@/components/voter/upvote-button" // Import the client component

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
    // Fetch all queries for the voter's panchayat, including the new upvoteCount
    const queries = await prisma.query.findMany({
      where: {
        panchayatId: authUser.panchayatId,
      },
      include: {
        department: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return (
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Community Queries</h1>
          <Link href="/dashboard/voter/queries/new">
            <Button>Raise New Query</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {queries.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">No queries found for your panchayat.</div>
          ) : (
            queries.map((query) => (
              <Card key={query.id} className="relative transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Link href={`/dashboard/voter/queries/details/${query.id}`} className="flex-1">
                      <CardTitle className="text-xl font-semibold hover:underline">
                        {query.title}
                      </CardTitle>
                    </Link>
                    <Badge className={`${statusVariant[query.status as keyof typeof statusVariant]}`}>
                      {query.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-between items-end">
                  <div className="flex-1 pr-4">
                    <p className="text-muted-foreground line-clamp-2">{query.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">{query.department?.name || 'Unassigned'}</span>
                      <span className="ml-2">|</span>
                      <span className="ml-2">{format(new Date(query.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  {/* Upvote button and count */}
                  <UpvoteButton queryId={query.id} initialUpvoteCount={query.upvoteCount} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching queries:", error);
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load queries. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
}
