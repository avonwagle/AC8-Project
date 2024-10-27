import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const assessmentId = parseInt(params.id, 10);

  if (isNaN(assessmentId)) {
    return NextResponse.json({ success: false, message: 'Invalid assessment ID' });
  }

  try {
    const assessment = await db
      .selectFrom('Assessment')
      .selectAll()
      .where('Assessment.id', '=', assessmentId)
      .executeTakeFirst();

    if (!assessment) {
      return NextResponse.json({ success: false, message: 'Assessment not found' });
    }

    return NextResponse.json({ success: true, assessment });
  } catch (error) {
    console.error('Error fetching assessment details:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch assessment details' });
  }
}
