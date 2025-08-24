
// import { notFound, redirect } from "next/navigation"
// import { getAuthUser } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { format } from "date-fns"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { ThumbsUp } from "lucide-react"
// import { UpvoteButton } from "@/components/voter/upvote-button" // Import the client component

// const statusVariant = {
//   PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
//   ACCEPTED: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
//   IN_PROGRESS: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
//   RESOLVED: 'bg-green-100 text-green-800 hover:bg-green-200',
//   DECLINED: 'bg-red-100 text-red-800 hover:bg-red-200',
//   CLOSED: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
//   WAITLISTED: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
// };

// export default async function VoterQueriesPage() {
//   const authUser = await getAuthUser();

//   if (!authUser || authUser.role !== 'VOTER') {
//     redirect('/auth/login');
//   }

//   try {
//     // Fetch all queries for the voter's panchayat, including the new upvoteCount
//     const queries = await prisma.query.findMany({
//       where: {
//         panchayatId: authUser.panchayatId,
//       },
//       include: {
//         department: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return (
//       <div className="container mx-auto p-4 md:p-8 max-w-4xl">
//         <div className="mb-6 flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-800">Community Queries</h1>
//           <Link href="/dashboard/voter/queries/new">
//             <Button>Raise New Query</Button>
//           </Link>
//         </div>

//         <div className="space-y-4">
//           {queries.length === 0 ? (
//             <div className="text-center text-muted-foreground p-8">No queries found for your panchayat.</div>
//           ) : (
//             queries.map((query) => (
//               <Card key={query.id} className="relative transition-shadow hover:shadow-lg">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <Link href={`/dashboard/voter/queries/details/${query.id}`} className="flex-1">
//                       <CardTitle className="text-xl font-semibold hover:underline">
//                         {query.title}
//                       </CardTitle>
//                     </Link>
//                     <Badge className={`${statusVariant[query.status as keyof typeof statusVariant]}`}>
//                       {query.status.replace('_', ' ')}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="flex justify-between items-end">
//                   <div className="flex-1 pr-4">
//                     <p className="text-muted-foreground line-clamp-2">{query.description}</p>
//                     <div className="mt-2 text-sm text-gray-500">
//                       <span className="font-medium">{query.department?.name || 'Unassigned'}</span>
//                       <span className="ml-2">|</span>
//                       <span className="ml-2">{format(new Date(query.createdAt), 'MMM d, yyyy')}</span>
//                     </div>
//                   </div>
//                   {/* Upvote button and count */}
//                   <UpvoteButton queryId={query.id} initialUpvoteCount={query.upvoteCount} />
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("Error fetching queries:", error);
//     return (
//       <div className="container mx-auto p-8 max-w-4xl">
//         <Card className="border-red-200 bg-red-50">
//           <CardHeader>
//             <CardTitle className="text-red-600">Error Loading Queries</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p>Failed to load queries. Please try again later.</p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }
// }


import { notFound, redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SocialActions } from "@/components/voter/social-actions"
import { MapPin, Calendar } from "lucide-react"

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
    // Fetch all queries for the voter's panchayat, including the new upvoteCount, department, and panchayat.
    const queries = await prisma.query.findMany({
      where: {
        panchayatId: authUser.panchayatId,
      },
      include: {
        department: true,
        panchayat: true, // ADDED THIS LINE TO INCLUDE PANCHAYAT DATA
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
              <Card key={query.id} className="relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/10" />
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <Link href={`/dashboard/voter/queries/details/${query.id}`} className="group flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {query.title}
                      </CardTitle>
                    </Link>
                    <Badge 
                      className={`${statusVariant[query.status as keyof typeof statusVariant]} text-xs font-medium py-1 px-2.5 rounded-full border-0`}
                    >
                      {query.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                        {query.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500">
                        <span className="inline-flex items-center bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                          {query.department?.name || 'Unassigned'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          {query.panchayat?.name || 'N/A'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>Ward {query.wardNumber}</span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          {format(new Date(query.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <SocialActions 
                        queryId={query.id}
                        initialLikes={0}
                        initialComments={0}
                        initialShares={0}
                        initialUpvotes={query.upvoteCount || 0}
                        className="flex-1"
                      />
                      <Link href={`/dashboard/voter/queries/details/${query.id}`} className="ml-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="whitespace-nowrap bg-white hover:bg-gray-50 border-gray-200 hover:border-primary/30 transition-colors"
                        >
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