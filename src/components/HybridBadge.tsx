'use client';

import { ARCHETYPES, type ArchetypeCode } from '@/lib/archetypes';

interface HybridBadgeProps {
  primary: ArchetypeCode;
  secondary: ArchetypeCode;
  percentageDiff: number;
  description?: string;
}

export default function HybridBadge({
  primary,
  secondary,
  percentageDiff,
  description,
}: HybridBadgeProps) {
  const primaryArch = ARCHETYPES[primary];
  const secondaryArch = ARCHETYPES[secondary];

  return (
    <div className="glass-strong rounded-2xl p-6 border-2 border-purple-500/50 glow-purple">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="text-2xl">⚡</span>
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          HYBRID PROFILE DETECTED
        </h3>
        <span className="text-2xl">⚡</span>
      </div>

      {/* Archetype fusion display */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold gradient-text">{primary}</div>
          <div className="text-sm text-gray-400">{primaryArch.name}</div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-2xl">×</span>
          <span className="text-xs text-gray-500 mt-1">
            {percentageDiff}% gap
          </span>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold gradient-text-cosmic">{secondary}</div>
          <div className="text-sm text-gray-400">{secondaryArch.name}</div>
        </div>
      </div>

      {/* Combined pub legend */}
      <div className="text-center mb-4">
        <span className="inline-block px-4 py-2 rounded-full glass text-sm font-semibold text-gray-200">
          {primaryArch.pubLegend} + {secondaryArch.pubLegend}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-center text-gray-200 italic leading-relaxed">
          &ldquo;{description}&rdquo;
        </p>
      )}
    </div>
  );
}
