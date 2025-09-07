import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Verify admin access
    const session = await getAuthUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const panchayatId = searchParams.get('panchayat');
    const timeframe = searchParams.get('timeframe') || '7';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Calculate date based on timeframe
    const dateFilter = new Date();
    if (timeframe !== 'all') {
      dateFilter.setDate(dateFilter.getDate() - parseInt(timeframe));
    } else {
      // If 'all' is selected, set to a very old date
      dateFilter.setFullYear(2000);
    }

    // Build where clause
    const where = {
      ...(panchayatId && panchayatId !== 'all' ? { panchayatId } : {}),
      createdAt: { gte: dateFilter },
    };

    // Fetch data in parallel
    const [users, queries, panchayats, stats] = await Promise.all([
      // Recent users
      prisma.user.findMany({
        where: {
          ...where,
          role: { not: 'ADMIN' } // Don't include other admins
        },
        include: {
          panchayat: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      
      // Recent queries
      prisma.query.findMany({
        where: {
          ...where,
        },
        include: {
          user: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      
      // All panchayats for filter
      prisma.panchayat.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      }),
      
      // Statistics
      Promise.all([
        // Total users
        prisma.user.count({
          where: {
            ...(panchayatId && panchayatId !== 'all' ? { panchayatId } : {}),
            role: { not: 'ADMIN' }
          },
        }),
        
        // Active queries (using only valid status values from QueryStatus enum)
        prisma.query.count({
          where: {
            ...where,
            status: { in: ['PENDING_REVIEW', 'ACCEPTED'] }
          },
        }),
        
        // New users this week
        prisma.user.count({
          where: {
            ...where,
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            role: { not: 'ADMIN' }
          },
        }),
        
        // Issues (declined queries)
        prisma.query.count({
          where: {
            ...where,
            status: 'DECLINED',
          },
        }),
      ]),
    ]);

    const [totalUsers, activeQueries, newUsers, issues] = stats;

    return NextResponse.json({
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        panchayat: user.panchayat ? { name: user.panchayat.name } : null,
      })),
      queries: queries.map(query => ({
        id: query.id,
        title: query.title,
        status: query.status,
        createdAt: query.createdAt.toISOString(),
        user: { name: query.user.name },
      })),
      panchayats: panchayats.map(p => ({
        id: p.id,
        name: p.name,
      })),
      stats: {
        totalUsers,
        activeQueries,
        newUsers,
        issues,
      },
    });

  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
