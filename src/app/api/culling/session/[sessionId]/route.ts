import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createErrorResponse, generateRequestId, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { GATES } from '@/lib/culling/gates';
import { CULLING_QUESTIONS } from '@/lib/culling/questions';

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const requestId = generateRequestId();
  const { sessionId } = await params;
  const log = logger.child({ requestId, path: `/api/culling/session/${sessionId}` });

  try {
    if (!sessionId || sessionId.length > 50) {
      return NextResponse.json(
        { error: 'Invalid session ID', code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const session = await prisma.cullingSession.findUnique({
      where: { id: sessionId },
      include: { result: true },
    });

    if (!session) {
      throw new NotFoundError('Culling session');
    }

    log.info('Session fetched', { sessionId, phase: session.currentPhase });

    // Build response based on current phase
    const response: Record<string, unknown> = {
      sessionId: session.id,
      publicId: session.publicId,
      currentPhase: session.currentPhase,
      culled: session.culled,
      completed: session.completed,
      requestId,
    };

    // Add gate info if in gates phase
    if (session.currentPhase === 'gates' || session.currentPhase === 'intro') {
      response.gateIndex = session.gateIndex;
      response.totalGates = GATES.length;
      response.gateAnswers = session.gateAnswers || {};

      // Include current gate question if in gates phase
      if (session.currentPhase === 'gates' && session.gateIndex < GATES.length) {
        const currentGate = GATES[session.gateIndex];
        response.currentGate = {
          id: currentGate.id,
          gateNumber: currentGate.gateNumber,
          question: currentGate.question,
          yesText: currentGate.yesText,
          noText: currentGate.noText,
        };
      }
    }

    // Add question info if in main phase
    if (session.currentPhase === 'main') {
      response.questionIndex = session.questionIndex;
      response.totalQuestions = CULLING_QUESTIONS.length;
      response.mainAnswers = session.mainAnswers || {};

      // Include current question if not all answered
      if (session.questionIndex < CULLING_QUESTIONS.length) {
        const currentQuestion = CULLING_QUESTIONS[session.questionIndex];
        response.currentQuestion = {
          id: currentQuestion.id,
          questionNumber: currentQuestion.questionNumber,
          title: currentQuestion.title,
          question: currentQuestion.question,
          answers: currentQuestion.answers,
        };
      }
    }

    // Add cull info if culled
    if (session.culled) {
      response.culledAtGate = session.culledAtGate;
      response.culledReason = session.culledReason;
    }

    // Add result info if completed
    if (session.result) {
      response.hasResult = true;
      response.isElite = session.result.isElite;
    }

    // Add email CTA stage
    response.emailCtaStage = session.emailCtaStage;

    return NextResponse.json(response);
  } catch (error) {
    log.error('Failed to fetch session', error);
    return createErrorResponse(error, requestId);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const requestId = generateRequestId();
  const { sessionId } = await params;
  const log = logger.child({ requestId, path: `/api/culling/session/${sessionId}` });

  try {
    if (!sessionId || sessionId.length > 50) {
      return NextResponse.json(
        { error: 'Invalid session ID', code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action } = body;

    const session = await prisma.cullingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundError('Culling session');
    }

    // Handle start_gates action - transition from intro to gates
    if (action === 'start_gates') {
      if (session.currentPhase !== 'intro') {
        return NextResponse.json(
          { error: 'Session not in intro phase', code: 'INVALID_PHASE', requestId },
          { status: 400 }
        );
      }

      await prisma.cullingSession.update({
        where: { id: sessionId },
        data: { currentPhase: 'gates' },
      });

      log.info('Session transitioned to gates', { sessionId });

      return NextResponse.json({
        success: true,
        currentPhase: 'gates',
        requestId,
      });
    }

    return NextResponse.json(
      { error: 'Unknown action', code: 'INVALID_ACTION', requestId },
      { status: 400 }
    );
  } catch (error) {
    log.error('Failed to update session', error);
    return createErrorResponse(error, requestId);
  }
}
