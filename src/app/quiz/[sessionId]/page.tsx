'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PhaseProgress from '@/components/PhaseProgress';
import RoastDisplay from '@/components/RoastDisplay';
import PhaseTransition from '@/components/PhaseTransition';
import { QUIZ_QUESTIONS, type Question, isEndOfPhase } from '@/lib/questions';
import type { PhaseTransitionResult, ArchetypeStanding } from '@/lib/transitions';

type QuizStage = 'question' | 'roast' | 'transition' | 'loading';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [stage, setStage] = useState<QuizStage>('loading');
  const [currentRoast, setCurrentRoast] = useState<string | null>(null);
  const [roastCategory, setRoastCategory] = useState<string | undefined>();
  const [transitionData, setTransitionData] = useState<PhaseTransitionResult | null>(null);
  const [phase1Standings, setPhase1Standings] = useState<ArchetypeStanding[] | null>(null);
  const [answerHistory, setAnswerHistory] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing session state
  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/quiz/session/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();

        // If session already has answers, restore state
        if (data.answers && Object.keys(data.answers).length > 0) {
          setAnswers(data.answers);
          // Find the next unanswered question
          const answeredIds = Object.keys(data.answers);
          const nextIndex = QUIZ_QUESTIONS.findIndex(q => !answeredIds.includes(q.id));
          setCurrentQuestionIndex(nextIndex >= 0 ? nextIndex : QUIZ_QUESTIONS.length - 1);

          // Rebuild answer history
          const history = answeredIds.map(qId => data.answers[qId][0]).filter(Boolean);
          setAnswerHistory(history);
        }

        setStage('question');
      } catch (error) {
        console.error('Error fetching session:', error);
        alert('Failed to load quiz. Please try again.');
        router.push('/');
      }
    };

    fetchSession();
  }, [sessionId, router]);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const currentPhase = currentQuestion?.phase || 1;
  const questionNumber = currentQuestionIndex + 1;
  const currentAnswers = answers[currentQuestion?.id] || [];

  // Handle answer selection
  const handleAnswerSelect = (answerId: string) => {
    if (!currentQuestion) return;

    setAnswers(prev => {
      const current = prev[currentQuestion.id] || [];
      const isSelected = current.includes(answerId);

      if (isSelected) {
        // Deselect
        return { ...prev, [currentQuestion.id]: current.filter(id => id !== answerId) };
      } else if (current.length < 3) {
        // Select (max 3)
        return { ...prev, [currentQuestion.id]: [...current, answerId] };
      }
      return prev;
    });
  };

  // Fetch roast from API
  const fetchRoast = useCallback(async (questionId: string, answerId: string) => {
    try {
      const response = await fetch('/api/quiz/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          answerId,
          answerHistory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { roast: data.roast, category: data.category };
      }
    } catch (error) {
      console.error('Error fetching roast:', error);
    }
    return { roast: "Your answer has been noted. The universe is taking notes.", category: 'MIXED' };
  }, [answerHistory]);

  // Handle submitting answer
  const handleSubmitAnswer = async () => {
    if (currentAnswers.length === 0 || !currentQuestion) return;

    setIsSubmitting(true);

    try {
      // Save answer to backend
      await fetch('/api/quiz/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          answers: currentAnswers,
        }),
      });

      // Update answer history
      setAnswerHistory(prev => [...prev, currentAnswers[0]]);

      // Fetch roast
      const { roast, category } = await fetchRoast(currentQuestion.id, currentAnswers[0]);
      setCurrentRoast(roast);
      setRoastCategory(category);
      setStage('roast');
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to save answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle continuing after roast
  const handleContinueAfterRoast = async () => {
    // Check if this is end of phase
    if (isEndOfPhase(questionNumber)) {
      // Fetch transition data
      try {
        const phase = currentPhase as 1 | 2;
        const response = await fetch('/api/quiz/transition', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            phase,
            phase1Standings: phase === 2 ? phase1Standings : undefined,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTransitionData(data.transition);

          // Store phase 1 standings for phase 2 transition
          if (phase === 1) {
            setPhase1Standings(data.transition.topArchetypes);
          }

          setStage('transition');
          return;
        }
      } catch (error) {
        console.error('Error fetching transition:', error);
      }
    }

    // If last question, grade the quiz
    if (questionNumber >= QUIZ_QUESTIONS.length) {
      setStage('loading');
      try {
        const gradeResponse = await fetch('/api/quiz/grade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (gradeResponse.ok) {
          const data = await gradeResponse.json();
          router.push(`/result/${data.publicId || sessionId}`);
        } else {
          alert('Something went wrong grading your quiz. Please try again.');
          setStage('question');
        }
      } catch {
        alert('Something went wrong. Please try again.');
        setStage('question');
      }
      return;
    }

    // Move to next question
    setCurrentQuestionIndex(prev => prev + 1);
    setCurrentRoast(null);
    setRoastCategory(undefined);
    setStage('question');
  };

  // Handle continuing after phase transition
  const handleContinueAfterTransition = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setTransitionData(null);
    setStage('question');
  };

  // Loading state
  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center p-4">
        <div className="glass-strong rounded-3xl p-12 text-center animate-float">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-glow-pulse flex items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold gradient-text-cosmic mb-2">
            {questionNumber >= QUIZ_QUESTIONS.length ? 'Generating Your Lunacy Blueprint' : 'Preparing Your Cosmic Journey'}
          </h2>
          <p className="text-gray-300">
            {questionNumber >= QUIZ_QUESTIONS.length ? 'Analyzing chaos patterns and calculating damage...' : 'Aligning the stars and preparing the roasts...'}
          </p>
        </div>
      </div>
    );
  }

  // Phase transition state
  if (stage === 'transition' && transitionData) {
    return (
      <PhaseTransition
        transition={transitionData}
        onContinue={handleContinueAfterTransition}
      />
    );
  }

  // Roast state
  if (stage === 'roast' && currentRoast) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <RoastDisplay
            roast={currentRoast}
            category={roastCategory}
            onContinue={handleContinueAfterRoast}
          />
        </div>
      </div>
    );
  }

  // Question state
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center p-4">
        <div className="glass-strong rounded-3xl p-12 text-center max-w-lg">
          <div className="text-6xl mb-6">🌌</div>
          <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">
            Lost in the Cosmos
          </h2>
          <p className="text-gray-300 mb-6">
            No questions found. The universe seems confused.
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-cosmic"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const canProceed = currentAnswers.length > 0;

  return (
    <div className="min-h-screen bg-cosmic">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text-cosmic mb-3">
              Lunatic Profiling
            </h1>
            <p className="text-gray-300 text-lg">Discover your chaos archetype</p>
          </div>

          {/* Phase Progress */}
          <PhaseProgress
            currentPhase={currentPhase}
            currentQuestion={questionNumber}
            totalQuestions={QUIZ_QUESTIONS.length}
          />

          {/* Question Card */}
          <div className="mt-8 glass-strong rounded-3xl p-8 md:p-10 hover-glow">
            {/* Question header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-pink-400 mb-1">
                  {currentQuestion.title}
                </h2>
                <span className="text-3xl md:text-4xl font-bold gradient-text-cosmic">
                  Question {questionNumber}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                <span className="text-sm text-gray-300">Selected:</span>
                <span className="text-lg font-bold gradient-text">
                  {currentAnswers.length}/3
                </span>
              </div>
            </div>

            {/* Question text */}
            <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed font-medium">
              {currentQuestion.question}
            </p>

            {/* Answers */}
            <div className="space-y-4">
              {currentQuestion.answers.map((answer) => {
                const isSelected = currentAnswers.includes(answer.id);
                const rank = currentAnswers.indexOf(answer.id) + 1;

                return (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswerSelect(answer.id)}
                    className={`group w-full text-left p-5 md:p-6 rounded-2xl transition-all duration-300 transform ${
                      isSelected
                        ? 'glass-strong border-2 border-pink-400 glow-pink scale-[1.02]'
                        : 'glass border border-white/10 hover:border-white/30 hover:scale-[1.01] hover:glass-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className={`flex-1 text-base md:text-lg transition-colors ${
                        isSelected
                          ? 'text-white font-semibold'
                          : 'text-gray-200 group-hover:text-white'
                      }`}>
                        {answer.text}
                      </span>
                      {isSelected && (
                        <div className="flex items-center justify-center min-w-[3rem] h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 glow-pink">
                          <span className="text-white font-bold text-lg">
                            #{rank}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 glass rounded-xl text-center">
              <p className="text-gray-200 text-sm md:text-base">
                Select up to 3 answers and rank them in order of preference
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Your first choice is worth 3 points, second 2 points, third 1 point (multiplied by phase)
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSubmitAnswer}
              disabled={!canProceed || isSubmitting}
              className={`px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 ${
                !canProceed || isSubmitting
                  ? 'opacity-30 cursor-not-allowed bg-gray-600'
                  : 'btn-cosmic hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Lock In Answer'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
