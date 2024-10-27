// src/app/api/admin/deleteuser/[id]/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // Get the last segment of the URL

  // Validate that ID is not null or empty
  if (!id) {
    return new Response(JSON.stringify({ error: 'Invalid user ID.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Use the string ID directly in the query
    await db.deleteFrom('User').where('id', '=', id).execute();

    return new Response(JSON.stringify({ message: 'User deleted successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete user.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
