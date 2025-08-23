import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const panchayats = await prisma.panchayat.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json({ panchayats });
  } catch (error) {
    console.error("Failed to fetch panchayats:", error);
    return NextResponse.json(
      { error: { message: "An error occurred while fetching panchayats" } },
      { status: 500 }
    );
  }
}