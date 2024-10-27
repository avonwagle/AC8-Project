import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your Kysely DB setup

interface Assessment {
  id: number;
  title: string;
  description: string;
  objective: string;
  duration: number;
  categoryId: number;
  categoryName: string;
}

interface QuizResult {
  assessmentId: number;
  passed: boolean;
}

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('userId'); // Fetch the user ID from headers

    if (!userId) {
      console.log('No userId provided in the request headers');
      return NextResponse.json({ success: false, message: 'Unauthorized' });
    }

    // Fetch all assessments grouped by category
    const assessmentsByCategory: Assessment[] = await db
      .selectFrom('Assessment')
      .innerJoin('Category', 'Category.id', 'Assessment.categoryId') // Join the Category table
      .select([
        'Assessment.id',
        'Assessment.title',
        'Assessment.description',
        'Assessment.objective',
        'Assessment.duration',
        'Category.name as categoryName', // Fetch the category name
        'Assessment.categoryId',
      ])
      .execute();

    // Fetch the current user's quiz results
    const userQuizResults: QuizResult[] = await db
      .selectFrom('QuizResult')
      .select(['QuizResult.assessmentId', 'QuizResult.passed'])
      .where('QuizResult.userId', '=', userId) // Filter by the current user
      .execute();

    // Create a map for easier lookup of passed status
    const quizResultsMap = new Map<number, boolean>();
    userQuizResults.forEach((result) => {
      quizResultsMap.set(result.assessmentId, result.passed);
    });

    // Filter out passed assessments and group them by category
    const assessmentsByCategoryMap: Record<string, Assessment[]> = {}; // Object to store assessments by category
    assessmentsByCategory.forEach((assessment) => {
      const passed = quizResultsMap.get(assessment.id);

      // Only show assessments that haven't been passed by the user
      if (passed !== true) {
        if (!assessmentsByCategoryMap[assessment.categoryName]) {
          assessmentsByCategoryMap[assessment.categoryName] = [];
        }
        assessmentsByCategoryMap[assessment.categoryName].push(assessment);
      }
    });

    // Return the categorized assessments
    if (Object.keys(assessmentsByCategoryMap).length === 0) {
      return NextResponse.json({ success: false, message: 'No assessments found.' });
    }

    return NextResponse.json({ success: true, assessments: assessmentsByCategoryMap });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch assessments.' });
  }
}
