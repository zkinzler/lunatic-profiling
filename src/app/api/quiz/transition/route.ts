import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  generatePhase1Transition,
  generatePhase2Transition,
  type ArchetypeStanding,
} from '@/lib/transitions';
import type { AnswerSelection } from '@/lib/scoring';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, phase, phase1Standings } = await request.json();

    if (!sessionId || !phase) {
      return NextResponse.json(
        { error: 'Session ID and phase are required' },
        { status: 400 }
      );
    }

    if (phase !== 1 && phase !== 2) {
      return NextResponse.json(
        { error: 'Phase must be 1 or 2 for transitions' },
        { status: 400 }
      );
    }

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (!session.answers) {
      return NextResponse.json(
        { error: 'No answers found' },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      transition,
    });
  } catch (error) {
    console.error('Error generating transition:', error);
    return NextResponse.json(
      { error: 'Failed to generate transition' },
      { status: 500 }
    );
  }
}
