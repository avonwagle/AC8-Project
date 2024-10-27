import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Database connection

interface Certificate {
  id: string; // Expecting string
  issuedAt: string; // Change Date to string
  userId: string;
  assessmentTitle: string | null; // Allow null for optional titles
}

interface ApiResponse {
  success: boolean;
  message?: string;
  certificates?: Certificate[];
}

// Fetch all certificates
export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // Fetch userId

    // Validate that the userId is provided
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
    }

    // Get all certificates with related assessment data for the given userId
    const certificates = await db
      .selectFrom('Certificate')
      .leftJoin('Assessment', 'Certificate.assessmentId', 'Assessment.id') // Join with the Assessment table
      .select([
        'Certificate.id',
        'Certificate.issuedAt',
        'Certificate.userId', // Ensure this is consistent with your database schema
        'Assessment.title as assessmentTitle', // Include the title of the assessment
      ])
      .where('Certificate.userId', '=', userId) // Fetch certificates for the given userId
      .execute();

    // Handle case where no certificates are found
    if (certificates.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No certificates found for this user' },
        { status: 404 }
      );
    }

    // Convert id to string and format issuedAt as a string in the response
    const formattedCertificates = certificates.map((cert) => ({
      id: cert.id.toString(), // Convert id to string
      issuedAt: new Date(cert.issuedAt).toISOString(), // Format issuedAt as a string
      userId: cert.userId,
      assessmentTitle: cert.assessmentTitle,
    }));

    // Return the certificates in a successful response
    return NextResponse.json({ success: true, certificates: formattedCertificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
