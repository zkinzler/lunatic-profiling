import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    const { publicId } = params;

    const session = await prisma.quizSession.findUnique({
      where: { publicId },
      include: {
        result: {
          select: {
            topArchetypes: true,
            overlaps: true,
            asciiChart: true,
            summary: true,
          },
        },
      },
    });

    if (!session || !session.result) {
      return NextResponse.json(
        { error: 'Public result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(session.result);
  } catch (error) {
    console.error('Error fetching public result:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public result' },
      { status: 500 }
    );
  }
}