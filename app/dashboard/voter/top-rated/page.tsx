import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Phone, Mail, Clock } from "lucide-react"

export default async function TopRatedOfficesPage() {
  const authUser = await getAuthUser()
  
  if (!authUser) {
    redirect("/auth/login")
  }

  // First, get all offices with their ratings
  const offices = await prisma.office.findMany({
    include: {
      department: true,
      panchayat: true,
      ratings: {
        select: {
          rating: true
        }
      },
      _count: {
        select: {
          ratings: true
        }
      }
    }
  })

  // Calculate average rating for each office and filter out those without ratings
  const officesWithRatings = offices
    .map(office => ({
      ...office,
      avgRating: office.ratings.length > 0 
        ? office.ratings.reduce((sum, r) => sum + r.rating, 0) / office.ratings.length
        : 0,
      ratingCount: office._count.ratings
    }))
    .filter(office => office.ratingCount > 0) // Only include offices with ratings
    .sort((a, b) => b.avgRating - a.avgRating) // Sort by rating in descending order
    .slice(0, 10) // Get top 10 rated offices

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Top Rated Offices</h1>
        <p className="text-muted-foreground">
          Discover the highest-rated government offices in your area based on community feedback
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {officesWithRatings.length > 0 ? (
          officesWithRatings.map((office) => (
            <Card key={office.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{office.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {office.department?.name || 'No Department'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 mr-1" />
                    <span className="font-medium">{office.avgRating.toFixed(1)}</span>
                    <span className="text-xs text-yellow-600 ml-1">({office.ratingCount})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mt-0.5 mr-2 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{office.address}</span>
                  </div>
                  {office.contactPhone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${office.contactPhone}`} className="hover:underline">
                        {office.contactPhone}
                      </a>
                    </div>
                  )}
                  {office.contactEmail && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${office.contactEmail}`} className="hover:underline">
                        {office.contactEmail}
                      </a>
                    </div>
                  )}
                  {office.workingHours && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">{office.workingHours}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No rated offices found</p>
                <p className="text-sm text-muted-foreground mt-2">Be the first to rate an office!</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
