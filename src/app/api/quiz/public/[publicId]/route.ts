import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PublicIdParamSchema, validateInput } from '@/lib/validation';
import { createErrorResponse, generateRequestId, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/quiz/public/[publicId]' });

  try {
    const validation = validateInput(PublicIdParamSchema, params);

    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { publicId } = validation.data;

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
      throw new NotFoundError('Public result');
    }

    log.info('Public result fetched', { publicId });

    return NextResponse.json({ ...session.result, requestId });
  } catch (error) {
    log.error('Failed to fetch public result', error);
    return createErrorResponse(error, requestId);
  }
}
