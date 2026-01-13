import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getQuestionNumber } from '@/lib/questions';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, questionId, answers } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Quiz session not found' },
        { status: 404 }
      );
    }

    // Handle both individual question saves and bulk saves
    if (questionId && answers) {
      // Individual question save
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
          completed: false, // Will be marked completed when grading
        },
      });

      return NextResponse.json({
        success: true,
        currentPhase: newPhase,
        questionNumber,
      });
    } else if (answers && !questionId) {
      // Bulk save (legacy behavior)
      await prisma.quizSession.update({
        where: { id: sessionId },
        data: {
          answers,
          currentPhase: 3, // If bulk saving, assume quiz is done
          completed: true,
        },
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Either questionId with answers or complete answers object is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error saving quiz answers:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz answers' },
      { status: 500 }
    );
  }
}
