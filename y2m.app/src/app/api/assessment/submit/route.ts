import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your database connection

interface UserAnswer {
  userId: string;
  assessmentId: number;
  questionId: number;
  selectedOptionId: number | null;
  shortAnswerText: string | null;
  isCorrect: boolean;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assessmentId, answers, userId } = body;

    // Validate input data
    if (!assessmentId || !answers || !userId) {
      console.error('Invalid data: Missing assessmentId, answers, or userId');
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    console.log('Processing assessment submission:', { assessmentId, userId });

    // Fetch correct answers for all questions in the assessment
    const correctAnswers = await db
      .selectFrom('Question')
      .leftJoin('Option', 'Question.id', 'Option.questionId')
      .select([
        'Question.id',
        'Option.id as correctOptionId',
        'Option.isCorrect',
        'Question.questionType',
        'Option.text as correctAnswerText',
      ])
      .where('assessmentId', '=', Number(assessmentId))
      .where('Option.isCorrect', '=', true) // Fetch only correct options
      .execute();

    if (!correctAnswers || correctAnswers.length === 0) {
      console.error('No correct answers found for assessmentId:', assessmentId);
      return NextResponse.json({ error: 'No correct answers found' }, { status: 400 });
    }

    let score = 0; // Initialize score
    const userAnswers: UserAnswer[] = []; // Array to store user answers

    // Loop over all correct answers and process the user's submitted answers
    for (const correctAnswer of correctAnswers) {
      const userAnswer = answers[correctAnswer.id]; // User's submitted answer for this question
      let isCorrect = false;

      console.log('Evaluating question:', correctAnswer.id, 'User Answer:', userAnswer);

      // Multiple Choice Logic
      if (correctAnswer.questionType === 'MULTIPLE_CHOICE' && typeof userAnswer === 'number') {
        isCorrect = userAnswer === correctAnswer.correctOptionId;
      }

      // Short Answer Logic
      else if (correctAnswer.questionType === 'SHORT_ANSWER' && typeof userAnswer === 'string') {
        if (correctAnswer.correctAnswerText !== null) {
          const correctShortAnswer = correctAnswer.correctAnswerText.trim().toLowerCase();
          isCorrect = userAnswer.trim().toLowerCase() === correctShortAnswer;
        }
      }

      // TRUE_FALSE Logic
      else if (correctAnswer.questionType === 'TRUE_FALSE') {
        if (typeof userAnswer === 'boolean') {
          isCorrect = userAnswer === correctAnswer.isCorrect; // Ensure both are booleans
        } else if (typeof userAnswer === 'string') {
          isCorrect = (userAnswer.toLowerCase() === 'true') === correctAnswer.isCorrect; // Handle string input
        }
      }

      console.log('Question:', correctAnswer.id, 'isCorrect:', isCorrect);

      // Store user answer data
      userAnswers.push({
        userId: String(userId),
        assessmentId: Number(assessmentId),
        questionId: correctAnswer.id,
        selectedOptionId: typeof userAnswer === 'number' ? userAnswer : null,
        shortAnswerText: typeof userAnswer === 'string' ? userAnswer : null,
        isCorrect: isCorrect,
      });

      // Increment score if the answer is correct
      if (isCorrect) {
        score += 1;
      }
    }

    // Calculate total questions and pass/fail threshold
    const totalQuestions = correctAnswers.length;
    const passingThreshold = Math.ceil(totalQuestions / 2); // User must answer at least 50% of questions correctly
    const passed = score >= passingThreshold;

    console.log('Total score:', score, 'Passed:', passed);

    // Insert or update user answers in the database
    for (const answer of userAnswers) {
      const existingAnswer = await db
        .selectFrom('UserAnswer')
        .selectAll()
        .where('userId', '=', answer.userId)
        .where('assessmentId', '=', answer.assessmentId)
        .where('questionId', '=', answer.questionId)
        .executeTakeFirst();

      if (existingAnswer) {
        console.log('Updating existing answer for questionId:', answer.questionId);
        await db
          .updateTable('UserAnswer')
          .set(answer)
          .where('userId', '=', answer.userId)
          .where('assessmentId', '=', answer.assessmentId)
          .where('questionId', '=', answer.questionId)
          .execute();
      } else {
        console.log('Inserting new answer for questionId:', answer.questionId);
        await db.insertInto('UserAnswer').values(answer).execute();
      }
    }

    // Insert or update quiz result for the user
    let result;

    const existingResult = await db
      .selectFrom('QuizResult')
      .selectAll()
      .where('userId', '=', userId)
      .where('assessmentId', '=', assessmentId)
      .executeTakeFirst();

    if (existingResult) {
      console.log('Updating existing result for assessmentId:', assessmentId);
      await db
        .updateTable('QuizResult')
        .set({
          score,
          passed,
          createdAt: new Date(),
        })
        .where('userId', '=', userId)
        .where('assessmentId', '=', assessmentId)
        .execute();

      // Fetch the result after updating
      result = await db
        .selectFrom('QuizResult')
        .selectAll()
        .where('userId', '=', userId)
        .where('assessmentId', '=', assessmentId)
        .executeTakeFirst();
    } else {
      console.log('Inserting new result for assessmentId:', assessmentId);
      // Insert new quiz result and fetch the ID
      result = await db
        .insertInto('QuizResult')
        .values({
          userId: String(userId),
          assessmentId: Number(assessmentId),
          score,
          passed,
          createdAt: new Date(),
        })
        .returning('id') // Return the newly inserted result ID
        .executeTakeFirst();
    }

    // Generate a certificate if the user passed
    if (result && passed) {
      const certificateUrl = `/certificates/${userId}/${result.id}`;
      console.log('Passed! Generating certificate for user:', userId);

      await db
        .insertInto('Certificate')
        .values({
          userId,
          assessmentId,
          resultId: result.id,
          url: certificateUrl,
          issuedAt: new Date(),
        })
        .execute();
      console.log('Certificate generated successfully!');
    } else {
      console.log('User did not pass, skipping certificate generation.');
    }

    return NextResponse.json({ success: true, score, passed }, { status: 200 });
  } catch (error) {
    console.error('Error processing quiz submission:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing quiz submission' },
      { status: 500 }
    );
  }
}
