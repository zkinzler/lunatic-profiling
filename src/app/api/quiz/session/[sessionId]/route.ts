import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getQuestionsByIds } from '@/lib/questions';

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

        if (!session.questionIds) {
            return NextResponse.json(
                { error: 'No questions assigned to this session' },
                { status: 400 }
            );
        }

        const questionIds = JSON.parse(session.questionIds);
        const questions = getQuestionsByIds(questionIds);

        return NextResponse.json({ questions });
    } catch (error) {
        console.error('Error fetching session questions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch session questions' },
            { status: 500 }
        );
    }
}
