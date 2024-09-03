// src/app/api/mentors/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const mentorId = params.id;

  try {
    const mentor = await db
      .selectFrom('User')
      .selectAll()
      .where('id', '=', mentorId)
      .where('isMentor', '=', true) // Chained 'where' instead of 'andWhere'
      .executeTakeFirst();

    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });
    }

    return NextResponse.json(mentor, { status: 200 });
  } catch (error) {
    console.error('Error fetching mentor details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
