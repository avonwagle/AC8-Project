import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path according to your setup

// Route handler for approving a success story
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const storyId = params.id;

  try {
    // Update the success story's approval status to true (approved)
    const result = await db
      .updateTable('SuccessStory') // Correct table name
      .set({ isApproved: true })
      .where('id', '=', parseInt(storyId, 10)) // Convert the ID to number
      .execute();

    // `result` is an array, so check if any rows were affected
    if (result.length > 0 && result[0].numUpdatedRows > 0) {
      return NextResponse.json({ success: true, message: 'Story approved successfully' });
    } else {
      return NextResponse.json(
        { success: false, message: 'Story not found or already approved' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error approving story:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
