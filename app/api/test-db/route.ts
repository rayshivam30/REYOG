import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Try a simple query
    const panchayatCount = await prisma.panchayat.count()
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      panchayatCount
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
