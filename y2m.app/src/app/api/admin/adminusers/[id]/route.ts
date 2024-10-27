import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Adjust the import based on your project structure

// Handle updating a specific admin user
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    // Get the data from the request body
    const body = await req.json();
    const { email, role } = body;

    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        { success: false, message: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Update the user in the database
    await db
      .updateTable('AdminUser')
      .set({
        email,
        role,
      })
      .where('id', '=', userId)
      .execute();

    // Return a success response
    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Failed to update admin user:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
