import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createErrorResponse, generateRequestId, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { CullingGradeSchema, validateCullingInput } from '@/lib/culling/validation';
import { calculateCullingResult } from '@/lib/culling/scoring';
import { TOTAL_QUESTIONS } from '@/lib/culling/questions';
import type { AnswerChoice } from '@/lib/culling/questions';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/culling/grade' });

  try {
    const body = await request.json();
    const validation = validateCullingInput(CullingGradeSchema, body);

    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { sessionId } = validation.data;

    // Fetch session
    const session = await prisma.cullingSession.findUnique({
      where: { id: sessionId },
      include: { result: true },
    });

    if (!session) {
      throw new NotFoundError('Culling session');
    }

    // If already has a result, return it
    if (session.result) {
      log.info('Returning existing result', { sessionId, resultId: session.result.id });
      return NextResponse.json({
        success: true,
        resultId: session.result.id,
        isElite: session.result.isElite,
        dominantGhost: session.result.dominantGhost,
        requestId,
      });
    }

    // If culled at gates, no scoring needed
    if (session.culled) {
      log.info('Session was culled at gates, no scoring', { sessionId });

      // Create a minimal result for culled users
      const result = await prisma.cullingResult.create({
        data: {
          sessionId: session.id,
          ghostCD: 0,
          ghostCA: 0,
          ghostOB: 0,
          ghostDD: 0,
          dominantGhost: null,
          isElite: false,
          resultTitle: `Culled at Gate ${session.culledAtGate}`,
          resultDescription: session.culledReason || 'You did not survive the gates.',
          comedyFingerprint: 'CULLED-AT-GATES',
          shareText: `I was culled at Gate ${session.culledAtGate} of The Culling. I didn't make it past the gates. Think you can do better?`,
        },
      });

      await prisma.cullingSession.update({
        where: { id: sessionId },
        data: {
          completed: true,
          currentPhase: 'results',
        },
      });

      return NextResponse.json({
        success: true,
        resultId: result.id,
        isElite: false,
        culledAtGate: session.culledAtGate,
        requestId,
      });
    }

    // Validate all questions answered
    const answers = (session.mainAnswers as Record<string, AnswerChoice>) || {};
    const answerCount = Object.keys(answers).length;

    if (answerCount < TOTAL_QUESTIONS) {
      return NextResponse.json(
        {
          error: `Incomplete quiz. ${answerCount}/${TOTAL_QUESTIONS} questions answered.`,
          code: 'INCOMPLETE_QUIZ',
          requestId,
        },
        { status: 400 }
      );
    }

    // Calculate the result
    const scoreResult = calculateCullingResult(answers);

    log.info('Scoring complete', {
      sessionId,
      scores: scoreResult.scores,
      dominantGhost: scoreResult.dominantGhost,
      isElite: scoreResult.isElite,
    });

    // Create the result record
    const result = await prisma.cullingResult.create({
      data: {
        sessionId: session.id,
        ghostCD: scoreResult.scores.CD,
        ghostCA: scoreResult.scores.CA,
        ghostOB: scoreResult.scores.OB,
        ghostDD: scoreResult.scores.DD,
        dominantGhost: scoreResult.dominantGhost,
        isElite: scoreResult.isElite,
        resultTitle: scoreResult.resultTitle,
        resultDescription: scoreResult.resultDescription,
        comedyFingerprint: scoreResult.comedyFingerprint,
        shareText: scoreResult.shareText,
      },
    });

    // Mark session as completed
    await prisma.cullingSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        currentPhase: 'email_cta',
      },
    });

    log.info('Result created', { sessionId, resultId: result.id, isElite: scoreResult.isElite });

    return NextResponse.json({
      success: true,
      resultId: result.id,
      isElite: scoreResult.isElite,
      dominantGhost: scoreResult.dominantGhost,
      scores: scoreResult.scores,
      percentages: scoreResult.percentages,
      requestId,
    });
  } catch (error) {
    log.error('Failed to grade quiz', error);
    return createErrorResponse(error, requestId);
  }
}
