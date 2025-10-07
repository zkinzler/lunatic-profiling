'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ArchetypeTable from '@/components/ArchetypeTable';
import AsciiBlock from '@/components/AsciiBlock';

interface PublicResult {
  topArchetypes: Array<{ name: string; percentage: number }>;
  overlaps: Array<{ archetypes: string[]; similarity: number }>;
  asciiChart: string;
  summary: string;
}

export default function SharePage() {
  const params = useParams();
  const publicId = params.publicId as string;
  const [result, setResult] = useState<PublicResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicResult = async () => {
      try {
        const response = await fetch(`/api/quiz/public/${publicId}`);
        if (response.ok) {
          const data = await response.json();
          setResult(data);
        } else {
          console.error('Failed to fetch public result');
        }
      } catch (error) {
        console.error('Error fetching public result:', error);
      } finally {
        setLoading(false);
      }
    };

    if (publicId) {
      fetchPublicResult();
    }
  }, [publicId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl mb-4">Profile not found</h1>
          <p className="text-gray-300">This profile may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Shared Lunacy Profile
            </h1>
            <p className="text-xl text-gray-200">
              Someone shared their psychological archetype analysis with you
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
                Lunacy Map
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

          <div className="text-center">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold"
            >
              Take Your Own Assessment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}