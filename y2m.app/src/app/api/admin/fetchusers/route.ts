// src/app/api/admin/fetchusers/route.ts
import { db } from '@/lib/db'; // Your Kysely database instance

export async function GET() {
  try {
    // Querying the database to fetch all users
    const users = await db
      .selectFrom('User') // Selecting from the 'User' table
      .select([
        'id',
        'name',
        'email', // Include email here
        'aboutMe',
        'profilePictureURL',
        'isMentor',
        'isMentee',
        'country',
        'role',
      ])
      .execute();

    // Return the list of users as a JSON response
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to retrieve users.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
