import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');

  if (!adminToken || adminToken !== process.env.ADMIN_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);

    // Get all usage events from yesterday
    const events = await prisma.usageEvent.findMany({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    });

    if (events.length === 0) {
      return NextResponse.json({ ok: true, summarized: 0 });
    }

    // Group by model and provider
    interface GroupedUsage {
      model: string;
      provider: string;
      calls: number;
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      inputCostUsd: number;
      outputCostUsd: number;
      totalCostUsd: number;
    }

    const groups = events.reduce((acc, event) => {
      const key = `${event.model}:${event.provider}`;
      if (!acc[key]) {
        acc[key] = {
          model: event.model,
          provider: event.provider,
          calls: 0,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          inputCostUsd: 0,
          outputCostUsd: 0,
          totalCostUsd: 0,
        };
      }

      acc[key].calls += 1;
      acc[key].promptTokens += event.promptTokens;
      acc[key].completionTokens += event.completionTokens;
      acc[key].totalTokens += event.totalTokens;
      acc[key].inputCostUsd += Number(event.inputCostUsd);
      acc[key].outputCostUsd += Number(event.outputCostUsd);
      acc[key].totalCostUsd += Number(event.totalCostUsd);

      return acc;
    }, {} as Record<string, GroupedUsage>);

    // Upsert daily cost records
    let summarized = 0;
    for (const group of Object.values(groups)) {
      await prisma.dailyCost.upsert({
        where: {
          day: yesterday,
        },
        create: {
          day: yesterday,
          model: group.model,
          provider: group.provider,
          calls: group.calls,
          promptTokens: group.promptTokens,
          completionTokens: group.completionTokens,
          totalTokens: group.totalTokens,
          inputCostUsd: group.inputCostUsd,
          outputCostUsd: group.outputCostUsd,
          totalCostUsd: group.totalCostUsd,
        },
        update: {
          calls: group.calls,
          promptTokens: group.promptTokens,
          completionTokens: group.completionTokens,
          totalTokens: group.totalTokens,
          inputCostUsd: group.inputCostUsd,
          outputCostUsd: group.outputCostUsd,
          totalCostUsd: group.totalCostUsd,
          updatedAt: new Date(),
        },
      });
      summarized++;
    }

    return NextResponse.json({ ok: true, summarized });
  } catch (error) {
    console.error('Error in rollup job:', error);
    return NextResponse.json(
      { error: 'Failed to process rollup' },
      { status: 500 }
    );
  }
}