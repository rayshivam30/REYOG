// // File: app/api/admin/users/route.ts

// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getAuthUserFromRequest } from "@/lib/auth"
// import { UserRole } from "@prisma/client"
// import { hashPassword } from "@/lib/auth"

// // GET handler to fetch all VOTER users
// export async function GET(request: NextRequest) {
//   try {
//     const adminUser = await getAuthUserFromRequest(request)
//     if (!adminUser || adminUser.role !== UserRole.ADMIN) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//     }

//     const voters = await prisma.user.findMany({
//       where: {
//         role: UserRole.VOTER,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         updatedAt: true, // Use updatedAt as a proxy for 'last activity'
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     return NextResponse.json({ users: voters })
//   } catch (error) {
//     console.error("Failed to fetch users:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }

// // POST handler to create a new user (admin action)
// export async function POST(request: NextRequest) {
//   try {
//     const adminUser = await getAuthUserFromRequest(request)
//     if (!adminUser || adminUser.role !== UserRole.ADMIN) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 })
//     }

//     const body = await request.json()
//     const { name, email, password, role } = body // Assuming validation is handled client-side or with Zod

//     // Check if user exists
//     const existingUser = await prisma.user.findUnique({ where: { email } })
//     if (existingUser) {
//       return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
//     }

//     const hashedPassword = await hashPassword(password)

//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role, // Admin can set the role
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         updatedAt: true,
//       },
//     })

//     return NextResponse.json({ user: newUser }, { status: 201 })
//   } catch (error) {
//     console.error("Failed to create user:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }

// File: app/api/admin/users/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUserFromRequest } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { hashPassword } from "@/lib/auth"

// GET handler to fetch all VOTER users
export async function GET(request: NextRequest) {
  try {
    const adminUser = await getAuthUserFromRequest(request)
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      where: {}, // Remove the role filter to get all users
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
        panchayat: {
          select: {
            id: true,
            name: true,
            district: true,
            state: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ users: users })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST handler to create a new user (admin action)
export async function POST(request: NextRequest) {
  try {
    const adminUser = await getAuthUserFromRequest(request)
    if (!adminUser || adminUser.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { 
      name, 
      email, 
      password, 
      role, 
      panchayatId, 
      newPanchayatName, 
      newPanchayatEmail, 
      newPanchayatPassword 
    } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const userData: any = {
      name,
      email,
      password: hashedPassword,
      role,
    }

    // Handle panchayat assignment for both VOTER and PANCHAYAT roles
    if (role === 'VOTER' || role === 'PANCHAYAT') {
      if (panchayatId === 'new' && newPanchayatName && newPanchayatEmail && newPanchayatPassword) {
        // Create new panchayat and connect it
        userData.panchayat = {
          create: {
            name: newPanchayatName,
            email: newPanchayatEmail,
            password: await hashPassword(newPanchayatPassword),
            role: 'PANCHAYAT',
            status: 'ACTIVE',
            district: "",
            state: ""
          }
        }
      } else if (panchayatId && panchayatId !== 'none') {
        // For PANCHAYAT role, ensure they are assigned to a panchayat
        if (role === 'PANCHAYAT' && !panchayatId) {
          return NextResponse.json({ error: "Panchayat is required for PANCHAYAT role" }, { status: 400 });
        }
        // Connect existing panchayat
        userData.panchayat = {
          connect: { id: panchayatId }
        }
      } else if (role === 'PANCHAYAT') {
        return NextResponse.json({ error: "Panchayat is required for PANCHAYAT role" }, { status: 400 });
      }
    }

    const newUser = await prisma.user.create({
      data: userData,
      include: {
        panchayat: {
          select: {
            id: true,
            name: true,
            district: true,
            state: true
          }
        }
      },
    })

    return NextResponse.json({ 
      user: {
        ...newUser,
        status: 'ACTIVE',
        updatedAt: newUser.updatedAt.toISOString()
      } 
    }, { status: 201 })
  } catch (error) {
    console.error("Failed to create user:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}