import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const assessments = await db.selectFrom('Assessment').selectAll().execute();
    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ message: 'Error fetching assessments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, objective, duration, categoryId } = await req.json();

    if (!title || !description || !objective || !duration || !categoryId) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    const insertedAssessment = await db
      .insertInto('Assessment')
      .values({
        title,
        description,
        objective,
        duration,
        categoryId,
      })
      .returning('id')
      .executeTakeFirst();

    return NextResponse.json(insertedAssessment, { status: 201 });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json({ message: 'Error creating assessment' }, { status: 500 });
  }
}
