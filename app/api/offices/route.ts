import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") // Get the search query parameter
    const dept = searchParams.get("dept")
    const panchayatId = searchParams.get("panchayatId")
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const radius = searchParams.get("radius") || "10" // Default 10km radius

    const whereClause: any = {}

    // Add search query filter
    if (q) {
      whereClause.OR = [
        {
          name: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: q,
            mode: "insensitive",
          },
        },
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
        ratings: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    // Calculate average ratings and filter by distance if coordinates provided
    const officesWithRatings = offices.map((office) => {
      const avgRating =
        office.ratings.length > 0 ? office.ratings.reduce((sum, r) => sum + r.rating, 0) / office.ratings.length : 0

      let distance = null
      if (lat && lng) {
        // Haversine formula for distance calculation
        const R = 6371 // Earth's radius in km
        const dLat = ((office.latitude - Number.parseFloat(lat)) * Math.PI) / 180
        const dLng = ((office.longitude - Number.parseFloat(lng)) * Math.PI) / 180
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((Number.parseFloat(lat) * Math.PI) / 180) *
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
        ratings: undefined, // Remove individual ratings from response
        _count: undefined,
      }
    })

    // Filter by radius if coordinates provided
    let filteredOffices = officesWithRatings
    if (lat && lng) {
      filteredOffices = officesWithRatings.filter(
        (office) => !office.distance || office.distance <= Number.parseFloat(radius),
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
