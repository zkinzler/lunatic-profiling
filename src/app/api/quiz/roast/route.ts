import { NextRequest, NextResponse } from 'next/server';
import { generateRoast, getSpecialRoast } from '@/lib/roasts';
import { getQuestionById } from '@/lib/questions';
import { RoastRequestSchema, validateInput } from '@/lib/validation';
import { createErrorResponse, generateRequestId, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/quiz/roast' });

  try {
    const body = await request.json();
    const validation = validateInput(RoastRequestSchema, body);

    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { questionId, answerId, answerHistory } = validation.data;

    // Get the question and answer
    const question = getQuestionById(questionId);
    if (!question) {
      throw new NotFoundError('Question');
    }

    const answer = question.answers.find(a => a.id === answerId);
    if (!answer) {
      throw new NotFoundError('Answer');
    }

    // Check for special easter egg roasts first
    const specialRoast = getSpecialRoast(questionId, answerId);

    // Generate the roast
    // Convert answerHistory objects to just answerId strings for pattern detection
    const historyIds = answerHistory?.map(h => h.answerId) || [];
    const roast = specialRoast || generateRoast(
      answer.roastCategory,
      historyIds
    );

    log.info('Roast generated', { questionId, answerId, isSpecial: !!specialRoast });

    return NextResponse.json({
      roast,
      category: answer.roastCategory,
      isSpecial: !!specialRoast,
      requestId,
    });
  } catch (error) {
    log.error('Failed to generate roast', error);
    return createErrorResponse(error, requestId);
  }
}
