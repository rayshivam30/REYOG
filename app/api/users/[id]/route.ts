import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { updateUserSchema } from "@/lib/validations"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const currentUser = await getAuthUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      )
    }

    // Check if user is updating their own profile
    if (currentUser.userId !== params.id) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "You can only update your own profile" } },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = updateUserSchema.parse(body)

    // Check if panchayat exists if provided
    if (data.panchayatId) {
      const panchayat = await prisma.panchayat.findUnique({
        where: { id: data.panchayatId },
      })

      if (!panchayat) {
        return NextResponse.json(
          { error: { code: "INVALID_PANCHAYAT", message: "Selected panchayat does not exist" } },
          { status: 400 }
        )
      }
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...data,
        // Only update fields that are provided
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.panchayatId && { panchayatId: data.panchayatId }),
        ...(data.wardNumber !== undefined && { wardNumber: data.wardNumber }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        panchayatId: true,
        wardNumber: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to update user" } },
      { status: 500 }
    )
  }
}
