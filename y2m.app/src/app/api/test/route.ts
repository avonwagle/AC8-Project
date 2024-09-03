// pages/api/badges.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('X-User-Id'); // Optional, if you need user-specific data
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
  }

  try {
    const badges = await db
      .selectFrom('Badge')
      .selectAll()
      .where('userId', '=', userId) // If you need badges for a specific user
      .execute();

    return NextResponse.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
