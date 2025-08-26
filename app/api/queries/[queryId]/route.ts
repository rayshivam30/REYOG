import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { queryId: string } }) {
  try {
    const { queryId } = params

    if (!queryId) {
      return new NextResponse("Query ID is required", { status: 400 })
    }

    const query = await prisma.query.findUnique({
      where: {
        id: queryId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        panchayat: {
          select: {
            name: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
        office: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!query) {
      return new NextResponse("Query not found", { status: 404 })
    }

    // Prisma stores attachments as String[], so we parse them if they are JSON strings
    const parsedAttachments = query.attachments.map((att) => {
      try {
        return JSON.parse(att)
      } catch {
        // If it's not a JSON string, handle it gracefully
        return { url: att, filename: "Attachment Link", type: "link" }
      }
    })

    return NextResponse.json({ query: { ...query, attachments: parsedAttachments } })
  } catch (error) {
    console.error("[QUERY_GET_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}