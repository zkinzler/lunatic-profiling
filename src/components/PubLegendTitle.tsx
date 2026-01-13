'use client';

import { ARCHETYPES, type ArchetypeCode } from '@/lib/archetypes';

interface PubLegendTitleProps {
  code: ArchetypeCode;
  percentage: number;
  showDescription?: boolean;
}

export default function PubLegendTitle({
  code,
  percentage,
  showDescription = true,
}: PubLegendTitleProps) {
  const archetype = ARCHETYPES[code];

  return (
    <div className="text-center mb-8">
      {/* Archetype code badge */}
      <div className="inline-block mb-4">
        <span className="text-6xl md:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          {code}
        </span>
      </div>

      {/* Full name */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        {archetype.name}
      </h1>

      {/* Pub legend title */}
      <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 glow-pink mb-4">
        <span className="text-xl md:text-2xl font-bold text-white">
          The {archetype.pubLegend}
        </span>
      </div>

      {/* Percentage */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <span className="text-4xl font-bold gradient-text">{percentage}%</span>
        <span className="text-gray-400">match</span>
      </div>

      {/* Description */}
      {showDescription && (
        <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed italic">
          &ldquo;{archetype.description}&rdquo;
        </p>
      )}
    </div>
  );
}
