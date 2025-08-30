import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the ID from the URL parameters
    const { id } = params;
    
    // Get the authenticated user from the request
    const user = await getAuthUser();
    console.log('Authenticated user:', user); // Debug log
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Allow PANCHAYAT, PANCHAYAT_ADMIN and ADMIN roles
    if (!['PANCHAYAT', 'ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      )
    }

    // Parse request body
    const { status, note } = await request.json()
    console.log('Request body:', { status, note }); // Debug log

    // Validate request body
    if (!status || !note) {
      return NextResponse.json(
        { error: 'Status and note are required' },
        { status: 400 }
      )
    }

    // Validate status value
    const validStatuses = ['IN_PROGRESS', 'RESOLVED', 'WAITLISTED', 'DECLINED', 'ACCEPTED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Check if query exists and get current data
    const existingQuery = await prisma.query.findUnique({
      where: { id },
      include: { 
        panchayat: true,
        user: true
      }
    })

    if (!existingQuery) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      )
    }

    // If user is PANCHAYAT or PANCHAYAT_ADMIN, verify they have access to this query's panchayat
    if ((user.role === 'PANCHAYAT') && existingQuery.panchayat?.id !== user.panchayatId)
 {
      return NextResponse.json(
        { error: 'Forbidden - Query does not belong to your panchayat' },
        { status: 403 }
      )
    }

    // If moving to WAITLISTED, ensure user has permission (ADMIN or PANCHAYAT_ADMIN or PANCHAYAT)
    if (status === 'WAITLISTED' && !['ADMIN', 'PANCHAYAT'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Only admins, panchayat admins and panchayats can move queries to waitlist' },
        { status: 403 }
      )
    }

    console.log('Creating update with user ID:', user.id); // Debug log
    
    // Create the update record first
    await prisma.queryUpdate.create({
      data: {
        query: {
          connect: { id }
        },
        user: {
          connect: { id: user.id }
        },
        status,
        note,
      }
    });

    // Then update the query
    const updatedQuery = await prisma.query.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        panchayat: true,
        department: true,
        office: true,
        updates: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                role: true
              }
            }
          }
        }
      }
    });

    // Create a notification if the query is declined
    if (status === 'DECLINED' && existingQuery.user) {
      await prisma.notification.create({
        data: {
          title: 'Query Declined',
          message: `Your query "${existingQuery.title}" has been declined. Reason: ${note}`,
          type: 'query_declined',
          userId: existingQuery.userId,
          queryId: id,
          metadata: {
            queryId: id,
            queryTitle: existingQuery.title,
            reason: note,
          }
        }
      });
    }

    return NextResponse.json(updatedQuery)
  } catch (error) {
    console.error('Error updating query status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
