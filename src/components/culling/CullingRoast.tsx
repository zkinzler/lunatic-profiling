'use client';

import { useEffect, useState } from 'react';
import type { GhostCode } from '@/lib/culling/ghosts';

interface CullingRoastProps {
  roast: string;
  ghostCode?: GhostCode | null;
  onContinue: () => void;
}

const GHOST_COLORS: Record<GhostCode, string> = {
  CD: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/30',
  CA: 'text-orange-400 border-orange-500/50 bg-orange-950/30',
  OB: 'text-green-400 border-green-500/50 bg-green-950/30',
  DD: 'text-gray-400 border-gray-500/50 bg-gray-900/50',
};

const GHOST_NAMES: Record<GhostCode, string> = {
  CD: 'Surgical',
  CA: 'Chaos',
  OB: 'Observational',
  DD: 'Deadpan',
};

export default function CullingRoast({ roast, ghostCode, onContinue }: CullingRoastProps) {
  const [showContent, setShowContent] = useState(false);
  const [typedText, setTypedText] = useState('');

  // Fade in
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!showContent) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < roast.length) {
        setTypedText(roast.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [showContent, roast]);

  const colorClass = ghostCode ? GHOST_COLORS[ghostCode] : 'text-gray-400 border-gray-600 bg-gray-900/50';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div
        className={`max-w-2xl w-full transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {/* Roast card */}
        <div className={`border rounded-lg p-6 md:p-8 space-y-4 ${colorClass}`}>
          {/* Ghost indicator */}
          {ghostCode && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span className="text-sm font-mono uppercase tracking-wider opacity-70">
                {GHOST_NAMES[ghostCode]} Energy Detected
              </span>
            </div>
          )}

          {/* Roast text */}
          <p className="text-lg md:text-xl leading-relaxed font-mono min-h-[4rem]">
            {typedText}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full mt-6 py-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 font-bold hover:bg-gray-800 hover:border-gray-600 transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
