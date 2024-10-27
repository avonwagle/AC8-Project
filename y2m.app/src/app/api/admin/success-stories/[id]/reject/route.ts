import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the path according to your setup

// Route handler for rejecting a success story
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const storyId = params.id;

  try {
    // Update the success story's approval status to false (rejected)
    const result = await db
      .updateTable('SuccessStory') // Correct table name should be in lowercase
      .set({ isApproved: false })
      .where('id', '=', parseInt(storyId, 10)) // Convert the ID to number
      .execute();

    // `result` is an array, so check if any rows were affected
    if (result.length > 0 && result[0].numUpdatedRows > 0) {
      return NextResponse.json({ success: true, message: 'Story rejected successfully' });
    } else {
      return NextResponse.json(
        { success: false, message: 'Story not found or already rejected' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error rejecting story:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
