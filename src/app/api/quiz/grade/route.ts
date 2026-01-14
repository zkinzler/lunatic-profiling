import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateBlueprint, blueprintToResultData, type BlueprintInput } from '@/lib/blueprint';
import type { AnswerSelection } from '@/lib/scoring';
import { GradeRequestSchema, validateInput } from '@/lib/validation';
import { createErrorResponse, generateRequestId, NotFoundError, ValidationError } from '@/lib/errors';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/quiz/grade' });

  try {
    log.info('Grading started');

    const body = await request.json();
    const validation = validateInput(GradeRequestSchema, body);

    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { sessionId } = validation.data;

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { result: true },
    });

    if (!session) {
      throw new NotFoundError('Quiz session');
    }

    // If already graded, return existing result
    if (session.result) {
      log.info('Returning existing result', { sessionId, resultId: session.result.id });
      return NextResponse.json({ success: true, resultId: session.result.id, requestId });
    }

    if (!session.answers) {
      throw new ValidationError('No answers found for this session');
    }

    // Convert answers from Record<string, string[]> to AnswerSelection[]
    const rawAnswers = session.answers as Record<string, string[]>;
    const answers: AnswerSelection[] = Object.entries(rawAnswers).map(
      ([questionId, answerIds]) => ({
        questionId,
        answerIds: Array.isArray(answerIds) ? answerIds : [answerIds],
      })
    );

    // Validate we have all 24 answers
    if (answers.length < 24) {
      throw new ValidationError(`Quiz incomplete. Expected 24 questions, got ${answers.length}`);
    }

    // Generate the blueprint
    const blueprintInput: BlueprintInput = {
      answers,
      sessionId,
    };

    log.info('Generating blueprint', { sessionId, answerCount: answers.length });

    const { blueprint } = generateBlueprint(blueprintInput);

    // Convert blueprint to database format
    const resultData = blueprintToResultData(blueprint, sessionId);

    // Create result in database
    const result = await prisma.result.create({
      data: resultData,
    });

    // Update session status to completed
    await prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        currentPhase: 3,
      },
    });

    log.info('Grading completed', {
      sessionId,
      resultId: result.id,
      primaryArchetype: result.primaryArchetypeCode,
    });

    return NextResponse.json({
      success: true,
      resultId: result.id,
      publicId: session.publicId,
      requestId,
    });
  } catch (error) {
    log.error('Failed to grade quiz', error);
    return createErrorResponse(error, requestId);
  }
}
