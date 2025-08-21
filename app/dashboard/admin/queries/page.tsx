import { Suspense } from "react"
import { headers } from "next/headers"
import { QueriesTable } from "@/components/admin/queries-table"
import { prisma } from "@/lib/prisma"

// This function fetches data on the server
async function getAllQueries() {
  const host = headers().get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"

  const response = await fetch(`${protocol}://${host}/api/queries`, {
    headers: new Headers(headers()),
  })

  if (!response.ok) {
    console.error("Failed to fetch queries")
    return []
  }

  const data = await response.json()
  return data.queries || []
}

// This function fetches panchayats
async function getPanchayats() {
  try {
    const panchayats = await prisma.panchayat.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    })
    return panchayats
  } catch (error) {
    console.error("Failed to fetch panchayats:", error)
    return []
  }
}

export default async function AdminQueriesPage() {
  // 1. Fetch data on the server
  const queries = await getAllQueries()
  const panchayats = await getPanchayats()

  // 2. Render the main page structure and pass the data to the client component
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Global Query Tracker</h2>
      </div>

      <Suspense fallback={<div>Loading queries...</div>}>
        <QueriesTable initialQueries={queries} panchayats={panchayats} />
      </Suspense>
    </div>
  )
}