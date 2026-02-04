'use client';

import { useEffect, useState } from 'react';

interface CullScreenProps {
  culledAtGate: number;
  cullReason: string;
  publicId: string;
  shareText?: string;
}

export default function CullScreen({ culledAtGate, cullReason, publicId, shareText: customShareText }: CullScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [glitchText, setGlitchText] = useState('CULLED');

  // Dramatic entrance
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Glitch effect
  useEffect(() => {
    const glitchChars = 'CULLED'.split('');
    const randomChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

    let interval: NodeJS.Timeout;
    let count = 0;

    const doGlitch = () => {
      if (count > 10) {
        setGlitchText('CULLED');
        return;
      }

      const newText = glitchChars
        .map((char) => {
          if (Math.random() > 0.7) {
            return randomChars[Math.floor(Math.random() * randomChars.length)];
          }
          return char;
        })
        .join('');

      setGlitchText(newText);
      count++;
      interval = setTimeout(doGlitch, 100);
    };

    interval = setTimeout(doGlitch, 1000);
    return () => clearTimeout(interval);
  }, []);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/culling/share/${publicId}`
    : '';

  const shareText = customShareText || `I was CULLED at Gate ${culledAtGate} of The Culling. I didn't have what it takes. Do you? Take the quiz:`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Culling',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-black" />

      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)',
        }}
      />

      <div
        className={`relative max-w-2xl w-full space-y-8 transition-all duration-1000 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Main cull message */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-red-600 tracking-tighter animate-pulse">
            {glitchText}
          </h1>
          <p className="text-gray-500 font-mono text-lg">
            Gate {culledAtGate} has rejected you.
          </p>
        </div>

        {/* Reason card */}
        <div className="bg-gray-950 border border-red-900/50 rounded-lg p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-red-500 font-mono text-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            TERMINATION REASON
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">{cullReason}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <div className="text-3xl font-bold text-red-500">{culledAtGate}</div>
            <div className="text-gray-500 text-sm font-mono">Gate Failed</div>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-500">96%</div>
            <div className="text-gray-500 text-sm font-mono">Culled Rate</div>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
            <div className="text-3xl font-bold text-gray-500">0</div>
            <div className="text-gray-500 text-sm font-mono">Questions</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 font-bold hover:bg-gray-800 hover:border-gray-600 transition-all"
          >
            Share Your Shame
          </button>
          <a
            href="/culling"
            className="block w-full py-4 bg-red-600 rounded-lg text-white font-bold text-center hover:bg-red-500 transition-all"
          >
            Try Again (You Won&apos;t)
          </a>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs font-mono">
          The Culling has spoken. Your comedic instincts have been evaluated and found wanting.
        </p>
      </div>
    </div>
  );
}
