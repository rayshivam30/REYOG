import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createQuerySchema } from "@/lib/validations" 
import { UserRole } from "@prisma/client"
import { z } from "zod"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole
    const panchayatId = request.headers.get("x-user-panchayat-id")

    if (!userId) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "User not authenticated" } }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const panchayatFilterId = searchParams.get("panchayatId")
    const scope = searchParams.get("scope")

    const whereClause: any = {}

    if (scope === 'user') {
      whereClause.userId = userId;
    } else if (userRole === UserRole.VOTER) {
      // Get the current user's panchayat
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { panchayatId: true }
      });
      
      if (currentUser?.panchayatId) {
        // Show all queries from the same panchayat
        whereClause.panchayatId = currentUser.panchayatId;
      } else {
        // If no panchayat assigned, only show user's own queries
        whereClause.userId = userId;
      }
    } else if (userRole === UserRole.PANCHAYAT && panchayatId) {
      whereClause.panchayatId = panchayatId
    }
    if (userRole === UserRole.ADMIN && panchayatFilterId && panchayatFilterId !== "all") {
      whereClause.panchayatId = panchayatFilterId
    }

    if (status) {
      whereClause.status = status
    }

    const queries = await prisma.query.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        department: true,
        office: true,
        panchayat: true,
        updates: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            updates: true,
          },
        },
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({ queries })
  } catch (error) {
    console.error("Queries fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching queries" } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole

    if (!userId || userRole !== UserRole.VOTER) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only voters can create queries" } }, 
        { status: 403 }
      )
    }

    const data = await request.json()
    const { attachments = [], ...queryData } = data

    const { title, description, panchayatId: panchayatIdFromRequest, departmentId, officeId, latitude, longitude } =
      createQuerySchema.parse(queryData)

    // Get user to get ward number
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { wardNumber: true, panchayatId: true }
    });

    // Use the user's panchayatId if not provided in the request
    const panchayatId = panchayatIdFromRequest || user?.panchayatId;

    if (!panchayatId) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Panchayat information is required" } },
        { status: 400 }
      )
    }

    // Use the provided panchayat ID
    let finalPanchayatId = panchayatId;

    // Create the query with the user's ward number
    const newQuery = await prisma.query.create({
      data: {
        title,
        description,
        userId,
        departmentId,
        officeId,
        panchayatId: finalPanchayatId,
        latitude,
        longitude,
        status: 'PENDING_REVIEW',
        wardNumber: user?.wardNumber || 1, // Use user's ward number or default to 1
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        department: true,
        office: true,
        panchayat: true,
      },
    })

    // Handle attachments if any
    if (attachments?.length > 0) {
      const BATCH_SIZE = 5
      for (let i = 0; i < attachments.length; i += BATCH_SIZE) {
        const batch = attachments.slice(i, i + BATCH_SIZE)
        await prisma.attachment.createMany({
          data: batch.map((file: any) => ({
            url: file.url,
            filename: file.filename,
            type: file.type,
            size: file.size,
            publicId: file.publicId,
            queryId: newQuery.id,
          })),
          skipDuplicates: true,
        })
      }
    }

    // Notify panchayat users
    if (finalPanchayatId) {
      const panchayatUsers = await prisma.user.findMany({
        where: {
          role: UserRole.PANCHAYAT,
          panchayatId: finalPanchayatId,
        },
      })

      await Promise.all(
        panchayatUsers.map((panchayatUser) =>
          prisma.notification.create({
            data: {
              title: "New Query Submitted",
              message: `A new query "${title}" has been submitted and requires review.`,
              type: "query_created",
              userId: panchayatUser.id,
              queryId: newQuery.id,
              metadata: {
                queryId: newQuery.id,
                submittedBy: newQuery.user.name,
              } as any,
            },
          })
        )
      )
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "query_created",
        details: `Query "${title}" created`,
        userId,
        metadata: {
          queryId: newQuery.id,
          title,
          department: newQuery.department?.name,
        } as any,
      },
    })

    // Return the created query with attachment count
    return NextResponse.json({
      ...newQuery,
      _count: {
        attachments: attachments.length
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Query creation error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", issues: error.issues } }, 
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating query" } },
      { status: 500 }
    )
  }
}