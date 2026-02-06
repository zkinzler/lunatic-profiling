import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createErrorResponse, generateRequestId, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { CullingAnswerSchema, validateCullingInput } from '@/lib/culling/validation';
import { getQuestionById, getGhostFromAnswer, TOTAL_QUESTIONS } from '@/lib/culling/questions';
import { getAnswerRoast } from '@/lib/culling/roasts';
import { generateAIRoast } from '@/lib/openai';
import type { AnswerChoice } from '@/lib/culling/questions';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/culling/answer' });

  try {
    const body = await request.json();
    const validation = validateCullingInput(CullingAnswerSchema, body);

    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { sessionId, questionId, answer } = validation.data;

    // Fetch session
    const session = await prisma.cullingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundError('Culling session');
    }

    // Check if already culled
    if (session.culled) {
      return NextResponse.json(
        { error: 'Session has been culled', code: 'ALREADY_CULLED', requestId },
        { status: 400 }
      );
    }

    // Check if in correct phase
    if (session.currentPhase !== 'main') {
      return NextResponse.json(
        { error: 'Not in main question phase', code: 'WRONG_PHASE', requestId },
        { status: 400 }
      );
    }

    // Validate question exists
    const question = getQuestionById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Invalid question ID', code: 'INVALID_QUESTION', requestId },
        { status: 400 }
      );
    }

    // Get the ghost type this answer maps to
    const ghostCode = getGhostFromAnswer(questionId, answer);

    // Update answers
    const currentAnswers = (session.mainAnswers as Record<string, AnswerChoice>) || {};
    currentAnswers[questionId] = answer;

    // Calculate new question index
    const newQuestionIndex = session.questionIndex + 1;
    const allQuestionsAnswered = newQuestionIndex >= TOTAL_QUESTIONS;

    await prisma.cullingSession.update({
      where: { id: sessionId },
      data: {
        mainAnswers: currentAnswers,
        questionIndex: newQuestionIndex,
        currentPhase: allQuestionsAnswered ? 'results' : 'main',
      },
    });

    log.info('Answer saved', {
      sessionId,
      questionId,
      answer,
      ghostCode,
      newQuestionIndex,
      allQuestionsAnswered,
    });

    // Generate roast: try AI first, fall back to hardcoded
    let roast = 'Answer recorded.';
    if (ghostCode) {
      const answerText = question.answers[answer];
      const aiRoast = await generateAIRoast(
        question.question,
        answerText,
        ghostCode,
        question.questionNumber
      );
      roast = aiRoast || getAnswerRoast(question.questionNumber, ghostCode);
    }

    return NextResponse.json({
      success: true,
      questionIndex: newQuestionIndex,
      allQuestionsAnswered,
      nextPhase: allQuestionsAnswered ? 'results' : 'main',
      ghostCode,
      roast,
      requestId,
    });
  } catch (error) {
    log.error('Failed to save answer', error);
    return createErrorResponse(error, requestId);
  }
}
