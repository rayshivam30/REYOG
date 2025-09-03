import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const purpose = searchParams.get("for")

    // =================================================================
    // NEW LOGIC for the assignment dropdown
    // =================================================================
    if (purpose === "assignment") {
      const user = await getAuthUser()
      if (!user || (user.role !== "PANCHAYAT" && user.role !== "ADMIN")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const offices = await prisma.office.findMany({
        where: {
          // For Panchayat users, only show offices within their panchayat
          panchayatId: user.role === "PANCHAYAT" ? user.panchayatId : undefined,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      })
      return NextResponse.json(offices)
    }

    // =================================================================
    // EXISTING LOGIC for public office search
    // =================================================================
    const q = searchParams.get("q")
    const dept = searchParams.get("dept")
    const panchayatId = searchParams.get("panchayatId")
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const radius = searchParams.get("radius") || "10"

    const whereClause: any = {}
    if (q) {
      whereClause.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { address: { contains: q, mode: "insensitive" } },
      ]
    }
    if (dept) {
      whereClause.departmentId = dept
    }
    if (panchayatId) {
      whereClause.panchayatId = panchayatId
    }

    const offices = await prisma.office.findMany({
      where: whereClause,
      include: {
        department: true,
        panchayat: true,
        ratings: { select: { rating: true } },
        _count: { select: { ratings: true } },
      },
      orderBy: { name: "asc" },
    })

    const officesWithRatings = offices.map((office) => {
      const avgRating =
        office.ratings.length > 0
          ? office.ratings.reduce((sum, r) => sum + r.rating, 0) /
            office.ratings.length
          : 0

      let distance = null
      if (lat && lng) {
        const R = 6371
        const dLat = ((office.latitude - parseFloat(lat)) * Math.PI) / 180
        const dLng = ((office.longitude - parseFloat(lng)) * Math.PI) / 180
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((parseFloat(lat) * Math.PI) / 180) *
            Math.cos((office.latitude * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        distance = R * c
      }

      return {
        ...office,
        avgRating: Math.round(avgRating * 10) / 10,
        ratingCount: office._count.ratings,
        distance: distance ? Math.round(distance * 10) / 10 : null,
        ratings: undefined,
        _count: undefined,
      }
    })

    let filteredOffices = officesWithRatings
    if (lat && lng) {
      filteredOffices = officesWithRatings.filter(
        (office) => !office.distance || office.distance <= parseFloat(radius),
      )
    }

    return NextResponse.json({ offices: filteredOffices })
  } catch (error) {
    console.error("Offices fetch error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while fetching offices" } },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get("x-user-role")
    if (userRole !== "ADMIN" && userRole !== "PANCHAYAT") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Only admins and panchayat users can create offices" } },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { name, address, latitude, longitude, contactPhone, contactEmail, workingHours, departmentId, panchayatId } =
      body

    const office = await prisma.office.create({
      data: {
        name,
        address,
        latitude,
        longitude,
        contactPhone,
        contactEmail,
        workingHours,
        departmentId,
        panchayatId,
      },
      include: {
        department: true,
        panchayat: true,
      },
    })

    return NextResponse.json({ office })
  } catch (error) {
    console.error("Office creation error:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An error occurred while creating office" } },
      { status: 500 },
    )
  }
}