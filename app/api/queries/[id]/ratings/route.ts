import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const ratingSchema = z.object({
  ratings: z.array(z.object({
    officeId: z.string().optional(),
    ngoId: z.string().optional(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  })).min(1, "At least one rating is required"),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole

    if (!userId || userRole !== UserRole.VOTER) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only voters can rate query resolution" } },
        { status: 403 }
      )
    }

    const queryId = params.id
    const body = await request.json()
    const { ratings } = ratingSchema.parse(body)

    // Verify the query exists and belongs to the current user
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      include: {
        assignedOffices: {
          include: {
            office: true
          }
        },
        assignedNgos: {
          include: {
            ngo: true
          }
        }
      }
    })

    if (!query) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Query not found" } },
        { status: 404 }
      )
    }

    // Verify the query belongs to the current user
    if (query.userId !== userId) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "You can only rate your own queries" } },
        { status: 403 }
      )
    }

    // Verify query status is RESOLVED (can only rate resolved queries)
    if (query.status !== "RESOLVED") {
      return NextResponse.json(
        { error: { code: "INVALID_STATUS", message: "Can only rate resolved queries" } },
        { status: 400 }
      )
    }

    // Validate that all rated offices/NGOs were actually assigned to this query
    const assignedOfficeIds = new Set(query.assignedOffices.map(a => a.officeId))
    const assignedNgoIds = new Set(query.assignedNgos.map(a => a.ngoId))

    for (const rating of ratings) {
      if (rating.officeId && !assignedOfficeIds.has(rating.officeId)) {
        return NextResponse.json(
          { error: { code: "INVALID_OFFICE", message: "Can only rate offices that were assigned to this query" } },
          { status: 400 }
        )
      }
      if (rating.ngoId && !assignedNgoIds.has(rating.ngoId)) {
        return NextResponse.json(
          { error: { code: "INVALID_NGO", message: "Can only rate NGOs that were assigned to this query" } },
          { status: 400 }
        )
      }
    }

    // Use transaction to handle ratings
    const result = await prisma.$transaction(async (tx) => {
      // Remove existing ratings for this query
      await tx.queryRating.deleteMany({
        where: { queryId, userId }
      })

      const ratingResults = []

      // Create new ratings
      for (const ratingData of ratings) {
        const queryRating = await tx.queryRating.create({
          data: {
            queryId,
            userId,
            officeId: ratingData.officeId,
            ngoId: ratingData.ngoId,
            rating: ratingData.rating,
            comment: ratingData.comment,
          }
        })

        // If rating an office, also create/update the general office rating
        if (ratingData.officeId) {
          await tx.rating.upsert({
            where: {
              userId_officeId: {
                userId,
                officeId: ratingData.officeId
              }
            },
            update: {
              rating: ratingData.rating,
              comment: ratingData.comment,
            },
            create: {
              userId,
              officeId: ratingData.officeId,
              rating: ratingData.rating,
              comment: ratingData.comment,
            }
          })
        }

        // If rating an NGO, also create/update the general NGO rating
        if (ratingData.ngoId) {
          await tx.ngoRating.upsert({
            where: {
              userId_ngoId: {
                userId,
                ngoId: ratingData.ngoId
              }
            },
            update: {
              rating: ratingData.rating,
              comment: ratingData.comment,
            },
            create: {
              userId,
              ngoId: ratingData.ngoId,
              rating: ratingData.rating,
              comment: ratingData.comment,
            }
          })
        }

        ratingResults.push(queryRating)
      }

      return ratingResults
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "query_rated",
        details: `Rated ${result.length} offices/NGOs for query "${query.title}"`,
        userId,
        metadata: {
          queryId,
          ratingsCount: result.length,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `Successfully rated ${result.length} offices/NGOs`,
      ratings: result
    })

  } catch (error) {
    console.error("Query rating error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", issues: error.issues } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while submitting ratings" } },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id")
    const queryId = params.id

    const ratings = await prisma.queryRating.findMany({
      where: { 
        queryId,
        ...(userId ? { userId } : {}) // Only show user's own ratings if user is specified
      },
      include: {
        office: {
          select: {
            id: true,
            name: true,
            department: {
              select: {
                name: true
              }
            }
          }
        },
        ngo: {
          select: {
            id: true,
            name: true,
            focusArea: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ ratings })

  } catch (error) {
    console.error("Get ratings error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching ratings" } },
      { status: 500 }
    )
  }
}
