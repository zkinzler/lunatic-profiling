import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateBlueprint, blueprintToResultData, type BlueprintInput } from '@/lib/blueprint';
import type { AnswerSelection } from '@/lib/scoring';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { result: true },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Quiz session not found' },
        { status: 404 }
      );
    }

    // If already graded, return existing result
    if (session.result) {
      return NextResponse.json({ success: true, resultId: session.result.id });
    }

    if (!session.answers) {
      return NextResponse.json(
        { error: 'No answers found for this session' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: `Quiz incomplete. Expected 24 questions, got ${answers.length}` },
        { status: 400 }
      );
    }

    // Generate the blueprint
    const blueprintInput: BlueprintInput = {
      answers,
      sessionId,
    };

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

    return NextResponse.json({
      success: true,
      resultId: result.id,
      publicId: session.publicId,
    });
  } catch (error) {
    console.error('Error grading quiz:', error);
    return NextResponse.json(
      { error: 'Failed to grade quiz', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
