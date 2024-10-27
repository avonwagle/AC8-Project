import { NextResponse } from 'next/server'; // Use NextResponse for the new routing
import { db } from '@/lib/db'; // Adjust the path according to your setup

// Define the SuccessStory interface
interface SuccessStory {
  id: number; // Unique ID for each success story
  title: string; // Title of the success story
  content: string; // Full content of the success story
  isApproved: boolean | null; // Approval status of the success story, nullable
  mentorId: string; // Mentor's ID from the User table
  createdAt: Date; // Date when the story was submitted
  updatedAt: Date; // Date when the story was last updated
}

// Named export for the GET method
export async function GET() {
  try {
    const stories: SuccessStory[] = await db
      .selectFrom('SuccessStory')
      .select(['id', 'title', 'content', 'isApproved', 'mentorId', 'createdAt', 'updatedAt'])
      .execute();

    // Return the fetched success stories
    return NextResponse.json({ success: true, stories });
  } catch (error) {
    console.error('Error fetching success stories:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
