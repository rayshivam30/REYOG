// app/dashboard/panchayat/queries/[queryId]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QueryDetailsClient from "./QueryDetailsClient"; // Import the client component

// This is a type definition for the detailed query object
export type QueryWithDetails = NonNullable<Awaited<ReturnType<typeof getQueryDetails>>>;

async function getQueryDetails(queryId: string) {
  const query = await prisma.query.findUnique({
    where: { id: queryId },
    include: {
      user: true,      // User who submitted it
      panchayat: true,
      department: true,
      updates: {       // The timeline of updates
        orderBy: {
          createdAt: "desc", // Show newest first
        },
        include: {
          user: true,    // User who made the update
        },
      },
    },
  });
  return query;
}

export default async function QueryDetailsPage({ params }: { params: { queryId: string } }) {
  const query = await getQueryDetails(params.queryId);

  if (!query) {
    notFound(); // If query doesn't exist, show a 404 page
  }

  return <QueryDetailsClient query={query} />;
}