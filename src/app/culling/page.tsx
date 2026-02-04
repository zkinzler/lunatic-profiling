'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CullingIntro from '@/components/culling/CullingIntro';

export default function CullingLandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/culling/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      const data = await response.json();
      router.push(`/culling/quiz/${data.sessionId}`);
    } catch (error) {
      console.error('Failed to start culling:', error);
      alert('Failed to initialize The Culling. Please try again.');
      setIsLoading(false);
    }
  };

  return <CullingIntro onStart={handleStart} isLoading={isLoading} />;
}
