import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Handle GET request to fetch all organizations
export async function GET() {
  try {
    const organizations = await db.selectFrom('Organization').selectAll().execute();

    return NextResponse.json({ data: organizations.length ? organizations : [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}
