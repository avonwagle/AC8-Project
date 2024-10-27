import { NextResponse } from 'next/server'; // Import NextResponse for returning responses
import { db } from '@/lib/db'; // Adjust the import based on your project structure

// Define the GET method as a named export
export async function GET() {
  try {
    // Fetch all users from the AdminUser table
    const users = await db
      .selectFrom('AdminUser') // Ensure this matches your table name
      .selectAll()
      .execute();

    // Return the users in the response
    return NextResponse.json({ success: true, users }); // Use NextResponse.json for response
  } catch (error) {
    console.error('Failed to fetch admin users:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
