import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createRatingSchema } from "@/lib/validations"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const officeId = searchParams.get("officeId")
    const topRated = searchParams.get("topRated") === "true"

    if (topRated) {
      // Get top rated offices
      const offices = await prisma.office.findMany({
        include: {
          department: true,
          panchayat: true,
          ratings: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              ratings: true,
            },
          },
        },
      })

      const officesWithAvgRating = offices
        .map((office) => {
          const avgRating =
            office.ratings.length > 0 ? office.ratings.reduce((sum, r) => sum + r.rating, 0) / office.ratings.length : 0
          return {
            ...office,
            avgRating: Math.round(avgRating * 10) / 10,
            ratingCount: office._count.ratings,
            ratings: undefined,
            _count: undefined,
          }
        })
        .filter((office) => office.ratingCount > 0)
        .sort((a, b) => {
          // Sort by average rating first, then by count as tiebreaker
          if (b.avgRating !== a.avgRating) {
            return b.avgRating - a.avgRating
          }
          return b.ratingCount - a.ratingCount
        })
        .slice(0, 10) // Top 10

      return NextResponse.json({ offices: officesWithAvgRating })
    }

    if (officeId) {
      const ratings = await prisma.rating.findMany({
        where: { officeId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return NextResponse.json({ ratings })
    }

    return NextResponse.json({ ratings: [] })
  } catch (error) {
    console.error("Ratings fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching ratings" } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole

    if (!userId || userRole !== UserRole.VOTER) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only voters can create ratings" } },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { rating, comment, officeId } = createRatingSchema.parse(body)

    // Check if user already rated this office
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_officeId: {
          userId,
          officeId,
        },
      },
    })

    let result
    if (existingRating) {
      // Update existing rating
      result = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating, comment },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          office: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    } else {
      // Create new rating
      result = await prisma.rating.create({
        data: {
          rating,
          comment,
          userId,
          officeId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          office: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    }

    return NextResponse.json({ rating: result })
  } catch (error) {
    console.error("Rating creation error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating rating" } },
      { status: 500 },
    )
  }
}
