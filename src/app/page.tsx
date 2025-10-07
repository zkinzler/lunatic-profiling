'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        router.push(`/quiz/${sessionId}`);
      } else {
        alert('Failed to start quiz. Please try again.');
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Failed to start quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            🌙 Lunatic Profiling
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Discover your psychological archetype through our mystical 8-question journey
          </p>
          <div className="text-lg text-purple-200 space-y-2">
            <p>✨ Explore the depths of your psyche</p>
            <p>🔮 Uncover hidden patterns in your personality</p>
            <p>🌟 Receive your personalized Lunacy Map</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Begin Your Journey
          </h2>

          <form onSubmit={handleStart} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <p className="text-sm text-purple-200 mt-2">
                📧 Your results will be emailed to you
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Starting Your Journey...</span>
                </div>
              ) : (
                '🚀 Start the Lunatic Profiling Quiz'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-blue-200">
              Takes 3-5 minutes • 8 mystical questions • Instant results
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-purple-300">
            🔒 Your data is secure and used only for generating your profile
          </p>
        </div>
      </div>
    </div>
  );
}