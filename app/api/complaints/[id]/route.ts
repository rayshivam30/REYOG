// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { verifyToken } from "@/lib/auth"
// import { complaintUpdateSchema } from "@/lib/validations"

// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const user = await verifyToken(request)
//     if (!user || user.role !== "ADMIN") {
//       return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Admin access required" } }, { status: 401 })
//     }

//     const body = await request.json()
//     const validatedData = complaintUpdateSchema.parse(body)

//     const complaint = await prisma.complaint.update({
//       where: { id: params.id },
//       data: {
//         status: validatedData.status,
//         resolutionNote: validatedData.resolutionNote,
//         resolvedAt: validatedData.status === "RESOLVED" ? new Date() : null,
//       },
//       include: {
//         user: { select: { name: true, email: true } },
//         panchayat: { select: { name: true } },
//       },
//     })

//     return NextResponse.json(complaint)
//   } catch (error) {
//     console.error("Error updating complaint:", error)
//     return NextResponse.json(
//       { error: { code: "INTERNAL_ERROR", message: "Failed to update complaint" } },
//       { status: 500 },
//     )
//   }
// }

// /import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { verifyToken } from "@/lib/auth"
// import { ComplaintStatus } from "@prisma/client"
// import { z } from "zod"

// // Schema to validate the incoming request body
// const updateComplaintSchema = z.object({
//   status: z.nativeEnum(ComplaintStatus),
//   resolution: z.string().nullable().optional(),
// })

// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     // 1. Authenticate and authorize the user using the token/cookie
//     const user = await verifyToken(request)
//     if (!user || user.role !== "ADMIN") {
//       return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin access required" } }, { status: 403 })
//     }

//     const complaintId = params.id
//     const body = await request.json()

//     // 2. Validate the request body
//     const validation = updateComplaintSchema.safeParse(body)
//     if (!validation.success) {
//       return NextResponse.json({ error: validation.error.format() }, { status: 400 })
//     }

//     const { status, resolution } = validation.data

//     // 3. Update the complaint in the database
//     const updatedComplaint = await prisma.complaint.update({
//       where: { id: complaintId },
//       data: {
//         status,
//         resolution,
//       },
//       include: {
//         user: {
//           select: {
//             panchayat: {
//               select: {
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//     })

//     return NextResponse.json(updatedComplaint)
//   } catch (error) {
//     console.error("Complaint update error:", error)
//     return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Failed to update complaint" } }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ComplaintStatus, UserRole } from "@prisma/client"
import { z } from "zod"
import { getAuthUserFromRequest } from "@/lib/auth"

// Schema to validate the incoming request body
const updateComplaintSchema = z.object({
  status: z.nativeEnum(ComplaintStatus),
  resolution: z.string().nullable().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Use a consistent token-based authentication method
    const user = await getAuthUserFromRequest(request)
    if (!user || user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: { code: "FORBIDDEN", message: "Admin access required" } }, { status: 403 })
    }

    const complaintId = params.id
    const body = await request.json()

    // 2. Validate the request body
    const validation = updateComplaintSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const { status, resolution } = validation.data

    // 3. Update the complaint in the database
    const updatedComplaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status,
        resolution,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            panchayat: {
              select: {
                name: true,
              },
            },
          },
        },
        query: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Create audit log for complaint update
    await prisma.auditLog.create({
      data: {
        action: "complaint_updated",
        details: `Complaint status changed to ${status}`,
        userId: user.userId,
        metadata: {
          complaintId,
          newStatus: status,
          resolution,
        },
      },
    })

    return NextResponse.json(updatedComplaint)
  } catch (error) {
    console.error("Complaint update error:", error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Complaint not found" } },
          { status: 404 },
        )
      }
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: { code: "INVALID_REFERENCE", message: "Invalid reference in update" } },
          { status: 400 },
        )
      }
    }
    
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Failed to update complaint" } }, { status: 500 })
  }
}
