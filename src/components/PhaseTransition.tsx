'use client';

import { useState, useEffect } from 'react';
import { getPhaseName, getPhaseDescription } from '@/lib/transitions';
import type { PhaseTransitionResult, ArchetypeStanding, TraitHighlight } from '@/lib/transitions';

interface PhaseTransitionProps {
  transition: PhaseTransitionResult;
  onContinue: () => void;
}

export default function PhaseTransition({
  transition,
  onContinue,
}: PhaseTransitionProps) {
  const [stage, setStage] = useState<'intro' | 'archetypes' | 'traits' | 'message' | 'ready'>('intro');
  const [visibleArchetypes, setVisibleArchetypes] = useState(0);
  const [visibleTraits, setVisibleTraits] = useState(0);

  // Animate through stages
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Stage 1: Intro (1.5s)
    timers.push(setTimeout(() => setStage('archetypes'), 1500));

    // Stage 2: Reveal archetypes one by one
    transition.topArchetypes.forEach((_, index) => {
      timers.push(setTimeout(() => {
        setVisibleArchetypes(index + 1);
      }, 2000 + (index * 600)));
    });

    // Stage 3: Traits (after archetypes)
    timers.push(setTimeout(() => setStage('traits'), 2000 + (transition.topArchetypes.length * 600) + 500));

    // Reveal traits one by one
    const traitDelay = 2000 + (transition.topArchetypes.length * 600) + 800;
    transition.emergingTraits.slice(0, 2).forEach((_, index) => {
      timers.push(setTimeout(() => {
        setVisibleTraits(index + 1);
      }, traitDelay + (index * 500)));
    });

    // Stage 4: Message
    const messageDelay = traitDelay + (Math.min(transition.emergingTraits.length, 2) * 500) + 500;
    timers.push(setTimeout(() => setStage('message'), messageDelay));

    // Stage 5: Ready
    timers.push(setTimeout(() => setStage('ready'), messageDelay + 2000));

    return () => timers.forEach(clearTimeout);
  }, [transition]);

  const renderMovementIndicator = (movement?: 'up' | 'down' | 'stable') => {
    if (!movement || transition.fromPhase === 1) return null;

    const indicators = {
      up: <span className="text-green-400 ml-2">↑</span>,
      down: <span className="text-red-400 ml-2">↓</span>,
      stable: <span className="text-gray-400 ml-2">→</span>,
    };
    return indicators[movement];
  };

  const renderArchetypeCard = (arch: ArchetypeStanding, index: number) => {
    const isVisible = index < visibleArchetypes;
    const colors = ['from-yellow-500 to-amber-600', 'from-gray-300 to-gray-400', 'from-amber-600 to-orange-700'];

    return (
      <div
        key={arch.code}
        className={`transform transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className={`glass-strong rounded-2xl p-6 border-2 ${
          index === 0 ? 'border-yellow-400 glow-gold' : 'border-white/20'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-bold bg-gradient-to-r ${colors[index]} bg-clip-text text-transparent`}>
              #{arch.position}
            </span>
            <span className="text-2xl font-bold text-white">
              {arch.percentage}%
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            {arch.name}
            {renderMovementIndicator(arch.movement)}
          </h3>
          <p className="text-sm text-gray-400">{arch.pubLegend}</p>
        </div>
      </div>
    );
  };

  const renderTraitIndicator = (trait: TraitHighlight, index: number) => {
    const isVisible = index < visibleTraits;
    const levelColors = {
      high: 'from-green-500 to-emerald-600',
      medium: 'from-yellow-500 to-amber-600',
      low: 'from-red-500 to-rose-600',
    };

    return (
      <div
        key={trait.trait}
        className={`transform transition-all duration-500 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
        }`}
      >
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">{trait.name}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${levelColors[trait.level]} text-white`}>
              {trait.level.toUpperCase()}
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${levelColors[trait.level]} rounded-full transition-all duration-1000`}
              style={{ width: isVisible ? `${trait.percentage}%` : '0%' }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 italic">
            {trait.interpretation}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg overflow-y-auto py-8">
      <div className="max-w-3xl w-full mx-4">
        {/* Phase header */}
        <div className={`text-center mb-8 transform transition-all duration-700 ${
          stage !== 'intro' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="inline-block px-6 py-2 rounded-full glass-strong mb-4">
            <span className="text-sm text-gray-400">Phase {transition.fromPhase} Complete</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text-cosmic mb-2">
            Entering {getPhaseName(transition.toPhase)}
          </h1>
          <p className="text-gray-400">
            {getPhaseDescription(transition.toPhase)}
          </p>
        </div>

        {/* Intro stage */}
        {stage === 'intro' && (
          <div className="text-center animate-pulse">
            <div className="text-6xl mb-4">🔮</div>
            <p className="text-xl text-gray-300">Analyzing your chaos signature...</p>
          </div>
        )}

        {/* Archetypes reveal */}
        {(stage === 'archetypes' || stage === 'traits' || stage === 'message' || stage === 'ready') && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-center text-gray-300 mb-4">
              {transition.fromPhase === 1 ? 'Early Profile Detection' : 'Current Standings'}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {transition.topArchetypes.map((arch, i) => renderArchetypeCard(arch, i))}
            </div>
          </div>
        )}

        {/* Traits reveal */}
        {(stage === 'traits' || stage === 'message' || stage === 'ready') && transition.emergingTraits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-center text-gray-300 mb-4">
              {transition.fromPhase === 1 ? 'Emerging Traits' : 'Trait Analysis'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transition.emergingTraits.slice(0, 2).map((trait, i) => renderTraitIndicator(trait, i))}
            </div>
          </div>
        )}

        {/* Damage profile (Phase 2 only) */}
        {(stage === 'message' || stage === 'ready') && transition.damageProfile && (
          <div className="mb-8 glass-strong rounded-2xl p-6 border border-red-500/30">
            <h3 className="text-lg font-semibold text-red-400 mb-3">Damage Profile</h3>
            <p className="text-gray-200 whitespace-pre-line">{transition.damageProfile}</p>
          </div>
        )}

        {/* Transition message */}
        {(stage === 'message' || stage === 'ready') && (
          <div className={`glass-strong rounded-2xl p-8 text-center mb-8 border border-pink-500/30 transform transition-all duration-700 ${
            stage === 'message' || stage === 'ready' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <p className="text-xl text-gray-100 leading-relaxed whitespace-pre-line">
              {transition.transitionMessage}
            </p>
            {transition.chaosWarning && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-yellow-400 text-sm font-semibold">⚠️ {transition.chaosWarning}</p>
              </div>
            )}
            {transition.secretMessage && (
              <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <p className="text-purple-400 text-sm italic">🔮 {transition.secretMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Continue button */}
        {stage === 'ready' && (
          <div className="text-center animate-fadeIn">
            <button
              onClick={onContinue}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-xl hover:scale-105 transition-transform glow-pink"
            >
              Enter {getPhaseName(transition.toPhase)}
            </button>
            <p className="text-gray-500 text-sm mt-4">
              {8 - (transition.toPhase === 2 ? 0 : 8)} questions until {transition.toPhase === 2 ? 'the next revelation' : 'your final form'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
