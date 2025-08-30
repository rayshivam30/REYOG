// app/api/admin/complaints/[id]/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UserRole, ComplaintStatus } from "@prisma/client"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure the user is an Admin
    const userRole = request.headers.get("x-user-role") as UserRole
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Admin access required" } },
        { status: 403 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { status, resolution } = body

    // Validate status
    const validStatuses = ["OPEN", "UNDER_REVIEW", "RESOLVED", "CLOSED"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: { code: "INVALID_STATUS", message: "Invalid complaint status" } },
        { status: 400 }
      )
    }

    // Update the complaint
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        ...(status && { status: status as ComplaintStatus }),
        ...(resolution !== undefined && { resolution }),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            panchayat: {
              select: {
                id: true,
                name: true,
                district: true,
                state: true,
              },
            },
          },
        },
        query: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            latitude: true,
            longitude: true,
            attachments: {
              select: {
                id: true,
                url: true,
                filename: true,
                type: true,
                size: true,
              },
            },
            department: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
            panchayat: {
              select: {
                id: true,
                name: true,
                district: true,
                state: true,
              },
            },
            office: {
              select: {
                id: true,
                name: true,
                address: true,
                contactPhone: true,
                contactEmail: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                panchayat: {
                  select: {
                    id: true,
                    name: true,
                    district: true,
                    state: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedComplaint)
  } catch (error) {
    console.error("Complaint update error:", error)
    
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Complaint not found" } },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to update complaint" } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure the user is an Admin
    const userRole = request.headers.get("x-user-role") as UserRole
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Admin access required" } },
        { status: 403 }
      )
    }

    const { id } = params

    // Delete the complaint
    await prisma.complaint.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Complaint deleted successfully" })
  } catch (error) {
    console.error("Complaint deletion error:", error)
    
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Complaint not found" } },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to delete complaint" } },
      { status: 500 }
    )
  }
}
