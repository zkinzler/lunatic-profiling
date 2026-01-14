import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      latencyMs?: number;
      error?: string;
    };
    environment: {
      nodeEnv: string;
      hasOpenAI: boolean;
      hasResend: boolean;
      hasSentry: boolean;
    };
  };
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const startTime = Date.now();

  // Check database connection
  let dbStatus: HealthStatus['checks']['database'];
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - dbStart;
    dbStatus = { status: 'up', latencyMs: dbLatency };
  } catch (error) {
    dbStatus = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }

  // Check environment configuration
  const envStatus: HealthStatus['checks']['environment'] = {
    nodeEnv: process.env.NODE_ENV || 'development',
    hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
    hasResend: Boolean(process.env.RESEND_API_KEY),
    hasSentry: Boolean(process.env.SENTRY_DSN),
  };

  // Determine overall status
  let overallStatus: HealthStatus['status'] = 'healthy';
  if (dbStatus.status === 'down') {
    overallStatus = 'unhealthy';
  } else if (!envStatus.hasOpenAI || !envStatus.hasResend) {
    // Running without optional services is degraded, not unhealthy
    overallStatus = 'degraded';
  }

  const response: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: dbStatus,
      environment: envStatus,
    },
  };

  const statusCode = overallStatus === 'unhealthy' ? 503 : 200;

  return NextResponse.json(response, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Response-Time': `${Date.now() - startTime}ms`,
    },
  });
}
