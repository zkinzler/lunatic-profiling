'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch('/api/user/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        router.push(`/quiz/${sessionId}`);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Lunatic <span className="text-purple-300">Profiling</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Discover your unique psychological archetype through our advanced AI-powered assessment.
            Uncover the patterns that drive your decisions and behaviors.
          </p>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Start Your Journey
            </h2>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Creating Session...' : 'Begin Assessment'}
              </button>
            </form>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">8 Questions</h3>
              <p className="text-gray-300">Carefully crafted scenarios to reveal your psychological patterns</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-300">Advanced AI interprets your responses for deep insights</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Detailed Results</h3>
              <p className="text-gray-300">Comprehensive archetype breakdown with visual mapping</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}