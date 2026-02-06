'use client';

import { useState, useEffect, useRef } from 'react';

interface CullingIntroProps {
  onStart: () => void;
  isLoading?: boolean;
}

export default function CullingIntro({ onStart, isLoading }: CullingIntroProps) {
  const [inputValue, setInputValue] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.toUpperCase().trim() === 'START') {
      onStart();
    } else {
      setHasError(true);
      setInputValue('');
      setTimeout(() => setHasError(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <p className="text-yellow-500 text-2xl">⚠️</p>
          <h1 className="text-4xl md:text-6xl font-bold text-red-600 tracking-tight">
            THE CULLING
          </h1>
          <p className="text-gray-400 text-lg tracking-wide uppercase">
            UK Comedy Autopsy
          </p>
          <p className="text-yellow-500 text-2xl">⚠️</p>
        </div>

        {/* Intro content */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 md:p-8 space-y-6">
          <p className="text-gray-300 text-lg leading-relaxed">
            A quiz designed to assess your sense of humour, and whether you still have one given the current state of affairs in the UK.
          </p>

          <div className="border-t border-gray-800 pt-6 space-y-4">
            <p className="text-gray-400">
              But first, you have to qualify.
            </p>
            <p className="text-gray-300">
              <span className="text-red-500 font-bold">5 gates.</span> 96% fail them. They&apos;re not smart enough, cynical enough, or not damaged enough mentally to even START the real test.
            </p>
            <p className="text-gray-300">
              If you pass the gates, you get to take the actual quiz: <span className="text-purple-400 font-bold">10 questions</span> that determine your UK sense of humour archetype.
            </p>
            <p className="text-gray-300">
              Then, only <span className="text-green-500 font-bold">4%</span> of THOSE survivors make the final cut.
            </p>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-200 text-lg">
              Dare you take it? Are you brave enough?
            </p>
            <p className="text-gray-500 mt-2">
              Or will you fail at the first hurdle like most people?
            </p>
          </div>
        </div>

        {/* Input prompt */}
        <div className="text-center">
          <p className="text-yellow-500 font-mono mb-4">
            Type START or click below — if you dare
          </p>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div
            className={`flex items-center bg-gray-950 border ${
              hasError ? 'border-red-500 animate-shake' : 'border-gray-700'
            } rounded-lg overflow-hidden transition-colors`}
          >
            <span className="text-green-500 px-4 font-mono">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent text-white font-mono py-4 pr-4 outline-none uppercase tracking-wider"
              placeholder=""
              disabled={isLoading}
              autoComplete="off"
              spellCheck={false}
            />
            <span
              className={`text-white font-mono pr-4 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            >
              _
            </span>
          </div>

          {hasError && (
            <p className="absolute -bottom-6 left-0 text-red-500 text-sm font-mono">
              Invalid command. Type START to proceed.
            </p>
          )}

          {isLoading && (
            <p className="absolute -bottom-6 left-0 text-yellow-500 text-sm font-mono animate-pulse">
              Initializing protocol...
            </p>
          )}
        </form>

        {/* Click to start button */}
        <button
          onClick={onStart}
          disabled={isLoading}
          className="w-full py-4 border-2 border-red-600 bg-transparent text-red-500 font-mono font-bold uppercase tracking-widest rounded-lg hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Initializing protocol...' : '[ START THE CULLING ]'}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs font-mono">
          Proceed at your own risk. Your ego may not survive.
        </p>
      </div>

      {/* Add shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
