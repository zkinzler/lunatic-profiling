import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db';
import ResultEmail from '@/emails/ResultEmail';
import { EmailRequestSchema, validateInput } from '@/lib/validation';
import { createErrorResponse, generateRequestId, NotFoundError, ConflictError } from '@/lib/errors';
import logger from '@/lib/logger';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const log = logger.child({ requestId, path: '/api/quiz/email' });

  try {
    const body = await request.json();
    const validation = validateInput(EmailRequestSchema, body);

    if (!validation.success) {
      log.warn('Validation failed', { error: validation.error });
      return NextResponse.json(
        { error: validation.error, code: 'VALIDATION_ERROR', requestId },
        { status: 400 }
      );
    }

    const { sessionId } = validation.data;

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { result: true },
    });

    if (!session || !session.result || !session.email) {
      throw new NotFoundError('Session, result, or email');
    }

    if (session.result.emailed) {
      log.warn('Email already sent', { sessionId });
      throw new ConflictError('Email already sent for this session');
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/share/${session.publicId}`;

    // Determine recipient email (dev override takes precedence)
    const recipientEmail = process.env.RESULTS_DEV_RECIPIENT || session.email;
    const emailFrom = process.env.EMAIL_FROM || 'Lunatic Profiling <no-reply@lunacy.local>';

    const emailProps = {
      primaryArchetypeName: session.result.primaryArchetypeName,
      primaryArchetypePubLegend: session.result.primaryArchetypePubLegend,
      primaryArchetypePercentage: session.result.primaryArchetypePercentage,
      secondaryArchetypeName: session.result.secondaryArchetypeName || undefined,
      secondaryArchetypePubLegend: session.result.secondaryArchetypePubLegend || undefined,
      secondaryArchetypePercentage: session.result.secondaryArchetypePercentage || undefined,
      isHybrid: session.result.isHybrid,
      summary: session.result.summary || '',
      shareUrl,
    };

    if (!resend) {
      // No Resend API key configured - log and simulate success in dev
      log.info('Email simulation (no RESEND_API_KEY)', {
        to: recipientEmail,
        shareUrl,
        primaryArchetype: emailProps.primaryArchetypePubLegend,
      });

      if (process.env.RESULTS_DEV_RECIPIENT) {
        log.info('Dev override active', {
          original: session.email,
          redirected: recipientEmail,
        });
      }
    } else {
      // Send actual email via Resend
      log.info('Sending email via Resend', { to: recipientEmail });

      const emailResult = await resend.emails.send({
        from: emailFrom,
        to: [recipientEmail],
        subject: 'Your Lunacy Blueprint Results',
        react: ResultEmail(emailProps),
      });

      log.info('Email sent', { resendResponse: emailResult });

      if (process.env.RESULTS_DEV_RECIPIENT) {
        log.info('Dev override: email redirected', {
          original: session.email,
          redirected: recipientEmail,
        });
      }
    }

    await prisma.result.update({
      where: { id: session.result.id },
      data: {
        emailed: true,
        emailedAt: new Date(),
      },
    });

    log.info('Email status updated', { sessionId });

    return NextResponse.json({ success: true, requestId });
  } catch (error) {
    log.error('Failed to send email', error);
    return createErrorResponse(error, requestId);
  }
}
