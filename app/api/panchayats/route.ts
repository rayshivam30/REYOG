import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const panchayats = await prisma.panchayat.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ panchayats });
  } catch (error) {
    console.error("Error fetching panchayats:", error);
    return NextResponse.json(
      { error: "Failed to fetch panchayats" },
      { status: 500 }
    );
  }
}