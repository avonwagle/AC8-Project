import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assuming db is set up for your database connection

interface ReviewData {
  questionText: string;
  questionType: string;
  selectedOptionId?: number;
  selectedOptionText?: string; // User's selected option text
  shortAnswerText?: string;
  correctOptionText?: string;
  isCorrect: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const assessmentId = searchParams.get('assessmentId');
  const userId = searchParams.get('userId');

  if (!assessmentId || !userId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Fetch user answers along with questions and correct options
    const userAnswers = await db
      .selectFrom('UserAnswer')
      .innerJoin('Question', 'UserAnswer.questionId', 'Question.id')
      .leftJoin('Option', 'Question.id', 'Option.questionId')
      .select([
        'UserAnswer.selectedOptionId',
        'UserAnswer.shortAnswerText',
        'UserAnswer.isCorrect',
        'Question.text as questionText',
        'Question.questionType',
        'Option.id as optionId',
        'Option.text as optionText',
        'Option.isCorrect as optionIsCorrect',
      ])
      .where('UserAnswer.assessmentId', '=', Number(assessmentId))
      .where('UserAnswer.userId', '=', userId)
      .execute();

    const reviewData: ReviewData[] = [];

    userAnswers.forEach((answer) => {
      // Check if the current question already exists in reviewData to prevent duplicates
      const existingQuestion = reviewData.find(
        (review) => review.questionText === answer.questionText
      );

      if (!existingQuestion) {
        // Find the correct option for this question
        const correctOption = userAnswers.find(
          (opt) => opt.optionIsCorrect && opt.questionText === answer.questionText
        );

        // Find the user's selected option
        const selectedOption = userAnswers.find((opt) => opt.optionId === answer.selectedOptionId);

        reviewData.push({
          questionText: answer.questionText,
          questionType: answer.questionType,
          selectedOptionId: answer.selectedOptionId !== null ? answer.selectedOptionId : undefined,
          selectedOptionText:
            selectedOption && selectedOption.optionText ? selectedOption.optionText : undefined,
          shortAnswerText: answer.shortAnswerText !== null ? answer.shortAnswerText : undefined,
          correctOptionText:
            correctOption && correctOption.optionText ? correctOption.optionText : undefined,
          isCorrect: answer.isCorrect,
        });
      }
    });

    return NextResponse.json(reviewData);
  } catch (error) {
    console.error('Error fetching review data:', error);
    return NextResponse.json({ error: 'Failed to fetch review data' }, { status: 500 });
  }
}
