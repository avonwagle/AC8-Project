// app/api/admin/certificates/route.ts

import { db } from '@/lib/db'; // Ensure this imports the correct db instance with Kysely
import { NextResponse } from 'next/server'; // Use NextResponse instead of NextApiResponse

// Named export for the GET method
export async function GET() {
  try {
    // Fetch certificates with related user and assessment information directly from the Certificate model
    const certificates = await db
      .selectFrom('Certificate') // Ensure the table name matches the Kysely schema definition
      .select([
        'id', // Certificate ID
        'url', // Certificate URL
        'issuedAt', // When the certificate was issued
        'userId',
        'resultId', // The user ID (already stored in Certificate model)
        'assessmentId', // The assessment ID (already stored in Certificate model)
      ])
      .execute();

    return NextResponse.json({ success: true, certificates }); // Use NextResponse for responses
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
