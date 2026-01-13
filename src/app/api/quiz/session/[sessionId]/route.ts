import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { QUIZ_QUESTIONS } from '@/lib/questions';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params;

        const session = await prisma.quizSession.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            );
        }

        // Return fixed questions (all 24 in order) with current phase
        return NextResponse.json({
            questions: QUIZ_QUESTIONS,
            currentPhase: session.currentPhase,
            answers: session.answers || {},
            completed: session.completed,
        });
    } catch (error) {
        console.error('Error fetching session questions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch session questions' },
            { status: 500 }
        );
    }
}
