'use client';

import type { GhostCode } from '@/lib/culling/ghosts';

interface GhostTypeBarProps {
  code: GhostCode;
  name: string;
  score: number;
  maxScore?: number;
  percentage?: number;
  isDominant?: boolean;
}

const GHOST_STYLES: Record<GhostCode, { gradient: string; glow: string; text: string }> = {
  CD: {
    gradient: 'from-cyan-600 to-blue-600',
    glow: 'shadow-cyan-500/50',
    text: 'text-cyan-400',
  },
  CA: {
    gradient: 'from-orange-600 to-red-600',
    glow: 'shadow-orange-500/50',
    text: 'text-orange-400',
  },
  OB: {
    gradient: 'from-green-600 to-emerald-600',
    glow: 'shadow-green-500/50',
    text: 'text-green-400',
  },
  DD: {
    gradient: 'from-gray-500 to-gray-600',
    glow: 'shadow-gray-500/50',
    text: 'text-gray-400',
  },
};

const GHOST_FULL_NAMES: Record<GhostCode, string> = {
  CD: 'Surgical',
  CA: 'Chaos',
  OB: 'Observational',
  DD: 'Deadpan',
};

export default function GhostTypeBar({
  code,
  score,
  maxScore = 10,
  percentage,
  isDominant = false,
}: GhostTypeBarProps) {
  const style = GHOST_STYLES[code];
  const displayPercentage = percentage ?? Math.round((score / maxScore) * 100);
  const barWidth = Math.min(100, displayPercentage);

  return (
    <div className={`p-4 rounded-lg border ${isDominant ? 'border-white/30 bg-white/5' : 'border-gray-800 bg-gray-900/50'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${style.text}`}>{GHOST_FULL_NAMES[code]}</span>
          {isDominant && (
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-white font-mono">
              DOMINANT
            </span>
          )}
        </div>
        <span className="font-mono text-gray-400">
          {score}/{maxScore}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${style.gradient} transition-all duration-1000 ease-out ${
            isDominant ? `shadow-lg ${style.glow}` : ''
          }`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {/* Percentage */}
      <div className="flex justify-end mt-1">
        <span className={`text-sm font-mono ${style.text}`}>{displayPercentage}%</span>
      </div>
    </div>
  );
}
