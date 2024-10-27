import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Ensure the path to your Kysely db instance is correct

// POST handler (named export)
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { mentorId, title, content } = body;

    // Basic validation
    if (!mentorId || !title || !content) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Insert into the database
    const successStory = await db
      .insertInto('SuccessStory')
      .values({
        mentorId,
        title,
        content,
        isApproved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning(['id', 'mentorId', 'title', 'content', 'isApproved', 'createdAt', 'updatedAt'])
      .executeTakeFirst();

    return NextResponse.json(successStory, { status: 201 });
  } catch (error) {
    console.error('Error creating success story:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
