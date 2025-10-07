import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

      await prisma.quizSession.update({
        where: { id: sessionId },
        data: {
          answers: currentAnswers,
          completed: false, // Will be marked completed when grading
        },
      });
    } else if (answers && !questionId) {
      // Bulk save (original behavior)
      await prisma.quizSession.update({
        where: { id: sessionId },
        data: {
          answers,
          completed: true,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Either questionId with answers or complete answers object is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving quiz answers:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz answers' },
      { status: 500 }
    );
  }
}