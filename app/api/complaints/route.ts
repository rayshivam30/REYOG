import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createComplaintSchema } from "@/lib/validations"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole

    if (!userId) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "User not authenticated" } }, { status: 401 })
    }

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
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role") as UserRole

    if (!userId || userRole !== UserRole.VOTER) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only voters can create complaints" } },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { subject, description, attachments, queryId } = createComplaintSchema.parse(body)

    const complaint = await prisma.complaint.create({
      data: {
        subject,
        description,
        attachments,
        userId,
        queryId,
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

    // Create notifications for admin users
    const adminUsers = await prisma.user.findMany({
      where: { role: UserRole.ADMIN },
    })

    await Promise.all(
      adminUsers.map((admin) =>
        prisma.notification.create({
          data: {
            title: "New Complaint Filed",
            message: `A new complaint "${subject}" has been filed and requires attention.`,
            type: "complaint_created",
            userId: admin.id,
            metadata: {
              complaintId: complaint.id,
              subject,
              submittedBy: complaint.user.name,
            },
          },
        }),
      ),
    )

    // Create audit log
    await prisma.auditLog.create({
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

    return NextResponse.json({ complaint })
  } catch (error) {
    console.error("Complaint creation error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating complaint" } },
      { status: 500 },
    )
  }
}
