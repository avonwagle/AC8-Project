import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your database instance

// API handler to fetch questions and options based on assessment ID
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const assessmentId = url.searchParams.get('assessmentId');

    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    // Fetch questions from the database
    const questions = await db
      .selectFrom('Question')
      .select(['id', 'text', 'questionType', 'assessmentId'])
      .where('assessmentId', '=', Number(assessmentId))
      .execute();

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found for the given assessment ID' },
        { status: 404 }
      );
    }

    // Fetch options for each question
    const questionIds = questions.map((q) => q.id);
    const options = await db
      .selectFrom('Option')
      .select(['id', 'text', 'isCorrect', 'questionId'])
      .where('questionId', 'in', questionIds)
      .execute();

    // Combine questions and options
    const questionsWithOptions = questions.map((question) => {
      const questionOptions = options.filter((option) => option.questionId === question.id);
      return { ...question, options: questionOptions };
    });

    return NextResponse.json(questionsWithOptions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
