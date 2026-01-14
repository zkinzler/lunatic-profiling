import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getQuestionNumber } from '@/lib/questions';
import { SaveAnswerSchema, validateInput } from '@/lib/validation';
import { createErrorResponse, generateRequestId, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { z } from 'zod';

// Schema for bulk save (legacy)
const BulkSaveSchema = z.object({
  sessionId: z.string().min(1),
  answers: z.record(z.string(), z.array(z.string())),
});

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/quiz/save' });

  try {
    const body = await request.json();

    // Check if this is a bulk save or individual save
    const isBulkSave = body.answers && !body.questionId;

    if (isBulkSave) {
      // Bulk save validation
      const validation = validateInput(BulkSaveSchema, body);
      if (!validation.success) {
        log.warn('Bulk save validation failed', { error: validation.error });
        return NextResponse.json(
          { error: validation.error, code: 'VALIDATION_ERROR', requestId },
          { status: 400 }
        );
      }

      const { sessionId, answers } = validation.data;

      const session = await prisma.quizSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        throw new NotFoundError('Quiz session');
      }

      await prisma.quizSession.update({
        where: { id: sessionId },
        data: {
          answers,
          currentPhase: 3,
          completed: true,
        },
      });

      log.info('Bulk save completed', { sessionId });
      return NextResponse.json({ success: true, requestId });
    }

    // Individual question save
    const validation = validateInput(SaveAnswerSchema, body);
    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { sessionId, questionId, answers } = validation.data;

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundError('Quiz session');
    }

    const currentAnswers = (session.answers as Record<string, string[]>) || {};
    currentAnswers[questionId] = answers;

    // Determine current phase based on question number
    const questionNumber = getQuestionNumber(questionId);
    let newPhase = session.currentPhase;

    if (questionNumber > 16) {
      newPhase = 3;
    } else if (questionNumber > 8) {
      newPhase = 2;
    } else {
      newPhase = 1;
    }

    await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        answers: currentAnswers,
        currentPhase: newPhase,
        completed: false,
      },
    });

    log.info('Answer saved', { sessionId, questionId, questionNumber, newPhase });

    return NextResponse.json({
      success: true,
      currentPhase: newPhase,
      questionNumber,
      requestId,
    });
  } catch (error) {
    log.error('Failed to save answer', error);
    return createErrorResponse(error, requestId);
  }
}
