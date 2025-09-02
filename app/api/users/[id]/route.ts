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
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.panchayatId !== undefined) updateData.panchayatId = data.panchayatId;
    if (data.wardNumber !== undefined) updateData.wardNumber = data.wardNumber;

    console.log('Updating user with data:', updateData);
    
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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
