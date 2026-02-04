import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createErrorResponse, generateRequestId, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { CullingGateSchema, validateCullingInput } from '@/lib/culling/validation';
import { checkGateAnswer, getGateById, TOTAL_GATES } from '@/lib/culling/gates';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/culling/gate' });

  try {
    const body = await request.json();
    const validation = validateCullingInput(CullingGateSchema, body);

    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { sessionId, gateId, answer } = validation.data;

    // Fetch session
    const session = await prisma.cullingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundError('Culling session');
    }

    // Check if already culled
    if (session.culled) {
      return NextResponse.json({
        passed: false,
        culled: true,
        cullReason: session.culledReason,
        requestId,
      });
    }

    // Validate gate exists
    const gate = getGateById(gateId);
    if (!gate) {
      return NextResponse.json(
        { error: 'Invalid gate ID', code: 'INVALID_GATE', requestId },
        { status: 400 }
      );
    }

    // Check gate answer
    const { passed, passMessage, cullReason, shareText } = checkGateAnswer(gateId, answer);

    // Update gate answers
    const currentGateAnswers = (session.gateAnswers as Record<string, boolean>) || {};
    currentGateAnswers[gateId] = answer;

    if (passed) {
      // Determine next phase
      const newGateIndex = session.gateIndex + 1;
      const allGatesPassed = newGateIndex >= TOTAL_GATES;

      await prisma.cullingSession.update({
        where: { id: sessionId },
        data: {
          gateAnswers: currentGateAnswers,
          gateIndex: newGateIndex,
          currentPhase: allGatesPassed ? 'main' : 'gates',
        },
      });

      log.info('Gate passed', { sessionId, gateId, newGateIndex, allGatesPassed });

      return NextResponse.json({
        passed: true,
        culled: false,
        gateIndex: newGateIndex,
        allGatesPassed,
        nextPhase: allGatesPassed ? 'main' : 'gates',
        passMessage,
        requestId,
      });
    } else {
      // User failed the gate - CULLED
      await prisma.cullingSession.update({
        where: { id: sessionId },
        data: {
          gateAnswers: currentGateAnswers,
          culled: true,
          culledAtGate: gate.gateNumber,
          culledReason: cullReason,
          currentPhase: 'results',
          completed: true,
        },
      });

      log.info('User culled at gate', { sessionId, gateId, gateNumber: gate.gateNumber });

      return NextResponse.json({
        passed: false,
        culled: true,
        culledAtGate: gate.gateNumber,
        cullReason,
        shareText,
        requestId,
      });
    }
  } catch (error) {
    log.error('Failed to process gate answer', error);
    return createErrorResponse(error, requestId);
  }
}
