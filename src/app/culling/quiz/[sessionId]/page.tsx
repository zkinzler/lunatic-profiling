'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CullingIntro from '@/components/culling/CullingIntro';
import GateQuestion from '@/components/culling/GateQuestion';
import CullScreen from '@/components/culling/CullScreen';
import CullingQuestion from '@/components/culling/CullingQuestion';
import CullingRoast from '@/components/culling/CullingRoast';
import type { AnswerChoice } from '@/lib/culling/questions';
import type { GhostCode } from '@/lib/culling/ghosts';

type QuizStage =
  | 'loading'
  | 'intro'
  | 'gate'
  | 'gate_roast'
  | 'culled'
  | 'main'
  | 'main_roast'
  | 'grading';

interface SessionState {
  currentPhase: string;
  gateIndex: number;
  totalGates: number;
  questionIndex: number;
  totalQuestions: number;
  culled: boolean;
  culledAtGate?: number;
  culledReason?: string;
  culledShareText?: string;
  publicId: string;
  currentGate?: {
    id: string;
    gateNumber: number;
    question: string;
    yesText: string;
    noText: string;
  };
  currentQuestion?: {
    id: string;
    questionNumber: number;
    title: string;
    question: string;
    answers: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
  };
}

export default function CullingQuizPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [stage, setStage] = useState<QuizStage>('loading');
  const [session, setSession] = useState<SessionState | null>(null);
  const [currentRoast, setCurrentRoast] = useState<string | null>(null);
  const [currentGhostCode, setCurrentGhostCode] = useState<GhostCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch session state
  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch(`/api/culling/session/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch session');
      }
      const data = await response.json();
      setSession(data);

      // Determine stage based on session state
      if (data.culled) {
        setStage('culled');
      } else if (data.currentPhase === 'intro') {
        setStage('intro');
      } else if (data.currentPhase === 'gates') {
        setStage('gate');
      } else if (data.currentPhase === 'main') {
        setStage('main');
      } else if (data.currentPhase === 'results' || data.currentPhase === 'email_cta') {
        router.push(`/culling/result/${sessionId}`);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      alert('Failed to load quiz. Please try again.');
      router.push('/culling');
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (!sessionId) {
      router.push('/culling');
      return;
    }
    fetchSession();
  }, [sessionId, router, fetchSession]);

  // Handle starting from intro (transition to gates)
  const handleStartFromIntro = async () => {
    try {
      // Update session to gates phase
      const response = await fetch(`/api/culling/session/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_gates' }),
      });

      if (response.ok) {
        await fetchSession();
      }
    } catch (error) {
      console.error('Error starting gates:', error);
      await fetchSession();
    }
  };

  // Handle gate answer
  const handleGateAnswer = async (answer: boolean) => {
    if (!session?.currentGate || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/culling/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          gateId: session.currentGate.id,
          answer,
        }),
      });

      const data = await response.json();

      if (data.culled) {
        // User was culled
        setSession((prev) =>
          prev
            ? {
                ...prev,
                culled: true,
                culledAtGate: data.culledAtGate,
                culledReason: data.cullReason,
                culledShareText: data.shareText,
              }
            : null
        );
        setStage('culled');
      } else if (data.passed) {
        // Show pass message then continue
        setCurrentRoast(data.passMessage);
        setStage('gate_roast');
      }
    } catch (error) {
      console.error('Error submitting gate answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle continuing after gate roast
  const handleContinueAfterGateRoast = async () => {
    setCurrentRoast(null);
    await fetchSession();
  };

  // Handle main question answer
  const handleMainAnswer = async (answer: AnswerChoice) => {
    if (!session?.currentQuestion || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/culling/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: session.currentQuestion.id,
          answer,
        }),
      });

      const data = await response.json();

      if (data.allQuestionsAnswered) {
        // Grade the quiz
        setStage('grading');
        await gradeQuiz();
      } else {
        // Show roast then continue
        setCurrentRoast(data.roast);
        setCurrentGhostCode(data.ghostCode || null);
        setStage('main_roast');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle continuing after main roast
  const handleContinueAfterMainRoast = async () => {
    setCurrentRoast(null);
    setCurrentGhostCode(null);
    await fetchSession();
  };

  // Grade the quiz
  const gradeQuiz = async () => {
    try {
      const response = await fetch('/api/culling/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        router.push(`/culling/result/${sessionId}`);
      } else {
        alert('Failed to grade quiz. Please try again.');
        await fetchSession();
      }
    } catch (error) {
      console.error('Error grading quiz:', error);
      alert('Failed to grade quiz. Please try again.');
      await fetchSession();
    }
  };

  // Loading state
  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-mono">Loading protocol...</p>
        </div>
      </div>
    );
  }

  // Intro state
  if (stage === 'intro') {
    return <CullingIntro onStart={handleStartFromIntro} />;
  }

  // Culled state
  if (stage === 'culled' && session) {
    return (
      <CullScreen
        culledAtGate={session.culledAtGate || 0}
        cullReason={session.culledReason || 'Unknown reason'}
        publicId={session.publicId}
        shareText={session.culledShareText}
      />
    );
  }

  // Gate roast state
  if (stage === 'gate_roast' && currentRoast) {
    return (
      <CullingRoast
        roast={currentRoast}
        onContinue={handleContinueAfterGateRoast}
      />
    );
  }

  // Gate question state
  if (stage === 'gate' && session?.currentGate) {
    return (
      <GateQuestion
        gateNumber={session.currentGate.gateNumber}
        totalGates={session.totalGates}
        question={session.currentGate.question}
        yesText={session.currentGate.yesText}
        noText={session.currentGate.noText}
        onAnswer={handleGateAnswer}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Main roast state
  if (stage === 'main_roast' && currentRoast) {
    return (
      <CullingRoast
        roast={currentRoast}
        ghostCode={currentGhostCode}
        onContinue={handleContinueAfterMainRoast}
      />
    );
  }

  // Main question state
  if (stage === 'main' && session?.currentQuestion) {
    return (
      <CullingQuestion
        questionNumber={session.currentQuestion.questionNumber}
        totalQuestions={session.totalQuestions}
        title={session.currentQuestion.title}
        question={session.currentQuestion.question}
        answers={session.currentQuestion.answers}
        onAnswer={handleMainAnswer}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Grading state
  if (stage === 'grading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-mono">Calculating your ghost type...</p>
          <p className="text-gray-600 font-mono text-sm">The spirits are conferring...</p>
        </div>
      </div>
    );
  }

  // Fallback - refetch session
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-gray-500 font-mono">Session state unclear...</p>
        <button
          onClick={() => fetchSession()}
          className="px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
