// app/api/users/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const panchayatId = searchParams.get("panchayatId")

  try {
    const users = await prisma.user.findMany({
      where: {
        // Exclude admins from the public list
        role: {
          not: UserRole.ADMIN,
        },
        // Filter by panchayatId if it's provided and not 'all'
        panchayatId:
          panchayatId && panchayatId !== "all" ? panchayatId : undefined,
      },
      include: {
        // Include the related panchayat data to get its name
        panchayat: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Show the newest users first
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}