'use client';

import { getPhaseName } from '@/lib/transitions';

interface PhaseProgressProps {
  currentPhase: 1 | 2 | 3;
  currentQuestion: number;
  totalQuestions?: number;
}

const PHASE_QUESTIONS = {
  1: { start: 1, end: 8, multiplier: '1x' },
  2: { start: 9, end: 16, multiplier: '2x' },
  3: { start: 17, end: 24, multiplier: '3x' },
};

export default function PhaseProgress({
  currentPhase,
  currentQuestion,
  totalQuestions = 24,
}: PhaseProgressProps) {
  const phases = [1, 2, 3] as const;

  // Calculate overall percentage
  const overallPercentage = (currentQuestion / totalQuestions) * 100;

  // Calculate phase-specific progress
  const phaseInfo = PHASE_QUESTIONS[currentPhase];
  const questionsInPhase = phaseInfo.end - phaseInfo.start + 1;
  const questionInPhase = currentQuestion - phaseInfo.start + 1;
  const phasePercentage = Math.min((questionInPhase / questionsInPhase) * 100, 100);

  return (
    <div className="w-full glass-strong rounded-2xl p-6">
      {/* Phase indicator tabs */}
      <div className="flex mb-4 gap-2">
        {phases.map((phase) => {
          const isActive = phase === currentPhase;
          const isComplete = phase < currentPhase;
          const phaseData = PHASE_QUESTIONS[phase];

          return (
            <div
              key={phase}
              className={`flex-1 p-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'glass-strong border-2 border-pink-400 glow-pink'
                  : isComplete
                    ? 'glass border border-green-400/50'
                    : 'glass border border-white/10 opacity-50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-semibold ${
                  isActive ? 'text-pink-400' : isComplete ? 'text-green-400' : 'text-gray-400'
                }`}>
                  Phase {phase}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : isComplete
                      ? 'bg-green-600/30 text-green-400'
                      : 'bg-white/10 text-gray-500'
                }`}>
                  {phaseData.multiplier}
                </span>
              </div>
              <div className={`text-sm font-medium ${
                isActive ? 'text-white' : isComplete ? 'text-green-300' : 'text-gray-500'
              }`}>
                {getPhaseName(phase)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Q{phaseData.start}-{phaseData.end}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall progress bar */}
      <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full transition-all duration-500 ease-out glow-pink"
          style={{ width: `${overallPercentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>

        {/* Phase dividers */}
        <div className="absolute top-0 left-[33.33%] w-0.5 h-full bg-white/30" />
        <div className="absolute top-0 left-[66.66%] w-0.5 h-full bg-white/30" />
      </div>

      {/* Status line */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold gradient-text">
            Question {currentQuestion}
          </span>
          <span className="text-xs text-gray-400">of {totalQuestions}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {Math.round(phasePercentage)}% through {getPhaseName(currentPhase)}
          </span>
          <span className="text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full">
            {PHASE_QUESTIONS[currentPhase].multiplier} Points
          </span>
        </div>
      </div>
    </div>
  );
}
