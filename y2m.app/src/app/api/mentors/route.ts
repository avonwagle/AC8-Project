// src/app/api/mentors/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const mentors = await db
      .selectFrom('User')
      .selectAll()
      .where('isMentor', '=', true)
      .execute();

    return NextResponse.json(mentors, { status: 200 });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
