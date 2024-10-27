import { NextResponse } from 'next/server'; // Standard import for NextResponse
import { db } from '@/lib/db'; // Ensure the path to your Kysely db instance is correct

// GET handler (to fetch approved success stories)
export async function GET() {
  try {
    // Fetch all success stories where isApproved is true
    const successStories = await db
      .selectFrom('SuccessStory')
      .selectAll()
      .where('isApproved', '=', true) // Only approved success stories
      .orderBy('createdAt', 'desc') // Order by creation date (newest first)
      .execute();

    return NextResponse.json(successStories, { status: 200 });
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
