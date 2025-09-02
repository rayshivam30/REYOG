import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { queryId: string } }
) {
  try {
    const { queryId } = params

    // Get the query with assigned offices and NGOs
    const query = await prisma.query.findUnique({
      where: { id: queryId },
      include: {
        assignedOffices: {
          include: {
            office: {
              include: {
                department: true,
                panchayat: true
              }
            }
          }
        },
        assignedNgos: {
          include: {
            ngo: true
          }
        }
      }
    })

    if (!query) {
      return NextResponse.json(
        { error: "Query not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      offices: query.assignedOffices.map(ao => ao.office),
      ngos: query.assignedNgos.map(an => an.ngo)
    })

  } catch (error) {
    console.error("Error fetching query assignments:", error)
    return NextResponse.json(
      { error: "Failed to fetch query assignments" },
      { status: 500 }
    )
  }
}
