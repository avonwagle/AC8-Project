import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Import your Kysely db instance

export async function POST(req: Request) {
  const { text, questionType, options, correctOptionIndex, assessmentId } = await req.json();

  try {
    // Insert the question without options
    const question = await db
      .insertInto('Question') // Ensure 'Question' matches the table name in your DB interface
      .values({
        text,
        questionType,
        assessmentId,
      })
      .returning('id')
      .executeTakeFirst();

    if (question) {
      // Insert the associated options
      await db
        .insertInto('Option') // Ensure 'Option' matches the table name in your DB interface
        .values(
          options.map((option: string, index: number) => ({
            text: option,
            isCorrect: index === correctOptionIndex, // Mark the correct option
            questionId: question.id, // Foreign key linking to the question
          }))
        )
        .execute();
    }

    return NextResponse.json({ message: 'Question created successfully', question });
  } catch (error) {
    console.error('Failed to create question:', error);
    return NextResponse.json({ message: 'Failed to create question', error }, { status: 500 });
  }
}
