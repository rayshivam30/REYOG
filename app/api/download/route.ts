import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('id')
    
    if (!fileId) {
      return new NextResponse("File ID is required", { status: 400 })
    }

    // Get file metadata from database
    const file = await prisma.attachment.findUnique({
      where: { id: fileId }
    })

    if (!file) {
      return new NextResponse("File not found", { status: 404 })
    }

    // Fetch the file content
    const response = await fetch(file.url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }

    // Get the file content as a blob
    const fileBlob = await response.blob()

    // Create response with file content
    const headers = new Headers()
    headers.set('Content-Type', file.type || 'application/octet-stream')
    headers.set('Content-Disposition', `attachment; filename="${file.filename}"`)
    headers.set('Cache-Control', 'no-cache')
    headers.set('Pragma', 'no-cache')

    return new NextResponse(fileBlob, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error("Download error:", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to download file",
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
