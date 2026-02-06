import { NextRequest, NextResponse } from 'next/server';
import { generateRoast, getSpecialRoast } from '@/lib/roasts';
import { getQuestionById } from '@/lib/questions';
import { RoastRequestSchema, validateInput } from '@/lib/validation';
import { createErrorResponse, generateRequestId, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { generateAIRoast, isOpenAIAvailable } from '@/lib/openai';

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

    let roast: string;
    let isAIGenerated = false;

    if (specialRoast) {
      // Use special easter egg roast
      roast = specialRoast;
    } else if (isOpenAIAvailable()) {
      // Try AI-generated roast first
      const historyIds = answerHistory?.map(h => h.answerId) || [];
      const aiRoast = await generateAIRoast(
        question.question,
        answer.text,
        answer.roastCategory,
        0
      );

      if (aiRoast) {
        roast = aiRoast;
        isAIGenerated = true;
        log.info('AI roast generated', { questionId, answerId });
      } else {
        // Fallback to template if AI fails
        roast = generateRoast(answer.roastCategory, historyIds);
        log.info('Fallback to template roast (AI failed)', { questionId, answerId });
      }
    } else {
      // No OpenAI key, use template
      const historyIds = answerHistory?.map(h => h.answerId) || [];
      roast = generateRoast(answer.roastCategory, historyIds);
      log.info('Template roast generated (no API key)', { questionId, answerId });
    }

    return NextResponse.json({
      roast,
      category: answer.roastCategory,
      isSpecial: !!specialRoast,
      isAIGenerated,
      requestId,
    });
  } catch (error) {
    log.error('Failed to generate roast', error);
    return createErrorResponse(error, requestId);
  }
}
