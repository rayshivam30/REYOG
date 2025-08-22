// // // app/api/queries/route.ts (Updated)

// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma" // Adjust this import if needed
// import { createQuerySchema } from "@/lib/validations"
// import { UserRole } from "@prisma/client"

// // This GET function is already correct and needs no changes.
// export async function GET(request: NextRequest) {
//   try {
//     const userId = request.headers.get("x-user-id")
//     const userRole = request.headers.get("x-user-role") as UserRole
//     const panchayatId = request.headers.get("x-user-panchayat-id")

//     if (!userId) {
//       return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "User not authenticated" } }, { status: 401 })
//     }

//     const { searchParams } = new URL(request.url)
//     const status = searchParams.get("status")
//     const limit = Number.parseInt(searchParams.get("limit") || "50")
//     const offset = Number.parseInt(searchParams.get("offset") || "0")

//     const whereClause: any = {}

//     if (userRole === UserRole.VOTER) {
//       whereClause.userId = userId
//     } else if (userRole === UserRole.PANCHAYAT && panchayatId) {
//       whereClause.panchayatId = panchayatId
//     }

//     if (status) {
//       whereClause.status = status
//     }

//     const queries = await prisma.query.findMany({
//       where: whereClause,
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             phone: true,
//           },
//         },
//         department: true,
//         office: true,
//         panchayat: true,
//         updates: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 role: true,
//               },
//             },
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//         },
//         _count: {
//           select: {
//             updates: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       take: limit,
//       skip: offset,
//     })

//     return NextResponse.json({ queries })
//   } catch (error) {
//     console.error("Queries fetch error:", error)
//     return NextResponse.json(
//       { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching queries" } },
//       { status: 500 }
//     )
//   }
// }

// // --- THIS POST FUNCTION IS UPDATED ---
// export async function POST(request: NextRequest) {
//   try {
//     const userId = request.headers.get("x-user-id")
//     const userRole = request.headers.get("x-user-role") as UserRole

//     if (!userId || userRole !== UserRole.VOTER) {
//       return NextResponse.json(
//         { error: { code: "FORBIDDEN", message: "Only voters can create queries" } },
//         { status: 403 }
//       )
//     }

//     const body = await request.json()
//     // --- UPDATE: Destructure panchayatName from the validated body ---
//     const { title, description, panchayatName, departmentId, officeId, latitude, longitude, attachments } =
//       createQuerySchema.parse(body)

//     // --- ADD: "Find or Create" logic for Panchayat ---
//     let panchayatId: string

//     const existingPanchayat = await prisma.panchayat.findFirst({
//       where: {
//         name: {
//           equals: panchayatName,
//           mode: "insensitive", // Case-insensitive search
//         },
//       },
//     })

//     if (existingPanchayat) {
//       panchayatId = existingPanchayat.id
//     } else {
//       // Create a new panchayat with placeholder values
//       const newPanchayat = await prisma.panchayat.create({
//         data: {
//           name: panchayatName,
//           district: "Not Specified",
//           state: "Not Specified",
//           pincode: "000000",
//         },
//       })
//       panchayatId = newPanchayat.id
//     }
//     // --- END of new logic ---

//     const query = await prisma.query.create({
//       data: {
//         title,
//         description,
//         userId,
//         departmentId,
//         officeId,
//         panchayatId, // Use the ID from the logic above
//         latitude,
//         longitude,
//         attachments,
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         department: true,
//         office: true,
//         panchayat: true,
//       },
//     })

//     // The notification and audit log logic below remains the same and will work correctly.
//     if (panchayatId) {
//       const panchayatUsers = await prisma.user.findMany({
//         where: {
//           role: UserRole.PANCHAYAT,
//           panchayatId,
//         },
//       })

//       await Promise.all(
//         panchayatUsers.map((panchayatUser) =>
//           prisma.notification.create({
//             data: {
//               title: "New Query Submitted",
//               message: `A new query "${title}" has been submitted and requires review.`,
//               type: "query_created",
//               userId: panchayatUser.id,
//               queryId: query.id,
//               metadata: {
//                 queryId: query.id,
//                 submittedBy: query.user.name,
//               } as any, // Cast to 'any' to avoid metadata type issues
//             },
//           })
//         )
//       )
//     }

//     await prisma.auditLog.create({
//       data: {
//         action: "query_created",
//         details: `Query "${title}" created`,
//         userId,
//         metadata: {
//           queryId: query.id,
//           title,
//           department: query.department?.name,
//         } as any, // Cast to 'any' to avoid metadata type issues
//       },
//     })

//     return NextResponse.json({ query })
//   } catch (error) {
//     console.error("Query creation error:", error)
//     // Handle Zod validation errors specifically
//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: { code: "VALIDATION_ERROR", issues: error.issues } }, { status: 400 })
//     }
//     return NextResponse.json(
//       { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating query" } },
//       { status: 500 }
//     )
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { createQuerySchema } from "@/lib/validations" // Import the validation schema

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole
    const panchayatId = request.headers.get("x-user-panchayat-id")

    if (!userId) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "User not authenticated" } }, { status: 401 })
    }

    const queryId = params.id

    const query = await prisma.query.findUnique({
      where: { id: queryId },
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
        panchayat: {
          select: {
            name: true,
          },
        },
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
            createdAt: "asc",
          },
        },
      },
    })

    if (!query) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Query not found" } }, { status: 404 })
    }

    // Check access permissions
    const hasAccess =
      userRole === UserRole.ADMIN ||
      (userRole === UserRole.VOTER && query.userId === userId) ||
      (userRole === UserRole.PANCHAYAT && query.panchayatId === panchayatId)

    if (!hasAccess) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Access denied" } }, { status: 403 })
    }

    return NextResponse.json({ query })
  } catch (error) {
    console.error("Query fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching query" } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole
    const panchayatId = request.headers.get("x-user-panchayat-id")

    if (!userId || userRole !== UserRole.VOTER) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Only voters can create queries" } }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, panchayatName, wardNumber, departmentId, officeId, latitude, longitude, attachments } = createQuerySchema.parse(body)

    // Find the panchayat
    const panchayat = await prisma.panchayat.findFirst({
      where: {
        name: {
          equals: panchayatName,
          mode: 'insensitive',
        },
      },
    })

    if (!panchayat) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Panchayat not found" } }, { status: 404 })
    }

    const createdQuery = await prisma.query.create({
      data: {
        title,
        description,
        wardNumber, // ADDED THIS LINE
        latitude,
        longitude,
        attachments: attachments ? attachments.map(a => JSON.stringify(a)) : [], // Ensure attachments are saved as strings
        userId,
        departmentId,
        officeId,
        panchayatId: panchayat.id,
      },
    })

    return NextResponse.json({ query: createdQuery }, { status: 201 })
  } catch (error) {
    console.error("Query creation error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating the query" } },
      { status: 500 },
    )
  }
}
