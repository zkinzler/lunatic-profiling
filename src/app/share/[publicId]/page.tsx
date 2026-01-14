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

interface PublicResult {
  // Primary archetype
  primaryArchetypeCode: ArchetypeCode;
  primaryArchetypeName: string;
  primaryArchetypePubLegend: string;
  primaryArchetypePercentage: number;
  // Secondary archetype
  secondaryArchetypeCode?: string;
  secondaryArchetypeName?: string;
  secondaryArchetypePubLegend?: string;
  secondaryArchetypePercentage?: number;
  // Hybrid
  isHybrid: boolean;
  hybridName?: string;
  hybridDescription?: string;
  hybridPercentageDiff?: number;
  // Trait percentages
  traitBSTPercentage: number;
  traitCPRPercentage: number;
  traitAEPercentage: number;
  traitBSPercentage: number;
  // Blueprint sections
  coreDriver?: string;
  superpower?: string;
  kryptonite?: string;
  signatureMove?: string;
  chaosPartner?: string;
  // Stats
  britishnessQuotient?: number;
  britishnessInterpretation?: string;
  resistanceClearanceLevel?: string;
  chaosPattern?: string;
  chaosPatternDescription?: string;
  // Visual
  asciiChart?: string;
  summary?: string;
  shareableStat?: string;
}

export default function SharePage() {
  const params = useParams();
  const publicId = params.publicId as string;
  const [result, setResult] = useState<PublicResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicResult = async () => {
      try {
        const response = await fetch(`/api/quiz/public/${publicId}`);
        if (response.ok) {
          const data = await response.json();
          setResult(data);
        } else {
          console.error('Failed to fetch public result');
        }
      } catch (error) {
        console.error('Error fetching public result:', error);
      } finally {
        setLoading(false);
      }
    };

    if (publicId) {
      fetchPublicResult();
    }
  }, [publicId]);

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
            Loading Shared Blueprint
          </h2>
          <p className="text-gray-300">Retrieving chaos profile...</p>
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
            Profile Not Found
          </h2>
          <p className="text-gray-300 mb-6">
            This profile may have been removed or the link is invalid.
          </p>
          <a href="/" className="btn-cosmic inline-block">
            Take Your Own Assessment
          </a>
        </div>
      </div>
    );
  }

  // Build trait data for display
  const traitData: { code: TraitCode; score: number; percentage: number }[] = [
    { code: 'BST', score: 0, percentage: result.traitBSTPercentage },
    { code: 'CPR', score: 0, percentage: result.traitCPRPercentage },
    { code: 'AE', score: 0, percentage: result.traitAEPercentage },
    { code: 'BS', score: 0, percentage: result.traitBSPercentage },
  ];

  return (
    <div className="min-h-screen bg-cosmic">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block px-6 py-2 glass rounded-full mb-4">
              <span className="text-gray-300">Shared Lunacy Blueprint</span>
            </div>
          </div>

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

          {/* Key Blueprint Sections */}
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
            {result.signatureMove && (
              <BlueprintSection
                icon="🎭"
                title="Signature Move"
                content={result.signatureMove}
              />
            )}
          </div>

          {/* Trait Bars */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Trait Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {traitData.map((trait) => (
                <TraitBar
                  key={trait.code}
                  trait={trait.code}
                  score={trait.score}
                  percentage={trait.percentage}
                  showDescription={false}
                />
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {result.britishnessQuotient !== undefined && (
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">Britishness Quotient</div>
                <div className="text-2xl font-bold gradient-text">{result.britishnessQuotient}</div>
              </div>
            )}
            {result.chaosPattern && (
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">Chaos Pattern</div>
                <div className="text-lg font-bold text-white uppercase">
                  {result.chaosPattern.replace('_', ' ')}
                </div>
              </div>
            )}
            {result.resistanceClearanceLevel && (
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-sm text-gray-400 mb-1">Clearance Level</div>
                <div className="text-lg font-bold text-yellow-400">
                  {result.resistanceClearanceLevel}
                </div>
              </div>
            )}
          </div>

          {/* ASCII Chart */}
          {result.asciiChart && (
            <div className="mb-8">
              <AsciiBlock content={result.asciiChart} />
            </div>
          )}

          {/* Summary */}
          {result.summary && (
            <div className="glass-strong rounded-2xl p-6 mb-8 text-center">
              <p className="text-gray-100 leading-relaxed whitespace-pre-line">
                {result.summary}
              </p>
            </div>
          )}

          {/* Shareable stat */}
          {result.shareableStat && (
            <div className="glass rounded-xl p-4 mb-8 text-center">
              <p className="text-white font-semibold italic">
                &ldquo;{result.shareableStat}&rdquo;
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="text-center">
            <a
              href="/"
              className="inline-block px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-xl hover:scale-105 transition-transform glow-pink"
            >
              Discover Your Own Lunacy Blueprint
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
