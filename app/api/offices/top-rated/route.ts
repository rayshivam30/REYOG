import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const panchayatId = searchParams.get("panchayatId")
    const departmentId = searchParams.get("departmentId")

    // Build where clause
    const whereClause: any = {}
    if (panchayatId) {
      whereClause.panchayatId = panchayatId
    }
    if (departmentId) {
      whereClause.departmentId = departmentId
    }

    // Fetch offices with their ratings
    const offices = await prisma.office.findMany({
      where: whereClause,
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        },
        panchayat: {
          select: {
            id: true,
            name: true,
            district: true,
            state: true
          }
        },
        ratings: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        },
        queryRatings: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true
              }
            },
            query: {
              select: {
                title: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

    // Calculate average ratings and sort
    const officesWithRatings = offices.map(office => {
      // Combine general ratings and query-specific ratings
      const allRatings = [
        ...office.ratings.map(r => ({
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          userName: r.user.name,
          source: 'general' as const
        })),
        ...office.queryRatings.map(r => ({
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          userName: r.user.name,
          queryTitle: r.query.title,
          source: 'query' as const
        }))
      ]

      const avgRating = allRatings.length > 0 
        ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
        : 0

      return {
        id: office.id,
        name: office.name,
        address: office.address,
        latitude: office.latitude,
        longitude: office.longitude,
        contactPhone: office.contactPhone,
        contactEmail: office.contactEmail,
        workingHours: office.workingHours,
        department: office.department,
        panchayat: office.panchayat,
        avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
        ratingCount: allRatings.length,
        recentRatings: allRatings.slice(0, 5), // Show 5 most recent ratings
        // Remove the detailed ratings from the response
        ratings: undefined,
        queryRatings: undefined
      }
    })

    // Sort by average rating (highest first), then by rating count as tiebreaker
    const sortedOffices = officesWithRatings
      .sort((a, b) => {
        if (b.avgRating !== a.avgRating) {
          return b.avgRating - a.avgRating
        }
        return b.ratingCount - a.ratingCount
      })
      .slice(0, limit)

    // Calculate some statistics
    const stats = {
      totalOffices: sortedOffices.length,
      averageRating: sortedOffices.length > 0 
        ? Math.round((sortedOffices.reduce((sum, o) => sum + o.avgRating, 0) / sortedOffices.length) * 10) / 10
        : 0,
      totalRatings: sortedOffices.reduce((sum, o) => sum + o.ratingCount, 0),
      highlyRatedCount: sortedOffices.filter(o => o.avgRating >= 4.0).length
    }

    return NextResponse.json({
      offices: sortedOffices,
      stats
    })

  } catch (error) {
    console.error("Top-rated offices fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching top-rated offices" } },
      { status: 500 }
    )
  }
}
