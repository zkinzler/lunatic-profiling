import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createErrorResponse, generateRequestId, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { CullingEmailSchema, validateCullingInput } from '@/lib/culling/validation';
import {
  getEmailCtaContent,
  getNextStage,
  isValidEmail,
  getThankYouMessage,
} from '@/lib/culling/email-cta';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/culling/email' });

  try {
    const body = await request.json();
    const validation = validateCullingInput(CullingEmailSchema, body);

    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { sessionId, action, email } = validation.data;

    // Fetch session
    const session = await prisma.cullingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundError('Culling session');
    }

    const saidYes = action === 'yes';
    const currentStage = session.emailCtaStage;

    // If saying yes, validate email
    if (saidYes) {
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required when saying yes', code: 'EMAIL_REQUIRED', requestId },
          { status: 400 }
        );
      }

      if (!isValidEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email format', code: 'INVALID_EMAIL', requestId },
          { status: 400 }
        );
      }

      // Capture email
      await prisma.cullingSession.update({
        where: { id: sessionId },
        data: {
          email,
          emailCtaStage: 3, // Captured
          currentPhase: 'results',
        },
      });

      // Also update result if exists
      await prisma.cullingResult.updateMany({
        where: { sessionId },
        data: {
          emailed: false, // Will be emailed later
        },
      });

      log.info('Email captured', { sessionId, email });

      return NextResponse.json({
        success: true,
        emailCaptured: true,
        newStage: 3,
        content: getEmailCtaContent(3),
        thankYouMessage: getThankYouMessage(),
        requestId,
      });
    }

    // Saying no - escalate or dismiss
    const newStage = getNextStage(currentStage, false);
    const dismissed = currentStage >= 2; // They said no on final stage

    await prisma.cullingSession.update({
      where: { id: sessionId },
      data: {
        emailCtaStage: newStage,
        currentPhase: dismissed ? 'results' : 'email_cta',
      },
    });

    log.info('Email CTA declined', { sessionId, currentStage, newStage, dismissed });

    if (dismissed) {
      return NextResponse.json({
        success: true,
        emailCaptured: false,
        dismissed: true,
        newStage,
        requestId,
      });
    }

    // Return next escalation content
    return NextResponse.json({
      success: true,
      emailCaptured: false,
      dismissed: false,
      newStage,
      content: getEmailCtaContent(newStage),
      requestId,
    });
  } catch (error) {
    log.error('Failed to process email CTA', error);
    return createErrorResponse(error, requestId);
  }
}
