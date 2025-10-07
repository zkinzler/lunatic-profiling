import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');

  if (!adminToken || adminToken !== process.env.ADMIN_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Last 30 days of daily rollups
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const daily = await prisma.dailyCost.findMany({
      where: {
        day: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        day: 'desc',
      },
    });

    // Last 100 usage events
    const recent = await prisma.usageEvent.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ daily, recent });
  } catch (error) {
    console.error('Error fetching usage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}