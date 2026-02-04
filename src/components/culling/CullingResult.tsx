'use client';

import { useEffect, useState } from 'react';
import GhostTypeBar from './GhostTypeBar';
import EmailCTA from './EmailCTA';
import type { GhostCode, GhostType } from '@/lib/culling/ghosts';
import type { EmailCtaContent } from '@/lib/culling/email-cta';

interface CullingResultProps {
  isElite: boolean;
  dominantGhost: GhostCode | null;
  dominantGhostDetails: GhostType | null;
  scores: Record<GhostCode, number>;
  percentages: Record<GhostCode, number>;
  resultTitle: string;
  resultDescription: string;
  comedyFingerprint: string;
  shareText: string;
  finalRoast: string | null;
  publicId: string;
  emailCtaStage: number;
  emailCtaContent: EmailCtaContent;
  onEmailAction: (action: 'yes' | 'no', email?: string) => void;
  isEmailSubmitting?: boolean;
  emailDismissed?: boolean;
}

export default function CullingResult({
  isElite,
  dominantGhost,
  dominantGhostDetails,
  scores,
  percentages,
  resultTitle,
  resultDescription,
  comedyFingerprint,
  shareText,
  finalRoast,
  publicId,
  emailCtaStage,
  emailCtaContent,
  onEmailAction,
  isEmailSubmitting,
  emailDismissed,
}: CullingResultProps) {
  const [showContent, setShowContent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 300);
    const timer2 = setTimeout(() => setShowDetails(true), 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/culling/share/${publicId}`
    : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Culling Results',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Copied to clipboard!');
    }
  };

  const GHOST_CODES: GhostCode[] = ['CD', 'CA', 'OB', 'DD'];

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div
          className={`text-center space-y-4 transition-all duration-700 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Status badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isElite
                ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 text-purple-300'
                : 'bg-red-950/50 border border-red-500/50 text-red-400'
            }`}
          >
            {isElite ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-bold">THE 4%</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-bold">THE 96%</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1
            className={`text-3xl md:text-5xl font-bold ${
              isElite
                ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent'
                : 'text-red-500'
            }`}
          >
            {resultTitle}
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
            {resultDescription}
          </p>
        </div>

        {/* Ghost details */}
        {dominantGhostDetails && (
          <div
            className={`transition-all duration-700 delay-300 ${
              showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  Your Ghost Type: {dominantGhostDetails.fullTitle}
                </h3>
              </div>
              <p className="text-gray-400">{dominantGhostDetails.description}</p>
              <div className="flex flex-wrap gap-2">
                {dominantGhostDetails.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1 bg-gray-900 border border-gray-700 rounded-full text-sm text-gray-300"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Score breakdown */}
        <div
          className={`space-y-4 transition-all duration-700 delay-500 ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-lg font-bold text-white">Ghost Classification Breakdown</h3>
          {GHOST_CODES.map((code) => (
            <GhostTypeBar
              key={code}
              code={code}
              name={code}
              score={scores[code]}
              percentage={percentages[code]}
              isDominant={code === dominantGhost}
            />
          ))}
        </div>

        {/* Comedy fingerprint */}
        <div
          className={`bg-gray-950 border border-gray-800 rounded-lg p-6 transition-all duration-700 delay-700 ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-sm font-mono text-gray-500 mb-2">COMEDY FINGERPRINT</h3>
          <p className="text-lg font-mono text-white break-all">{comedyFingerprint}</p>
        </div>

        {/* Final roast */}
        {finalRoast && (
          <div
            className={`bg-gradient-to-br ${
              isElite ? 'from-purple-950/50 to-pink-950/50 border-purple-500/30' : 'from-red-950/50 to-gray-950 border-red-500/30'
            } border rounded-lg p-6 transition-all duration-700 delay-[900ms] ${
              showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h3 className="text-sm font-mono text-gray-500 mb-2">FINAL ASSESSMENT</h3>
            <p className="text-gray-300 leading-relaxed italic">&ldquo;{finalRoast}&rdquo;</p>
          </div>
        )}

        {/* Email CTA */}
        {emailCtaStage < 3 && !emailDismissed && (
          <div
            className={`transition-all duration-700 delay-[1100ms] ${
              showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <EmailCTA
              content={emailCtaContent}
              onSubmit={onEmailAction}
              isSubmitting={isEmailSubmitting}
            />
          </div>
        )}

        {/* Email captured confirmation */}
        {emailCtaStage === 3 && (
          <div
            className={`transition-all duration-700 delay-[1100ms] ${
              showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <EmailCTA
              content={emailCtaContent}
              onSubmit={onEmailAction}
              isSubmitting={false}
            />
          </div>
        )}

        {/* Share button */}
        <div
          className={`space-y-3 transition-all duration-700 delay-[1300ms] ${
            showDetails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <button
            onClick={handleShare}
            className={`w-full py-4 rounded-lg font-bold transition-all ${
              isElite
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                : 'bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            {isElite ? 'Share Your Elite Status' : 'Share Your Shame'}
          </button>

          <a
            href="/culling"
            className="block w-full py-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 font-bold text-center hover:bg-gray-800 transition-all"
          >
            Take The Culling Again
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs font-mono pt-4">
          The Culling has classified your comedic instincts. Share responsibly.
        </p>
      </div>
    </div>
  );
}
