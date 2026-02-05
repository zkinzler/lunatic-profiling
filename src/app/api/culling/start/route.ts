import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createErrorResponse, generateRequestId } from '@/lib/errors';
import logger from '@/lib/logger';

export async function POST() {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/culling/start' });

  try {
    log.info('Culling session creation started');

    // No body validation needed - The Culling doesn't require email upfront
    // Create a new session - start directly in gates phase (user already typed START)
    const session = await prisma.cullingSession.create({
      data: {
        currentPhase: 'gates',
        gateIndex: 0,
        questionIndex: 0,
        culled: false,
        completed: false,
        emailCtaStage: 0,
      },
    });

    log.info('Culling session created', { sessionId: session.id, publicId: session.publicId });

    return NextResponse.json({
      sessionId: session.id,
      publicId: session.publicId,
      requestId,
    });
  } catch (error) {
    log.error('Failed to create culling session', error);
    return createErrorResponse(error, requestId);
  }
}
