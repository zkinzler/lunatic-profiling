'use client';

import { useState, useEffect } from 'react';

interface RoastDisplayProps {
  roast: string;
  category?: string;
  onContinue: () => void;
  autoAdvanceDelay?: number; // Optional auto-advance after typing completes
}

export default function RoastDisplay({
  roast,
  category,
  onContinue,
  autoAdvanceDelay,
}: RoastDisplayProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    setShowButton(false);

    const chars = roast.split('');
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < chars.length) {
        setDisplayedText(roast.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsComplete(true);
        // Delay showing button for dramatic effect
        setTimeout(() => setShowButton(true), 300);

        // Auto-advance if configured
        if (autoAdvanceDelay) {
          setTimeout(onContinue, autoAdvanceDelay);
        }
      }
    }, 25); // Speed of typing

    return () => clearInterval(typeInterval);
  }, [roast, autoAdvanceDelay, onContinue]);

  // Skip typing animation on click
  const handleSkip = () => {
    if (!isComplete) {
      setDisplayedText(roast);
      setIsComplete(true);
      setShowButton(true);
    }
  };

  // Get category display info
  const getCategoryInfo = (cat?: string) => {
    const categoryMap: Record<string, { label: string; color: string }> = {
      VN_CS: { label: 'Brutal Honesty', color: 'from-red-600 to-orange-600' },
      CTD_DL: { label: 'Bewildered Admiration', color: 'from-purple-600 to-blue-600' },
      YO_MM: { label: 'Ecstatic Celebration', color: 'from-yellow-600 to-pink-600' },
      SO_TMZ: { label: 'Aesthetic Judgement', color: 'from-teal-600 to-cyan-600' },
      BN: { label: 'Sensible Contrast', color: 'from-gray-600 to-slate-600' },
      MIXED: { label: 'Chaos Assessment', color: 'from-purple-600 to-pink-600' },
    };
    return categoryMap[cat || 'MIXED'] || categoryMap.MIXED;
  };

  const categoryInfo = getCategoryInfo(category);

  return (
    <div
      className="glass-strong rounded-3xl p-8 md:p-10 text-center"
      onClick={handleSkip}
    >
      {/* Category badge */}
      {category && (
        <div className="mb-6">
          <span className={`inline-block px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${categoryInfo.color}`}>
            {categoryInfo.label}
          </span>
        </div>
      )}

      {/* Roast text with typewriter effect */}
      <div className="min-h-[120px] flex items-center justify-center">
        <p className="text-xl md:text-2xl text-gray-100 leading-relaxed font-medium italic">
          &ldquo;{displayedText}&rdquo;
          {!isComplete && (
            <span className="inline-block w-0.5 h-6 bg-pink-400 ml-1 animate-pulse" />
          )}
        </p>
      </div>

      {/* Continue button */}
      {showButton && !autoAdvanceDelay && (
        <div className="mt-8 animate-fadeIn">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContinue();
            }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold text-lg hover:scale-105 transition-transform glow-pink"
          >
            Continue the Chaos
          </button>
          <p className="text-gray-400 text-sm mt-3">
            Press Enter or click to continue
          </p>
        </div>
      )}

      {/* Skip hint when typing */}
      {!isComplete && (
        <p className="text-gray-500 text-xs mt-4 animate-pulse">
          Click anywhere to skip
        </p>
      )}
    </div>
  );
}
