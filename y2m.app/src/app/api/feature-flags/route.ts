import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Pool } from 'pg';

// Initialize the PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Define the type for feature flags
type FeatureFlag = {
  organizationId: string;
  featureName: string;
  isEnabled: boolean;
};

// GET method to fetch all feature flags
export async function GET() {
  try {
    // Fetch all feature flags
    const featureFlagsQuery = `
      SELECT "organizationId", "featureName", "isEnabled"
      FROM "FeatureFlag";
    `;
    const featureFlagsResult = await pool.query<FeatureFlag>(featureFlagsQuery);

    // Check if any rows were returned
    if (featureFlagsResult.rows.length === 0) {
      console.warn('No feature flags found');
      return NextResponse.json({ message: 'No feature flags found' }, { status: 404 });
    }

    // Return the feature flags as a JSON response
    return NextResponse.json({ featureFlags: featureFlagsResult.rows });
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST method to update a feature flag status
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { organizationId, featureName, isEnabled } = await req.json();

    // Validate the input
    if (!organizationId || !featureName || typeof isEnabled !== 'boolean') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Update the feature flag in the database
    const updateQuery = `
      UPDATE "FeatureFlag"
      SET "isEnabled" = $1, "updatedAt" = now()
      WHERE "organizationId" = $2 AND "featureName" = $3
      RETURNING *;
    `;
    const updateResult = await pool.query<FeatureFlag>(updateQuery, [
      isEnabled,
      organizationId,
      featureName,
    ]);

    if (updateResult.rowCount === 0) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    // Return the updated feature flag as a response
    return NextResponse.json({ success: true, feature: updateResult.rows[0] });
  } catch (error) {
    console.error('Error updating feature flag:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
