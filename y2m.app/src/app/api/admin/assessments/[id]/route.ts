// src/app/api/admin/assessments/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Kysely database instance

// Handle GET requests to fetch a specific assessment by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const assessmentId = parseInt(params.id, 10);

  if (isNaN(assessmentId)) {
    return NextResponse.json({ message: 'Invalid assessment ID' }, { status: 400 });
  }

  try {
    const assessment = await db
      .selectFrom('Assessment')
      .selectAll()
      .where('Assessment.id', '=', assessmentId)
      .executeTakeFirst();

    if (!assessment) {
      return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment details:', error);
    return NextResponse.json({ message: 'Failed to fetch assessment details' }, { status: 500 });
  }
}

// Handle PUT requests to update a specific assessment by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const assessmentId = parseInt(params.id, 10);

  if (isNaN(assessmentId)) {
    return NextResponse.json({ message: 'Invalid assessment ID' }, { status: 400 });
  }

  try {
    const body = await req.json(); // Get the request body as JSON
    const { title, description, duration } = body; // Destructure the expected fields

    // Update the assessment in the database
    const updatedAssessment = await db
      .updateTable('Assessment')
      .set({
        title,
        description,
        duration,
      })
      .where('Assessment.id', '=', assessmentId)
      .returningAll() // Get the updated record back
      .executeTakeFirst();

    // If no row is updated, return a 404 status
    if (!updatedAssessment) {
      return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAssessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    return NextResponse.json({ message: 'Error updating assessment' }, { status: 500 });
  }
}
