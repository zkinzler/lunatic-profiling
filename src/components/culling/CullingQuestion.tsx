'use client';

import { useState } from 'react';
import type { AnswerChoice } from '@/lib/culling/questions';

interface CullingQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  title?: string;
  question: string;
  answers: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  onAnswer: (answer: AnswerChoice) => void;
  isSubmitting?: boolean;
}

const ANSWER_KEYS: AnswerChoice[] = ['A', 'B', 'C', 'D'];

export default function CullingQuestion({
  questionNumber,
  totalQuestions,
  title,
  question,
  answers,
  onAnswer,
  isSubmitting,
}: CullingQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerChoice | null>(null);

  const handleSelect = (answer: AnswerChoice) => {
    if (isSubmitting) return;
    setSelectedAnswer(answer);
  };

  const handleConfirm = () => {
    if (!selectedAnswer || isSubmitting) return;
    onAnswer(selectedAnswer);
    setSelectedAnswer(null); // Reset for next question
  };

  const progressPercentage = ((questionNumber - 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-mono text-gray-500">
            <span>QUESTION {questionNumber} / {totalQuestions}</span>
            <span className="text-purple-500">MAIN EVALUATION</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 md:p-8 space-y-6">
          {/* Question number badge and title */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/50 flex items-center justify-center">
                <span className="text-purple-400 font-bold">{questionNumber}</span>
              </div>
              <span className="text-gray-500 font-mono text-sm uppercase tracking-wider">
                Question {questionNumber}
              </span>
            </div>
            {title && (
              <h2 className="text-red-500 font-mono text-sm uppercase tracking-wider pl-13">
                {title}
              </h2>
            )}
          </div>

          {/* Question */}
          <p className="text-xl md:text-2xl text-gray-100 leading-relaxed">
            {question}
          </p>

          {/* Options */}
          <div className="space-y-3 pt-4">
            {ANSWER_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                disabled={isSubmitting}
                className={`w-full text-left p-4 md:p-5 rounded-lg border transition-all duration-200 ${
                  selectedAnswer === key
                    ? 'bg-purple-950/50 border-purple-500 text-purple-100'
                    : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-900'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold transition-colors ${
                      selectedAnswer === key
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {key}
                  </div>
                  <span className="pt-1">{answers[key]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={!selectedAnswer || isSubmitting}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
            !selectedAnswer || isSubmitting
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
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
              Classifying...
            </span>
          ) : (
            'LOCK IN ANSWER'
          )}
        </button>

        {/* Instructions */}
        <p className="text-center text-gray-600 text-xs font-mono">
          Choose the answer that best reflects your comedic instincts. There are no wrong answers. Only revealing ones.
        </p>
      </div>
    </div>
  );
}
