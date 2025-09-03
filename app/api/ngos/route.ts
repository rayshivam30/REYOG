import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth" // Add this import

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const purpose = searchParams.get("for")

    // =================================================================
    // NEW LOGIC for the assignment dropdown
    // =================================================================
    if (purpose === "assignment") {
      const user = await getAuthUser()
      // Ensure only authenticated panchayat or admin users can get this list
      if (!user || (user.role !== "PANCHAYAT" && user.role !== "ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const ngos = await prisma.nGO.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      })
      // Return the simple list
      return NextResponse.json(ngos)
    }

    // =================================================================
    // EXISTING LOGIC for fetching all NGO data (runs if 'for' is not 'assignment')
    // =================================================================
    const ngos = await prisma.nGO.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(ngos)

  } catch (error) {
    console.error("NGOs fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch NGOs" }, { status: 500 })
  }
}

// Your POST function remains completely unchanged.
export async function POST(req: Request) {
  try {
    const data = await req.json()
    const newNGO = await prisma.nGO.create({
      data: {
        name: data.name,
        focusArea: data.focusArea,
        coverage: data.coverage,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        address: data.address,
        website: data.website || null,
      },
    })
    return NextResponse.json(newNGO, { status: 201 })
  } catch (error) {
    console.error("NGO creation error:", error)
    return NextResponse.json({ error: "Failed to add NGO" }, { status: 500 })
  }
}