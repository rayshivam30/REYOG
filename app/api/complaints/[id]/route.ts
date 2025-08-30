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
import { verifyToken } from "@/lib/auth" // Assuming verifyToken is your standard auth method

// Schema to validate the incoming request body
const updateComplaintSchema = z.object({
  status: z.nativeEnum(ComplaintStatus),
  resolution: z.string().nullable().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Use a consistent token-based authentication method
    const user = await verifyToken(request)
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
      // Re-include user and panchayat data to send back the full object
      include: {
        user: {
          select: {
            panchayat: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedComplaint)
  } catch (error) {
    console.error("Complaint update error:", error)
    return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Failed to update complaint" } }, { status: 500 })
  }
}
