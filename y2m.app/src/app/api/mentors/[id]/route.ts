import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const mentorId = params.id;

  try {
    // Fetch mentor details
    const mentor = await db
      .selectFrom('User')
      .selectAll()
      .where('id', '=', mentorId)
      .where('isMentor', '=', true)
      .executeTakeFirst();

    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
    }

    // Fetch associated data (skills, education, reviews)
    const [skills, education, reviews] = await Promise.all([
      db.selectFrom('Skill').selectAll().where('userId', '=', mentorId).execute(),
      db.selectFrom('Education').selectAll().where('userId', '=', mentorId).execute(),
      db.selectFrom('Review').selectAll().where('mentorId', '=', mentorId).execute(),
    ]);

    // Return the consolidated data
    return NextResponse.json({ mentor, skills, education, reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching mentor details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
