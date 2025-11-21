'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import QuestionCard from '@/components/QuestionCard';
import Progress from '@/components/Progress';
import { Question } from '@/lib/questions';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [fetchingQuestions, setFetchingQuestions] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    // Fetch session to get question IDs
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/quiz/session/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        alert('Failed to load quiz. Please try again.');
        router.push('/');
      } finally {
        setFetchingQuestions(false);
      }
    };

    fetchQuestions();
  }, [sessionId, router]);

  const handleAnswerSelect = (questionId: string, answerId: string, isSelected: boolean) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (isSelected) {
        if (current.length < 3) {
          return { ...prev, [questionId]: [...current, answerId] };
        }
      } else {
        return { ...prev, [questionId]: current.filter(id => id !== answerId) };
      }
      return prev;
    });
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLoading(true);
      try {
        await fetch('/api/quiz/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, answers }),
        });

        const gradeResponse = await fetch('/api/quiz/grade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (gradeResponse.ok) {
          router.push(`/result/${sessionId}`);
        } else {
          alert('Something went wrong grading your quiz. Please try again.');
        }
      } catch {
        alert('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (fetchingQuestions) {
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
            Preparing Your Cosmic Journey
          </h2>
          <p className="text-gray-300">Aligning the stars and shuffling the cards...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center p-4">
        <div className="glass-strong rounded-3xl p-12 text-center max-w-lg">
          <div className="text-6xl mb-6">🌌</div>
          <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">
            Lost in the Cosmos
          </h2>
          <p className="text-gray-300 mb-6">
            No questions found for this session. The universe seems confused.
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

  const currentQuestionData = questions[currentQuestion];
  const currentAnswers = answers[currentQuestionData.id] || [];
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
            <p className="text-gray-300 text-lg">Discover your cosmic archetype</p>
          </div>

          <Progress
            current={currentQuestion + 1}
            total={questions.length}
          />

          <div className="mt-8">
            <QuestionCard
              question={{
                id: currentQuestion + 1,
                question: currentQuestionData.question,
                answers: currentQuestionData.answers
              }}
              selectedAnswers={currentAnswers}
              onAnswerSelect={(_, answerId, isSelected) =>
                handleAnswerSelect(currentQuestionData.id, answerId, isSelected)
              }
            />
          </div>

          <div className="flex justify-between items-center mt-8 gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-8 py-4 glass rounded-xl font-semibold transition-all duration-300 ${currentQuestion === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:glass-strong hover:scale-105 hover-glow text-white'
                }`}
            >
              ← Previous
            </button>

            <div className="glass rounded-full px-6 py-3">
              <span className="text-sm text-gray-300">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed || loading}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${!canProceed || loading
                  ? 'opacity-30 cursor-not-allowed bg-gray-600'
                  : 'btn-cosmic'
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : currentQuestion === questions.length - 1 ? (
                'Complete Quiz ✨'
              ) : (
                'Next →'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}