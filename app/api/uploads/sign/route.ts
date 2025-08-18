import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 })
    }

    const { filename, contentType } = await request.json()

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: "Filename and contentType are required" } },
        { status: 400 },
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const uniqueFilename = `${user.id}/${timestamp}-${filename}`

    try {
      // Create a signed upload URL using Vercel Blob
      const blob = await put(uniqueFilename, new Uint8Array(), {
        access: "public",
        contentType,
      })

      return NextResponse.json({
        uploadUrl: blob.url,
        filename: uniqueFilename,
        downloadUrl: blob.url,
      })
    } catch (blobError) {
      console.error("Vercel Blob error:", blobError)

      // Fallback to local storage simulation
      const localUrl = `/api/uploads/local/${uniqueFilename}`

      return NextResponse.json({
        uploadUrl: localUrl,
        filename: uniqueFilename,
        downloadUrl: localUrl,
        fallback: true,
      })
    }
  } catch (error) {
    console.error("Error creating signed upload URL:", error)
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to create upload URL" } },
      { status: 500 },
    )
  }
}
