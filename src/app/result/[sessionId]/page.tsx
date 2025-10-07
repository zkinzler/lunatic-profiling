'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ArchetypeTable from '@/components/ArchetypeTable';
import AsciiBlock from '@/components/AsciiBlock';

interface Result {
  id: string;
  scores: Record<string, number>;
  percentages: Record<string, number>;
  topArchetypes: Array<{ name: string; percentage: number }>;
  overlaps: Array<{ archetypes: string[]; similarity: number }>;
  asciiChart: string;
  summary: string;
  session: {
    publicId: string;
  };
}

export default function ResultPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/quiz/result/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setResult(data);
        } else {
          console.error('Failed to fetch result');
        }
      } catch {
        console.error('Error fetching result');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResult();
    }
  }, [sessionId]);

  const handleEmailResults = async () => {
    try {
      const response = await fetch('/api/quiz/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch {
      alert('Failed to send email. Please try again.');
    }
  };

  const shareUrl = result ? `${window.location.origin}/share/${result.session.publicId}` : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your results...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Results not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Your Lunacy Profile
            </h1>
            <p className="text-xl text-gray-200">
              Discover the unique patterns that define your psychological archetype
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Top Archetypes
              </h2>
              <ArchetypeTable archetypes={result.topArchetypes} />
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Your Lunacy Map
              </h2>
              <AsciiBlock content={result.asciiChart} />
            </div>
          </div>

          {result.overlaps && result.overlaps.length > 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Archetype Overlaps
              </h2>
              <div className="space-y-2">
                {result.overlaps.map((overlap, index) => (
                  <div key={index} className="text-gray-200">
                    <span className="font-medium">
                      {overlap.archetypes.join(' + ')}
                    </span>
                    <span className="text-purple-300 ml-2">
                      {Math.round(overlap.similarity)}% similarity
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Psychological Summary
            </h2>
            <p className="text-gray-200 leading-relaxed">
              {result.summary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleEmailResults}
              disabled={emailSent}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50"
            >
              {emailSent ? 'Email Sent!' : 'Email Results'}
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
            >
              Copy Share Link
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-300 text-sm">
              Share your results: <br />
              <span className="text-purple-300 break-all">{shareUrl}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}