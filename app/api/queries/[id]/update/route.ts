// app/api/queries/[id]/update/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QueryStatus } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } } // Changed 'queryId' to 'id'
) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user || (user.role !== "PANCHAYAT" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params; // Changed 'queryId' to 'id'
    const body = await request.json();
    const { status, note } = body;

    if (!status || !note || !Object.values(QueryStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const updatedQuery = await prisma.$transaction(async (tx) => {
      await tx.queryUpdate.create({
        data: {
          note,
          status,
          queryId: id, // Changed 'queryId' to 'id'
          userId: user.userId,
        },
      });

      const query = await tx.query.update({
        where: { id: id }, // Changed 'queryId' to 'id'
        data: {
          status: status,
        },
      });

      return query;
    });
    
    const originalQuery = await prisma.query.findUnique({ where: { id: id } }); // Changed 'queryId' to 'id'
    if (originalQuery && originalQuery.userId !== user.userId) {
      await prisma.notification.create({
        data: {
          title: "Your query has been updated",
          message: `The status of your query "${originalQuery.title}" is now ${status.replace(/_/g, ' ')}.`,
          userId: originalQuery.userId,
          queryId: id, // Changed 'queryId' to 'id'
          type: "QUERY_UPDATE"
        }
      });
    }

    return NextResponse.json(updatedQuery, { status: 200 });
  } catch (error) {
    console.error("Failed to update query:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}