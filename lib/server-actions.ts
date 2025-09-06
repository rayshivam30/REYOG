'use server'

import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { redirect } from 'next/navigation'

export async function getAuthUser() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  
  if (!token) return null
  
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error('Failed to verify token:', error)
    return null
  }
}
