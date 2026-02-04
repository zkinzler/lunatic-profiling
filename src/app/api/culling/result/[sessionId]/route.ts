import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createErrorResponse, generateRequestId, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { GHOST_TYPES } from '@/lib/culling/ghosts';
import { getFinalRoast } from '@/lib/culling/roasts';
import type { GhostCode } from '@/lib/culling/ghosts';

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const requestId = generateRequestId();
  const { sessionId } = await params;
  const log = logger.child({ requestId, path: `/api/culling/result/${sessionId}` });

  try {
    if (!sessionId || sessionId.length > 50) {
      return NextResponse.json(
        { error: 'Invalid session ID', code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    // Try to find by sessionId first, then by publicId
    let session = await prisma.cullingSession.findUnique({
      where: { id: sessionId },
      include: { result: true },
    });

    // If not found, try publicId
    if (!session) {
      session = await prisma.cullingSession.findUnique({
        where: { publicId: sessionId },
        include: { result: true },
      });
    }

    if (!session) {
      throw new NotFoundError('Culling session');
    }

    if (!session.result) {
      return NextResponse.json(
        { error: 'Quiz not yet graded', code: 'NOT_GRADED', requestId },
        { status: 400 }
      );
    }

    const result = session.result;
    const dominantGhost = result.dominantGhost as GhostCode | null;

    log.info('Result fetched', {
      sessionId: session.id,
      isElite: result.isElite,
      dominantGhost,
    });

    // Build detailed response
    const response: Record<string, unknown> = {
      sessionId: session.id,
      publicId: session.publicId,
      requestId,

      // Core result
      isElite: result.isElite,
      culled: session.culled,
      culledAtGate: session.culledAtGate,

      // Ghost scores
      scores: {
        CD: result.ghostCD,
        CA: result.ghostCA,
        OB: result.ghostOB,
        DD: result.ghostDD,
      },

      // Dominant ghost details
      dominantGhost: dominantGhost,
      dominantGhostDetails: dominantGhost ? GHOST_TYPES[dominantGhost] : null,

      // Result copy
      resultTitle: result.resultTitle,
      resultDescription: result.resultDescription,
      comedyFingerprint: result.comedyFingerprint,
      shareText: result.shareText,

      // Final roast
      finalRoast: dominantGhost ? getFinalRoast(dominantGhost, result.isElite) : null,

      // Email status
      emailCtaStage: session.emailCtaStage,
      hasEmail: !!session.email,
    };

    // Calculate percentages
    const totalScore = result.ghostCD + result.ghostCA + result.ghostOB + result.ghostDD;
    if (totalScore > 0) {
      response.percentages = {
        CD: Math.round((result.ghostCD / totalScore) * 100),
        CA: Math.round((result.ghostCA / totalScore) * 100),
        OB: Math.round((result.ghostOB / totalScore) * 100),
        DD: Math.round((result.ghostDD / totalScore) * 100),
      };
    } else {
      response.percentages = { CD: 0, CA: 0, OB: 0, DD: 0 };
    }

    // Get all ghost info for display
    response.allGhosts = Object.values(GHOST_TYPES).map((ghost) => ({
      code: ghost.code,
      name: ghost.name,
      fullTitle: ghost.fullTitle,
      score: result[`ghost${ghost.code}` as keyof typeof result] || 0,
    }));

    return NextResponse.json(response);
  } catch (error) {
    log.error('Failed to fetch result', error);
    return createErrorResponse(error, requestId);
  }
}
