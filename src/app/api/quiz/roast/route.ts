import { NextRequest, NextResponse } from 'next/server';
import { generateRoast, getSpecialRoast } from '@/lib/roasts';
import { getQuestionById } from '@/lib/questions';

export async function POST(request: NextRequest) {
  try {
    const { questionId, answerId, answerHistory } = await request.json();

    if (!questionId || !answerId) {
      return NextResponse.json(
        { error: 'Question ID and Answer ID are required' },
        { status: 400 }
      );
    }

    // Get the question and answer
    const question = getQuestionById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const answer = question.answers.find(a => a.id === answerId);
    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      );
    }

    // Check for special easter egg roasts first
    const specialRoast = getSpecialRoast(questionId, answerId);

    // Generate the roast
    const roast = specialRoast || generateRoast(
      answer.roastCategory,
      answerHistory || []
    );

    return NextResponse.json({
      roast,
      category: answer.roastCategory,
      isSpecial: !!specialRoast,
    });
  } catch (error) {
    console.error('Error generating roast:', error);
    return NextResponse.json(
      { error: 'Failed to generate roast' },
      { status: 500 }
    );
  }
}
