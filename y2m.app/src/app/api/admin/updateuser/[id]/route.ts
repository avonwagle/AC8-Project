import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // Get the last segment of the URL

  // Ensure id is a string
  const userId = id as string;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Invalid user ID.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Extract name, email, isMentor, isMentee from the request body
  const { name, email, isMentor, isMentee } = await req.json();

  try {
    // Update the user data in the database
    await db
      .updateTable('User')
      .set({
        name,
        email,
        isMentor: isMentor || false, // Ensure the correct mentor/mentee values are set
        isMentee: isMentee || false,
      })
      .where('id', '=', userId) // userId is now a string
      .execute();

    return new Response(JSON.stringify({ message: 'User updated successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Failed to update user.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
