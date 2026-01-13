'use client';

import { TRAITS, type TraitCode } from '@/lib/traits';

interface TraitBarProps {
  trait: TraitCode;
  score: number;
  percentage: number;
  showDescription?: boolean;
}

export default function TraitBar({
  trait,
  score,
  percentage,
  showDescription = true,
}: TraitBarProps) {
  const traitInfo = TRAITS[trait];

  // Determine level and color
  const getLevel = (pct: number) => {
    if (pct >= 40) return { level: 'high', color: 'from-green-500 to-emerald-600', label: 'HIGH' };
    if (pct >= 15) return { level: 'medium', color: 'from-yellow-500 to-amber-600', label: 'MEDIUM' };
    return { level: 'low', color: 'from-red-500 to-rose-600', label: 'LOW' };
  };

  const { color, label, level } = getLevel(percentage);
  const description = level === 'high' ? traitInfo.highDescription : level === 'low' ? traitInfo.lowDescription : traitInfo.description;

  return (
    <div className="glass rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{trait}</span>
          <span className="text-sm text-gray-400">{traitInfo.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${color} text-white`}>
            {label}
          </span>
          <span className="text-lg font-bold text-white">{percentage}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Description */}
      {showDescription && (
        <p className="text-sm text-gray-300 italic">
          {description}
        </p>
      )}
    </div>
  );
}
