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
            // Primary archetype
            primaryArchetypeCode: true,
            primaryArchetypeName: true,
            primaryArchetypePubLegend: true,
            primaryArchetypePercentage: true,
            // Secondary archetype
            secondaryArchetypeCode: true,
            secondaryArchetypeName: true,
            secondaryArchetypePubLegend: true,
            secondaryArchetypePercentage: true,
            // Hybrid
            isHybrid: true,
            hybridName: true,
            hybridDescription: true,
            hybridPercentageDiff: true,
            // Trait percentages
            traitBSTPercentage: true,
            traitCPRPercentage: true,
            traitAEPercentage: true,
            traitBSPercentage: true,
            // Blueprint sections
            coreDriver: true,
            superpower: true,
            kryptonite: true,
            signatureMove: true,
            chaosPartner: true,
            // Stats
            britishnessQuotient: true,
            britishnessInterpretation: true,
            resistanceClearanceLevel: true,
            chaosPattern: true,
            chaosPatternDescription: true,
            // Visual
            asciiChart: true,
            summary: true,
            shareableStat: true,
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
