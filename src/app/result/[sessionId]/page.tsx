'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PubLegendTitle from '@/components/PubLegendTitle';
import HybridBadge from '@/components/HybridBadge';
import BlueprintSection from '@/components/BlueprintSection';
import TraitBar from '@/components/TraitBar';
import AsciiBlock from '@/components/AsciiBlock';
import type { TraitCode } from '@/lib/traits';
import type { ArchetypeCode } from '@/lib/archetypes';

interface BlueprintResult {
  id: string;
  // Primary archetype
  primaryArchetypeCode: ArchetypeCode;
  primaryArchetypeName: string;
  primaryArchetypePubLegend: string;
  primaryArchetypeScore: number;
  primaryArchetypePercentage: number;
  // Secondary archetype
  secondaryArchetypeCode?: string;
  secondaryArchetypeName?: string;
  secondaryArchetypePubLegend?: string;
  secondaryArchetypeScore?: number;
  secondaryArchetypePercentage?: number;
  // Hybrid profile
  isHybrid: boolean;
  hybridName?: string;
  hybridDescription?: string;
  hybridPercentageDiff?: number;
  // Trait scores
  traitBST: number;
  traitCPR: number;
  traitAE: number;
  traitBS: number;
  // Trait percentages
  traitBSTPercentage: number;
  traitCPRPercentage: number;
  traitAEPercentage: number;
  traitBSPercentage: number;
  // Blueprint sections
  coreDriver?: string;
  superpower?: string;
  kryptonite?: string;
  repressedShadow?: string;
  internalConflict?: string;
  finalForm?: string;
  signatureMove?: string;
  chaosPartner?: string;
  // Computed stats
  britishnessQuotient?: number;
  britishnessInterpretation?: string;
  resistanceClearanceLevel?: string;
  resistanceClearancePoints: number;
  chaosPattern?: string;
  chaosPatternDescription?: string;
  // Visual
  asciiChart?: string;
  summary?: string;
  shareableStat?: string;
  // Session
  session: {
    publicId: string;
  };
}

export default function ResultPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [result, setResult] = useState<BlueprintResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/quiz/result/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setResult(data);
        } else {
          console.error('Failed to fetch result');
        }
      } catch {
        console.error('Error fetching result');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResult();
    }
  }, [sessionId]);

  const handleEmailResults = async () => {
    try {
      const response = await fetch('/api/quiz/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch {
      alert('Failed to send email. Please try again.');
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/share/${result?.session.publicId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyStat = () => {
    if (result?.shareableStat) {
      navigator.clipboard.writeText(result.shareableStat);
      alert('Copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center">
        <div className="glass-strong rounded-3xl p-12 text-center animate-float">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-glow-pulse flex items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold gradient-text-cosmic mb-2">
            Loading Your Lunacy Blueprint
          </h2>
          <p className="text-gray-300">Retrieving your chaos profile...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center p-4">
        <div className="glass-strong rounded-3xl p-12 text-center max-w-lg">
          <div className="text-6xl mb-6">🌌</div>
          <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">
            Blueprint Not Found
          </h2>
          <p className="text-gray-300 mb-6">
            Your results seem to have vanished into the void.
          </p>
          <a href="/" className="btn-cosmic inline-block">
            Start Over
          </a>
        </div>
      </div>
    );
  }

  // Build trait data for TraitBar components
  const traitData: { code: TraitCode; score: number; percentage: number }[] = [
    { code: 'BST', score: result.traitBST, percentage: result.traitBSTPercentage },
    { code: 'CPR', score: result.traitCPR, percentage: result.traitCPRPercentage },
    { code: 'AE', score: result.traitAE, percentage: result.traitAEPercentage },
    { code: 'BS', score: result.traitBS, percentage: result.traitBSPercentage },
  ];

  return (
    <div className="min-h-screen bg-cosmic">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Primary Archetype Title */}
          <PubLegendTitle
            code={result.primaryArchetypeCode}
            percentage={result.primaryArchetypePercentage}
          />

          {/* Hybrid Badge (if applicable) */}
          {result.isHybrid && result.secondaryArchetypeCode && (
            <div className="mb-8">
              <HybridBadge
                primary={result.primaryArchetypeCode}
                secondary={result.secondaryArchetypeCode as ArchetypeCode}
                percentageDiff={result.hybridPercentageDiff || 0}
                description={result.hybridDescription}
              />
            </div>
          )}

          {/* Blueprint Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {result.coreDriver && (
              <BlueprintSection
                icon="🎯"
                title="Core Driver"
                content={result.coreDriver}
                variant="highlight"
              />
            )}
            {result.superpower && (
              <BlueprintSection
                icon="⚡"
                title="Superpower"
                content={result.superpower}
                variant="success"
              />
            )}
            {result.kryptonite && (
              <BlueprintSection
                icon="💀"
                title="Kryptonite"
                content={result.kryptonite}
                variant="warning"
              />
            )}
            {result.repressedShadow && (
              <BlueprintSection
                icon="🌑"
                title="Repressed Shadow"
                content={result.repressedShadow}
              />
            )}
            {result.internalConflict && (
              <BlueprintSection
                icon="⚔️"
                title="Internal Conflict"
                content={result.internalConflict}
              />
            )}
            {result.signatureMove && (
              <BlueprintSection
                icon="🎭"
                title="Signature Move"
                content={result.signatureMove}
                variant="highlight"
              />
            )}
            {result.finalForm && (
              <BlueprintSection
                icon="🦋"
                title="Final Form"
                content={result.finalForm}
                size="large"
              />
            )}
            {result.chaosPartner && (
              <BlueprintSection
                icon="🤝"
                title="Ideal Chaos Partner"
                content={result.chaosPartner}
                size="large"
              />
            )}
          </div>

          {/* Trait Scores */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Your Trait Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {traitData.map((trait) => (
                <TraitBar
                  key={trait.code}
                  trait={trait.code}
                  score={trait.score}
                  percentage={trait.percentage}
                />
              ))}
            </div>
          </div>

          {/* Britishness Quotient */}
          {result.britishnessQuotient !== undefined && (
            <div className="glass-strong rounded-2xl p-6 mb-8 text-center border border-blue-500/30">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                Britishness Quotient
              </h3>
              <div className="text-5xl font-bold gradient-text mb-3">
                {result.britishnessQuotient}
              </div>
              <p className="text-gray-200 italic">
                {result.britishnessInterpretation}
              </p>
            </div>
          )}

          {/* Chaos Pattern & Clearance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {result.chaosPattern && (
              <div className="glass-strong rounded-2xl p-6 border border-purple-500/30">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">
                  Chaos Pattern
                </h3>
                <div className="text-2xl font-bold text-white mb-2 uppercase">
                  {result.chaosPattern.replace('_', ' ')}
                </div>
                <p className="text-gray-300 text-sm">
                  {result.chaosPatternDescription}
                </p>
              </div>
            )}
            {result.resistanceClearanceLevel && (
              <div className="glass-strong rounded-2xl p-6 border border-yellow-500/30">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  Resistance Clearance
                </h3>
                <div className="text-xl font-bold text-white mb-2">
                  {result.resistanceClearanceLevel}
                </div>
                <p className="text-gray-300 text-sm">
                  Chaos points: {result.resistanceClearancePoints}
                </p>
              </div>
            )}
          </div>

          {/* ASCII Chart */}
          {result.asciiChart && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                Archetype Damage Report
              </h2>
              <AsciiBlock content={result.asciiChart} />
            </div>
          )}

          {/* Summary */}
          {result.summary && (
            <div className="glass-strong rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold gradient-text mb-4 text-center">
                Your Lunacy Summary
              </h2>
              <p className="text-gray-100 leading-relaxed whitespace-pre-line text-center">
                {result.summary}
              </p>
            </div>
          )}

          {/* Shareable Stat */}
          {result.shareableStat && (
            <div className="glass rounded-xl p-4 mb-8 text-center cursor-pointer hover:glass-strong transition-all"
                 onClick={handleCopyStat}>
              <p className="text-gray-300 text-sm mb-2">Click to copy your shareable stat:</p>
              <p className="text-white font-semibold italic">
                &ldquo;{result.shareableStat}&rdquo;
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleEmailResults}
              disabled={emailSent}
              className="px-8 py-4 glass rounded-xl font-semibold text-white hover:glass-strong transition-all disabled:opacity-50"
            >
              {emailSent ? '✓ Email Sent!' : '📧 Email Results'}
            </button>
            <button
              onClick={handleCopyLink}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:scale-105 transition-transform glow-pink"
            >
              {copied ? '✓ Copied!' : '🔗 Copy Share Link'}
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Share your chaos with the world
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
