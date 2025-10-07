import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const session = await prisma.quizSession.create({
      data: {
        email,
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