import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SessionIdParamSchema, validateInput } from '@/lib/validation';
import { createErrorResponse, generateRequestId, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/quiz/result/[sessionId]' });

  try {
    const validation = validateInput(SessionIdParamSchema, params);

    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { sessionId } = validation.data;

    const result = await prisma.result.findFirst({
      where: { sessionId },
      include: {
        session: {
          select: {
            publicId: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundError('Result');
    }

    log.info('Result fetched', { sessionId, resultId: result.id });

    return NextResponse.json({ ...result, requestId });
  } catch (error) {
    log.error('Failed to fetch result', error);
    return createErrorResponse(error, requestId);
  }
}
