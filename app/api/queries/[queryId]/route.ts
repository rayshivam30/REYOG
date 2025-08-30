import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { queryId: string } }) {
  try {
    const query = await prisma.query.findUnique({
      where: { id: params.queryId },
      include: {
        attachments: true,
      },
    });

    if (!query) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    return NextResponse.json({ query });
  } catch (error) {
    console.error("Failed to fetch query:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { queryId: string } }
) {
  try {
    const { queryId } = params
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const query = await prisma.query.findUnique({
      where: { id: queryId },
      select: { userId: true },
    })

    if (!query) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 })
    }

    if (query.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.query.delete({
      where: { id: queryId },
    })

    return NextResponse.json({ message: "Query deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting query:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
