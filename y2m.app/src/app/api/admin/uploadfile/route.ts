import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Import your Kysely db instance

// Define the question types that match your database schema
type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';

interface Question {
  text: string;
  questionType: string;
  assessmentId: string;
}

interface Option {
  text: string;
  isCorrect: string;
  questionId: number;
}

export async function POST(req: Request) {
  try {
    const { questions } = (await req.json()) as { questions: Question[] | Option[] }; // Specify the type of questions

    // Assuming the first row of the CSV contains headers.
    const headers = Object.keys(questions[0]);

    // Check if this CSV contains questions or options
    if (
      headers.includes('text') &&
      headers.includes('questionType') &&
      headers.includes('assessmentId')
    ) {
      // This is a question upload
      await handleQuestionUpload(questions as Question[]);
    } else if (
      headers.includes('questionId') &&
      headers.includes('text') &&
      headers.includes('isCorrect')
    ) {
      // This is an options upload
      await handleOptionUpload(questions as Option[]);
    } else {
      return NextResponse.json({ message: 'Invalid CSV format' }, { status: 400 });
    }

    return NextResponse.json({ message: 'File processed successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ message: 'Failed to process file', error }, { status: 500 });
  }
}

// Function to handle the upload of questions
async function handleQuestionUpload(questions: Question[]) {
  for (const question of questions) {
    const { text, questionType, assessmentId } = question;

    try {
      // Convert assessmentId to a number if it's a string
      const parsedAssessmentId = parseInt(assessmentId, 10);

      if (isNaN(parsedAssessmentId)) {
        console.error(`Invalid assessmentId: ${assessmentId}`);
        continue; // Skip this question if assessmentId is invalid
      }

      // Ensure questionType is a valid enum value
      const validQuestionTypes: QuestionType[] = ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'];
      if (!validQuestionTypes.includes(questionType as QuestionType)) {
        console.error(`Invalid questionType: ${questionType}`);
        continue; // Skip this question if questionType is invalid
      }

      // Check if the question already exists (optional: based on your requirements)
      const existingQuestion = await db
        .selectFrom('Question')
        .where('text', '=', text)
        .select(['id'])
        .executeTakeFirst();

      if (existingQuestion) {
        console.log(`Question already exists: ${text}`);
        continue; // Skip this question if it already exists
      }

      // Insert the question into the Question table
      await db
        .insertInto('Question')
        .values({
          text,
          questionType: questionType as QuestionType, // Ensure the type matches DB schema
          assessmentId: parsedAssessmentId, // Store the numeric assessmentId
        })
        .execute();
    } catch (error) {
      console.error('Error inserting question:', error);
    }
  }
}

// Function to handle the upload of options
async function handleOptionUpload(options: Option[]) {
  for (const option of options) {
    const { text, isCorrect, questionId } = option;

    try {
      // Insert options into the Option table with the correct questionId
      await db
        .insertInto('Option')
        .values({
          text,
          isCorrect: isCorrect.toLowerCase() === 'true', // Convert string to boolean
          questionId,
        })
        .execute();
    } catch (error) {
      console.error('Error inserting options:', error);
    }
  }
}
