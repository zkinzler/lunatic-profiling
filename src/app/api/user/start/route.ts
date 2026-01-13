import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Create session - questions are now fixed (24 questions in order)
    // No need to store questionIds since they're always the same
    const session = await prisma.quizSession.create({
      data: {
        email,
        currentPhase: 1, // Start at phase 1
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
