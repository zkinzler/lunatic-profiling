import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  generatePhase1Transition,
  generatePhase2Transition,
  type ArchetypeStanding,
} from '@/lib/transitions';
import type { AnswerSelection } from '@/lib/scoring';
import { TransitionRequestSchema, validateInput } from '@/lib/validation';
import { createErrorResponse, generateRequestId, NotFoundError, ValidationError } from '@/lib/errors';
import logger from '@/lib/logger';
import { z } from 'zod';

// Extended schema for transition with optional phase1Standings
// Must match ArchetypeStanding interface from transitions.ts
const ExtendedTransitionSchema = TransitionRequestSchema.extend({
  phase1Standings: z.array(z.object({
    code: z.string(),
    name: z.string(),
    pubLegend: z.string(),
    percentage: z.number(),
    position: z.number(),
    movement: z.enum(['up', 'down', 'stable']).optional(),
  })).optional(),
});

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/quiz/transition' });

  try {
    const body = await request.json();
    const validation = validateInput(ExtendedTransitionSchema, body);

    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { sessionId, phase, phase1Standings } = validation.data;

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundError('Session');
    }

    if (!session.answers) {
      throw new ValidationError('No answers found');
    }

    // Convert answers to AnswerSelection[]
    const rawAnswers = session.answers as Record<string, string[]>;
    const answers: AnswerSelection[] = Object.entries(rawAnswers).map(
      ([questionId, answerIds]) => ({
        questionId,
        answerIds: Array.isArray(answerIds) ? answerIds : [answerIds],
      })
    );

    // Generate the appropriate transition
    let transition;
    if (phase === 1) {
      transition = generatePhase1Transition(answers);
    } else {
      transition = generatePhase2Transition(
        answers,
        phase1Standings as ArchetypeStanding[] | undefined
      );
    }

    log.info('Transition generated', { sessionId, phase });

    return NextResponse.json({
      success: true,
      transition,
      requestId,
    });
  } catch (error) {
    log.error('Failed to generate transition', error);
    return createErrorResponse(error, requestId);
  }
}
