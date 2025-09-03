// app/api/queries/[id]/update/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QueryStatus } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user || (user.role !== "PANCHAYAT" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    // Destructure officeId along with other fields
    const { status, note, budgetSpentDelta, officeId } = body;

    if (!status || !note || !Object.values(QueryStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid input: Status and note are required." }, { status: 400 });
    }

    // Validate budgetSpentDelta if it exists
    if (budgetSpentDelta !== undefined && typeof budgetSpentDelta !== 'number') {
      return NextResponse.json({ error: "Invalid input: budgetSpentDelta must be a number." }, { status: 400 });
    }

    // Validate officeId if status is ACCEPTED
    if (status === "ACCEPTED" && !officeId) {
      return NextResponse.json({ error: "Invalid input: An office must be assigned when accepting a query." }, { status: 400 });
    }

    const updatedQuery = await prisma.$transaction(async (tx) => {
      // Fetch current query inside the transaction for safety
      const currentQuery = await tx.query.findUnique({
        where: { id: id },
        select: { budgetSpent: true }
      });

      if (!currentQuery) {
        throw new Error("Query not found"); // This will safely rollback the transaction
      }
      
      // 1. Create the detailed update log
      await tx.queryUpdate.create({
        data: {
          note,
          status,
          queryId: id,
          userId: user.userId,
          budgetSpentDelta, // Add the budget delta to the log
        },
      });

      // 2. Prepare data for the main query update
      const dataToUpdate: any = {
        status: status,
      };

      // If a budget delta was provided, calculate and add the new total
      if (budgetSpentDelta !== undefined && budgetSpentDelta !== null) {
        dataToUpdate.budgetSpent = currentQuery.budgetSpent + budgetSpentDelta;
      }

      // If status is ACCEPTED and officeId is provided, assign the office
      if (status === "ACCEPTED" && officeId) {
        dataToUpdate.officeId = officeId;
        dataToUpdate.acceptedAt = new Date(); // Set the acceptedAt timestamp
      }

      // 3. Update the main query record
      const query = await tx.query.update({
        where: { id: id },
        data: dataToUpdate,
      });

      return query;
    });
    
    // Notification logic remains outside the transaction, which is fine
    const originalQuery = await prisma.query.findUnique({ where: { id: id } });
    if (originalQuery && originalQuery.userId !== user.userId) {
      await prisma.notification.create({
        data: {
          title: "Your query has been updated",
          message: `The status of your query "${originalQuery.title}" is now ${status.replace(/_/g, ' ')}.`,
          userId: originalQuery.userId,
          queryId: id,
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