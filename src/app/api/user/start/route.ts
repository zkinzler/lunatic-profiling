import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { StartSessionSchema, validateInput } from '@/lib/validation';
import { createErrorResponse, generateRequestId } from '@/lib/errors';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/user/start' });

  try {
    log.info('Session creation started');

    const body = await request.json();
    const validation = validateInput(StartSessionSchema, body);

    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Create session - questions are now fixed (24 questions in order)
    const session = await prisma.quizSession.create({
      data: {
        email,
        currentPhase: 1,
      },
    });

    log.info('Session created', { sessionId: session.id });

    return NextResponse.json({ sessionId: session.id, requestId });
  } catch (error) {
    log.error('Failed to create session', error);
    return createErrorResponse(error, requestId);
  }
}
