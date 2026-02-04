'use client';

import { useState } from 'react';
import type { EmailCtaContent } from '@/lib/culling/email-cta';

interface EmailCTAProps {
  content: EmailCtaContent;
  onSubmit: (action: 'yes' | 'no', email?: string) => void;
  isSubmitting?: boolean;
}

export default function EmailCTA({ content, onSubmit, isSubmitting }: EmailCTAProps) {
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleYes = () => {
    if (!showEmailInput) {
      setShowEmailInput(true);
      return;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setEmailError('');
    onSubmit('yes', email.trim().toLowerCase());
  };

  const handleNo = () => {
    setShowEmailInput(false);
    setEmail('');
    setEmailError('');
    onSubmit('no');
  };

  // Stage 3 is the thank you screen
  if (content.stage === 3) {
    return (
      <div className="bg-gray-950 border border-green-900/50 rounded-lg p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-green-500">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-bold">EMAIL CAPTURED</span>
        </div>
        <h3 className="text-xl font-bold text-white">{content.headline}</h3>
        <p className="text-gray-400 leading-relaxed">{content.body}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 md:p-8 space-y-6">
      {/* Stage indicator */}
      <div className="flex items-center gap-2 text-gray-500 text-sm font-mono">
        <span>STAGE {content.stage + 1}</span>
        <span className="text-gray-700">/</span>
        <span>3</span>
        {content.stage > 0 && (
          <span className="ml-2 text-yellow-500">(Escalation Active)</span>
        )}
      </div>

      {/* Headline */}
      <h3 className="text-2xl font-bold text-white">{content.headline}</h3>

      {/* Body */}
      <p className="text-gray-400 leading-relaxed">{content.body}</p>

      {/* Email input (shown after clicking yes) */}
      {showEmailInput && (
        <div className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 bg-gray-900 border ${
              emailError ? 'border-red-500' : 'border-gray-700'
            } rounded-lg text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors`}
            disabled={isSubmitting}
          />
          {emailError && (
            <p className="text-red-500 text-sm">{emailError}</p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleYes}
          disabled={isSubmitting}
          className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${
            isSubmitting
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
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
              Processing...
            </span>
          ) : showEmailInput ? (
            'Submit Email'
          ) : (
            content.yesButtonText
          )}
        </button>
        {!showEmailInput && (
          <button
            onClick={handleNo}
            disabled={isSubmitting}
            className="flex-1 py-3 px-6 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 font-bold hover:bg-gray-800 hover:text-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {content.noButtonText}
          </button>
        )}
        {showEmailInput && (
          <button
            onClick={() => {
              setShowEmailInput(false);
              setEmail('');
              setEmailError('');
            }}
            disabled={isSubmitting}
            className="flex-1 py-3 px-6 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 font-bold hover:bg-gray-800 hover:text-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
