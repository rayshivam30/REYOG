// app/api/panchayats/route.ts (Updated to add user count)
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Fetching panchayats from database...")
    const panchayats = await prisma.panchayat.findMany({
      select: {
        // --- Existing fields (unchanged) ---
        id: true,
        name: true,
        district: true,
        state: true,

        // --- New field ADDED ---
        // This will count the number of related users for each panchayat
        _count: {
          select: { users: true },
        },
      },
      orderBy: [
        {
          state: 'asc',
        },
        {
          district: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    })

    console.log(`Found ${panchayats.length} panchayats with user counts`)
    
    const response = NextResponse.json(panchayats)
    response.headers.set('Content-Type', 'application/json')
    
    return response
  } catch (error) {
    console.error("Error in panchayats API:", error)
    return NextResponse.json(
      { 
        error: { 
          code: "INTERNAL_ERROR", 
          message: "Failed to fetch panchayats",
          details: error instanceof Error ? error.message : String(error)
        } 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      },
    )
  }
}