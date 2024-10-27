// src/app/api/success-stories/[mentorId]/route.ts
import { NextRequest, NextResponse } from 'next/server'; // Use 'next/server' for App Router
import { db } from '@/lib/db'; // Update the path to your Kysely db instance

export async function GET(req: NextRequest, { params }: { params: { mentorId: string } }) {
  const { mentorId } = params;

  try {
    const successStories = await db
      .selectFrom('SuccessStory') // Replace with your actual table name
      .selectAll()
      .where('mentorId', '=', mentorId) // Ensure mentorId is a string
      .where('isApproved', '=', true) // Only fetch approved stories
      .orderBy('createdAt', 'desc') // Adjust if your column names differ
      .execute();

    return NextResponse.json(successStories); // Respond with success stories
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
