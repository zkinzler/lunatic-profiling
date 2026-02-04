'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CullingResult from '@/components/culling/CullingResult';
import CullScreen from '@/components/culling/CullScreen';
import { getEmailCtaContent } from '@/lib/culling/email-cta';
import type { GhostCode, GhostType } from '@/lib/culling/ghosts';
import type { EmailCtaContent } from '@/lib/culling/email-cta';

interface ResultData {
  sessionId: string;
  publicId: string;
  isElite: boolean;
  culled: boolean;
  culledAtGate: number | null;
  scores: Record<GhostCode, number>;
  percentages: Record<GhostCode, number>;
  dominantGhost: GhostCode | null;
  dominantGhostDetails: GhostType | null;
  resultTitle: string;
  resultDescription: string;
  comedyFingerprint: string;
  shareText: string;
  finalRoast: string | null;
  emailCtaStage: number;
}

export default function CullingResultPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ResultData | null>(null);
  const [emailCtaStage, setEmailCtaStage] = useState(0);
  const [emailCtaContent, setEmailCtaContent] = useState<EmailCtaContent>(getEmailCtaContent(0));
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [emailDismissed, setEmailDismissed] = useState(false);

  // Fetch result
  const fetchResult = useCallback(async () => {
    try {
      const response = await fetch(`/api/culling/result/${sessionId}`);
      if (!response.ok) {
        if (response.status === 400) {
          // Quiz not graded yet - redirect to quiz
          router.push(`/culling/quiz/${sessionId}`);
          return;
        }
        throw new Error('Failed to fetch result');
      }
      const data = await response.json();
      setResult(data);
      setEmailCtaStage(data.emailCtaStage || 0);
      setEmailCtaContent(getEmailCtaContent(data.emailCtaStage || 0));

      // Check if already dismissed (stage 2 means they said no on final)
      if (data.emailCtaStage === 2 && !data.hasEmail) {
        // They might have dismissed - check by trying to get session
        // For now, we'll just show the CTA
      }
    } catch (error) {
      console.error('Error fetching result:', error);
      alert('Failed to load results. Please try again.');
      router.push('/culling');
    } finally {
      setLoading(false);
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (!sessionId) {
      router.push('/culling');
      return;
    }
    fetchResult();
  }, [sessionId, router, fetchResult]);

  // Handle email CTA action
  const handleEmailAction = async (action: 'yes' | 'no', email?: string) => {
    setIsEmailSubmitting(true);
    try {
      const response = await fetch('/api/culling/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action,
          email,
        }),
      });

      const data = await response.json();

      if (data.emailCaptured) {
        // Email was captured
        setEmailCtaStage(3);
        setEmailCtaContent(getEmailCtaContent(3));
      } else if (data.dismissed) {
        // User dismissed after final stage
        setEmailDismissed(true);
      } else {
        // Escalate to next stage
        setEmailCtaStage(data.newStage);
        setEmailCtaContent(data.content || getEmailCtaContent(data.newStage));
      }
    } catch (error) {
      console.error('Error submitting email action:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-mono">Loading results...</p>
        </div>
      </div>
    );
  }

  // No result
  if (!result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-500 font-mono">No results found.</p>
          <a
            href="/culling"
            className="inline-block px-6 py-3 bg-red-600 rounded-lg text-white font-bold hover:bg-red-500"
          >
            Start The Culling
          </a>
        </div>
      </div>
    );
  }

  // If culled at gates, show cull screen
  if (result.culled && result.culledAtGate) {
    return (
      <CullScreen
        culledAtGate={result.culledAtGate}
        cullReason={result.resultDescription}
        publicId={result.publicId}
      />
    );
  }

  // Show result
  return (
    <CullingResult
      isElite={result.isElite}
      dominantGhost={result.dominantGhost}
      dominantGhostDetails={result.dominantGhostDetails}
      scores={result.scores}
      percentages={result.percentages}
      resultTitle={result.resultTitle}
      resultDescription={result.resultDescription}
      comedyFingerprint={result.comedyFingerprint}
      shareText={result.shareText}
      finalRoast={result.finalRoast}
      publicId={result.publicId}
      emailCtaStage={emailCtaStage}
      emailCtaContent={emailCtaContent}
      onEmailAction={handleEmailAction}
      isEmailSubmitting={isEmailSubmitting}
      emailDismissed={emailDismissed}
    />
  );
}
