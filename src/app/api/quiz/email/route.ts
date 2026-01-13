import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db';
import ResultEmail from '@/emails/ResultEmail';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { result: true },
    });

    if (!session || !session.result || !session.email) {
      return NextResponse.json(
        { error: 'Session, result, or email not found' },
        { status: 404 }
      );
    }

    if (session.result.emailed) {
      console.log('⚠️  Email already sent for this session');
      return NextResponse.json(
        { error: 'Email already sent for this session' },
        { status: 400 }
      );
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
      console.log('📧 EMAIL SIMULATION (no RESEND_API_KEY configured):');
      console.log(`   To: ${recipientEmail}`);
      console.log(`   Subject: Your Lunacy Blueprint Results`);
      console.log(`   Share URL: ${shareUrl}`);
      console.log(`   Primary: ${emailProps.primaryArchetypePubLegend} (${emailProps.primaryArchetypeName})`);
      if (emailProps.isHybrid) {
        console.log(`   Secondary: ${emailProps.secondaryArchetypePubLegend} (${emailProps.secondaryArchetypeName})`);
      }

      if (process.env.RESULTS_DEV_RECIPIENT) {
        console.log(`   🔄 DEV OVERRIDE: Original email (${session.email}) redirected to ${recipientEmail}`);
      }
    } else {
      // Send actual email via Resend
      console.log(`📧 Attempting to send email via Resend to: ${recipientEmail}`);
      const emailResult = await resend.emails.send({
        from: emailFrom,
        to: [recipientEmail],
        subject: 'Your Lunacy Blueprint Results',
        react: ResultEmail(emailProps),
      });

      console.log(`✅ Resend API response:`, emailResult);

      if (process.env.RESULTS_DEV_RECIPIENT) {
        console.log(`🔄 DEV OVERRIDE: Email for ${session.email} sent to ${recipientEmail} instead`);
      }
    }

    await prisma.result.update({
      where: { id: session.result.id },
      data: {
        emailed: true,
        emailedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}