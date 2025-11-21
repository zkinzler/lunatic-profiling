import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getRandomQuestions } from '@/lib/questions';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Select 8 random questions
    const selectedQuestions = getRandomQuestions(8);
    const questionIds = selectedQuestions.map(q => q.id);

    const session = await prisma.quizSession.create({
      data: {
        email,
        questionIds: JSON.stringify(questionIds),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating quiz session:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz session' },
      { status: 500 }
    );
  }
}