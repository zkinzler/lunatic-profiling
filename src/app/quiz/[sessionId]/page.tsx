'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import QuestionCard from '@/components/QuestionCard';
import Progress from '@/components/Progress';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "You're at a party where you know very few people. What do you do?",
    answers: [
      { id: 'a', text: "Find the host and introduce yourself to everyone they know", weight: { extrovert: 3, social: 2 } },
      { id: 'b', text: "Look for someone who seems interesting and strike up a conversation", weight: { extrovert: 2, intuitive: 2 } },
      { id: 'c', text: "Find a quiet corner and observe the social dynamics", weight: { introvert: 3, analytical: 2 } },
      { id: 'd', text: "Help with party tasks to feel useful and connected", weight: { helper: 3, social: 1 } },
      { id: 'e', text: "Leave early - parties aren't really your thing", weight: { introvert: 2, independent: 2 } },
      { id: 'f', text: "Crack jokes to break the ice and make people laugh", weight: { extrovert: 2, entertainer: 3 } }
    ]
  },
  {
    id: 2,
    question: "When making an important decision, you typically:",
    answers: [
      { id: 'a', text: "Research extensively and analyze all possible outcomes", weight: { analytical: 3, cautious: 2 } },
      { id: 'b', text: "Go with your gut feeling - it rarely steers you wrong", weight: { intuitive: 3, confident: 2 } },
      { id: 'c', text: "Seek advice from trusted friends and family", weight: { social: 2, collaborative: 2 } },
      { id: 'd', text: "Consider how it will affect others around you", weight: { empathetic: 3, helper: 2 } },
      { id: 'e', text: "Choose the option that seems most exciting", weight: { adventurous: 3, spontaneous: 2 } },
      { id: 'f', text: "Delay the decision until absolutely necessary", weight: { cautious: 2, procrastinator: 2 } }
    ]
  },
  {
    id: 3,
    question: "Your ideal weekend involves:",
    answers: [
      { id: 'a', text: "Trying a new restaurant or exploring a new place", weight: { adventurous: 2, social: 2 } },
      { id: 'b', text: "Staying home with a good book or favorite TV series", weight: { introvert: 3, content: 2 } },
      { id: 'c', text: "Organizing a gathering with friends or family", weight: { social: 3, organizer: 2 } },
      { id: 'd', text: "Working on a personal project or hobby", weight: { creative: 2, independent: 2 } },
      { id: 'e', text: "Doing something spontaneous - no plans needed", weight: { spontaneous: 3, free_spirit: 2 } },
      { id: 'f', text: "Volunteering or helping others in your community", weight: { helper: 3, altruistic: 2 } }
    ]
  },
  {
    id: 4,
    question: "In group projects, you usually:",
    answers: [
      { id: 'a', text: "Take charge and delegate tasks to team members", weight: { leader: 3, organizer: 2 } },
      { id: 'b', text: "Focus on the creative or innovative aspects", weight: { creative: 3, visionary: 2 } },
      { id: 'c', text: "Handle the detailed research and analysis", weight: { analytical: 3, thorough: 2 } },
      { id: 'd', text: "Mediate conflicts and keep everyone motivated", weight: { diplomatic: 3, empathetic: 2 } },
      { id: 'e', text: "Do your part quietly and efficiently", weight: { reliable: 2, independent: 2 } },
      { id: 'f', text: "Challenge ideas to make sure they're sound", weight: { critical_thinker: 3, skeptical: 2 } }
    ]
  },
  {
    id: 5,
    question: "When facing a major life challenge, you:",
    answers: [
      { id: 'a', text: "Break it down into manageable steps and tackle each one", weight: { organized: 3, methodical: 2 } },
      { id: 'b', text: "Dive in headfirst and figure it out as you go", weight: { impulsive: 2, confident: 3 } },
      { id: 'c', text: "Seek support and advice from your network", weight: { collaborative: 2, social: 2 } },
      { id: 'd', text: "Take time to reflect and understand the deeper meaning", weight: { reflective: 3, philosophical: 2 } },
      { id: 'e', text: "Look for creative or unconventional solutions", weight: { creative: 2, innovative: 3 } },
      { id: 'f', text: "Focus on how to help others who might face similar challenges", weight: { altruistic: 3, helper: 2 } }
    ]
  },
  {
    id: 6,
    question: "Your communication style is best described as:",
    answers: [
      { id: 'a', text: "Direct and to the point - no beating around the bush", weight: { direct: 3, efficient: 2 } },
      { id: 'b', text: "Warm and encouraging - you focus on building people up", weight: { supportive: 3, empathetic: 2 } },
      { id: 'c', text: "Thoughtful and measured - you choose your words carefully", weight: { cautious: 2, reflective: 2 } },
      { id: 'd', text: "Enthusiastic and animated - you get excited about ideas", weight: { passionate: 3, expressive: 2 } },
      { id: 'e', text: "Logical and fact-based - you stick to what can be proven", weight: { analytical: 3, rational: 2 } },
      { id: 'f', text: "Diplomatic and tactful - you avoid causing offense", weight: { diplomatic: 3, harmonious: 2 } }
    ]
  },
  {
    id: 7,
    question: "When you're stressed, you typically:",
    answers: [
      { id: 'a', text: "Withdraw and need alone time to recharge", weight: { introvert: 2, solitary: 3 } },
      { id: 'b', text: "Talk it out with friends or family", weight: { social: 3, expressive: 2 } },
      { id: 'c', text: "Throw yourself into work or physical activity", weight: { active: 2, coping: 2 } },
      { id: 'd', text: "Analyze the situation to understand what went wrong", weight: { analytical: 2, systematic: 3 } },
      { id: 'e', text: "Look for ways to help others instead of focusing on yourself", weight: { altruistic: 2, deflecting: 2 } },
      { id: 'f', text: "Distract yourself with entertainment or hobbies", weight: { escapist: 2, adaptive: 2 } }
    ]
  },
  {
    id: 8,
    question: "Your approach to life philosophy is:",
    answers: [
      { id: 'a', text: "Live each day to the fullest - you never know what tomorrow brings", weight: { spontaneous: 2, present_focused: 3 } },
      { id: 'b', text: "Plan carefully for the future while enjoying the present", weight: { balanced: 3, strategic: 2 } },
      { id: 'c', text: "Focus on making a positive impact on others and society", weight: { altruistic: 3, purposeful: 2 } },
      { id: 'd', text: "Question everything and seek deeper understanding", weight: { philosophical: 3, curious: 2 } },
      { id: 'e', text: "Stay practical and focus on what works", weight: { pragmatic: 3, realistic: 2 } },
      { id: 'f', text: "Embrace change and see life as an adventure", weight: { adventurous: 3, optimistic: 2 } }
    ]
  }
];

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
    }
  }, [sessionId, router]);

  const handleAnswerSelect = (questionId: number, answerId: string, isSelected: boolean) => {
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
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
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

  const currentAnswers = answers[QUIZ_QUESTIONS[currentQuestion].id] || [];
  const canProceed = currentAnswers.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Progress
            current={currentQuestion + 1}
            total={QUIZ_QUESTIONS.length}
          />

          <div className="mt-8">
            <QuestionCard
              question={QUIZ_QUESTIONS[currentQuestion]}
              selectedAnswers={currentAnswers}
              onAnswerSelect={handleAnswerSelect}
            />
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed || loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' :
               currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'Complete Quiz' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}