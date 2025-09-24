import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Rate limiting test endpoint',
    timestamp: new Date().toISOString(),
    success: true
  })
}
