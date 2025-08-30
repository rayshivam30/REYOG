import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createComplaintSchema } from "@/lib/validations"
import { UserRole } from "@prisma/client"
import { getAuthUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "User not authenticated" } }, { status: 401 })
    }

    const { userId, role: userRole } = user

    const whereClause: any = {}

    // Role-based filtering
    if (userRole === UserRole.VOTER) {
      whereClause.userId = userId
    }
    // ADMIN can see all complaints (no additional filter)

    const complaints = await prisma.complaint.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ complaints })
  } catch (error) {
    console.error("Complaints fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching complaints" } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request)
    
    if (!user || user.role !== UserRole.VOTER) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only voters can create complaints" } },
        { status: 403 },
      )
    }

    const { userId } = user

    const body = await request.json()
    const validatedData = createComplaintSchema.parse(body)
    const { subject, description, attachments, queryId } = validatedData

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create the complaint
      const complaint = await tx.complaint.create({
        data: {
          subject,
          description,
          attachments,
          userId,
          queryId: queryId || null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      // Get current user info for notifications
      const currentUser = await tx.user.findUnique({
        where: { id: userId },
        select: { name: true },
      })

      // Create notifications for admin users
      const adminUsers = await tx.user.findMany({
        where: { role: UserRole.ADMIN },
        select: { id: true },
      })

      if (adminUsers.length > 0) {
        await tx.notification.createMany({
          data: adminUsers.map((admin) => ({
            title: "New Complaint Filed",
            message: `A new complaint "${subject}" has been filed and requires attention.`,
            type: "complaint_created",
            userId: admin.id,
            metadata: {
              complaintId: complaint.id,
              subject,
              submittedBy: currentUser?.name || "Anonymous",
            },
          })),
        })
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          action: "complaint_created",
          details: `Complaint "${subject}" filed`,
          userId,
          metadata: {
            complaintId: complaint.id,
            subject,
          },
        },
      })

      return complaint
    })

    return NextResponse.json({ complaint: result })
  } catch (error) {
    console.error("Complaint creation error:", error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: { code: "INVALID_REFERENCE", message: "Referenced query does not exist" } },
          { status: 400 },
        )
      }
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: { code: "DUPLICATE_ENTRY", message: "Duplicate complaint entry" } },
          { status: 409 },
        )
      }
    }
    
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating complaint" } },
      { status: 500 },
    )
  }
}
