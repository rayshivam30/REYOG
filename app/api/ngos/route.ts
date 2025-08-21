import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const ngos = await prisma.nGO.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(ngos)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch NGOs" }, { status: 500 })
  }
}

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
    console.error(error)
    return NextResponse.json({ error: "Failed to add NGO" }, { status: 500 })
  }
}