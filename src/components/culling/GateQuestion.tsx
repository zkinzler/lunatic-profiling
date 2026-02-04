'use client';

import { useState } from 'react';

interface GateQuestionProps {
  gateNumber: number;
  totalGates: number;
  question: string;
  yesText: string;
  noText: string;
  onAnswer: (answer: boolean) => void;
  isSubmitting?: boolean;
}

export default function GateQuestion({
  gateNumber,
  totalGates,
  question,
  yesText,
  noText,
  onAnswer,
  isSubmitting,
}: GateQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const handleSelect = (answer: boolean) => {
    if (isSubmitting) return;
    setSelectedAnswer(answer);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null || isSubmitting) return;
    onAnswer(selectedAnswer);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-mono text-gray-500">
            <span>GATE {gateNumber} / {totalGates}</span>
            <span className="text-red-500">PASS REQUIRED</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
              style={{ width: `${(gateNumber / totalGates) * 100}%` }}
            />
          </div>
        </div>

        {/* Gate card */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 md:p-8 space-y-6">
          {/* Gate label */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-red-600 flex items-center justify-center">
              <span className="text-red-500 font-bold">{gateNumber}</span>
            </div>
            <span className="text-gray-500 font-mono text-sm uppercase tracking-wider">
              Evaluation Gate
            </span>
          </div>

          {/* Question */}
          <p className="text-xl md:text-2xl text-gray-100 leading-relaxed">
            {question}
          </p>

          {/* Options */}
          <div className="space-y-3 pt-4">
            {/* YES option */}
            <button
              onClick={() => handleSelect(true)}
              disabled={isSubmitting}
              className={`w-full text-left p-4 md:p-5 rounded-lg border transition-all duration-200 ${
                selectedAnswer === true
                  ? 'bg-green-950/50 border-green-600 text-green-100'
                  : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-900'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedAnswer === true
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-600'
                  }`}
                >
                  {selectedAnswer === true && (
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="font-mono text-green-500 text-sm">YES</span>
                  <p className="mt-1">{yesText}</p>
                </div>
              </div>
            </button>

            {/* NO option */}
            <button
              onClick={() => handleSelect(false)}
              disabled={isSubmitting}
              className={`w-full text-left p-4 md:p-5 rounded-lg border transition-all duration-200 ${
                selectedAnswer === false
                  ? 'bg-red-950/50 border-red-600 text-red-100'
                  : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-900'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedAnswer === false
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-600'
                  }`}
                >
                  {selectedAnswer === false && (
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="font-mono text-red-500 text-sm">NO</span>
                  <p className="mt-1">{noText}</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={selectedAnswer === null || isSubmitting}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
            selectedAnswer === null || isSubmitting
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-500'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Evaluating...
            </span>
          ) : (
            'LOCK IN ANSWER'
          )}
        </button>

        {/* Warning */}
        <p className="text-center text-gray-600 text-xs font-mono">
          All gates must be passed. Failure results in immediate culling.
        </p>
      </div>
    </div>
  );
}
