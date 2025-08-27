import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { v2 as cloudinary } from 'cloudinary'
import { cookies } from 'next/headers'

// Configure Cloudinary with environment variables
const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Verify Cloudinary configuration
if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
  console.error('Cloudinary configuration is missing required environment variables');
  throw new Error('Cloudinary configuration is incomplete');
}

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://reyog.vercel.app' 
    : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  })
}

export async function POST(request: NextRequest) {
  console.log('Upload request received')
  
  try {
    // Verify authentication
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access-token')?.value
    
    console.log('Access token present:', !!accessToken)
    
    if (!accessToken) {
      console.error('No access token found in cookies')
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: { 
            code: "UNAUTHORIZED", 
            message: "No token provided" 
          } 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Extract and verify token
    let user;
    try {
      user = await verifyToken(accessToken);
      console.log('User verified:', user?.email || 'Unknown')
    } catch (error) {
      console.error('Token verification failed:', error)
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: { 
            code: "INVALID_TOKEN", 
            message: "Invalid or expired token" 
          } 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    // Get the file from the request
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      console.error('No file found in form data')
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: { 
            code: "INVALID_INPUT", 
            message: "No file provided" 
          } 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size, 'bytes')
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: { 
            code: "FILE_TOO_LARGE", 
            message: "File size exceeds 10MB limit" 
          } 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Convert file to buffer for Cloudinary
    console.log('Converting file to buffer...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Upload to Cloudinary
    console.log('Uploading to Cloudinary...')
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `reyog/${user.userId}`,  // Use the verified user ID from the token
          public_id: `${Date.now()}-${file.name.replace(/[^\w\d.]/g, '_')}`,
          overwrite: false,
          invalidate: true,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            return reject(error)
          }
          resolve(result)
        }
      )
      
      // Create a stream from buffer
      const { Readable } = require('stream')
      const stream = Readable.from(buffer)
      stream.pipe(uploadStream)
    })

    console.log('Upload successful:', result)
    return new NextResponse(
      JSON.stringify({
        data: {
          file: {
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            resourceType: result.resource_type,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
          },
        },
        success: true,
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
    
  } catch (error) {
    console.error('Upload processing error:', error)
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: { 
          code: "UPLOAD_ERROR", 
          message: error instanceof Error ? error.message : "An error occurred during file upload"
        } 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access-token')?.value
    
    console.log('Access token present:', !!accessToken)
    
    if (!accessToken) {
      console.error('No access token found in cookies')
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: { 
            code: "UNAUTHORIZED", 
            message: "No token provided" 
          } 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Extract and verify token
    let user;
    try {
      user = await verifyToken(accessToken);
      console.log('User verified:', user?.email || 'Unknown')
    } catch (error) {
      console.error('Token verification failed:', error)
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: { 
            code: "INVALID_TOKEN", 
            message: "Invalid or expired token" 
          } 
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: { 
            code: "INVALID_INPUT", 
            message: "No public ID provided" 
          } 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Verify the file belongs to the user (check if publicId starts with user's folder)
    const userFolder = `reyog/${user.userId}`
    if (!publicId.startsWith(userFolder)) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: { 
            code: "FORBIDDEN", 
            message: "You don't have permission to delete this file" 
          } 
        }),
        { 
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    // Delete the file from Cloudinary
    console.log('Deleting file from Cloudinary:', publicId)
    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result !== 'ok') {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: { 
            code: "DELETE_FAILED", 
            message: "Failed to delete file" 
          } 
        }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    return new NextResponse(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    console.error("Error deleting file:", error)
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        error: { 
          code: "SERVER_ERROR", 
          message: "An error occurred while deleting the file" 
        } 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
}
