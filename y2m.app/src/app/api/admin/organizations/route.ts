import { NextRequest, NextResponse } from 'next/server';
import { createOrganizationDatabase } from '@/lib/organization-db-manager';
import { addCallbackURL } from '@/lib/auth0-manager';
import { Pool } from 'pg';

// Initialize the PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Define default features for the organization
const defaultFeatures = [
  'Skill Assessment',
  'Mentor Marketplace',
  'Video Call',
  'Discussion Forum',
  'AI Chatbot',
  'Development Hub',
  'My SKills',
  'Enterprise Solution',
];

export async function POST(req: NextRequest) {
  try {
    const { organizationName, domain, subdomain, contactEmail } = await req.json();
    console.log('Received data:', { organizationName, domain, subdomain, contactEmail });

    // Ensure required fields are present
    if (!organizationName || !domain || !contactEmail || !subdomain) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-zA-Z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      console.log('Invalid subdomain format');
      return NextResponse.json({ error: 'Invalid subdomain format.' }, { status: 400 });
    }

    // Check if the organization already exists
    console.log('Checking if organization exists...');
    const checkQuery = 'SELECT id FROM "Organization" WHERE LOWER(organizationname) = LOWER($1)';
    const existingOrganization = await pool.query(checkQuery, [organizationName]);

    let organizationId: number;

    if (existingOrganization.rows.length > 0) {
      console.log(`Organization "${organizationName}" already exists`);
      organizationId = existingOrganization.rows[0].id;
    } else {
      // Create the database for the organization
      console.log('Creating organization database...');
      let databaseUrl;
      try {
        databaseUrl = await createOrganizationDatabase(
          organizationName,
          domain,
          subdomain,
          contactEmail
        );
      } catch (err) {
        console.error('Error creating organization database:', err);
        return NextResponse.json(
          { error: 'Failed to create database for the organization.' },
          { status: 500 }
        );
      }

      // Insert the new organization into the main database
      console.log('Inserting organization into database...');
      const insertOrganizationQuery = `
        INSERT INTO "Organization" (organizationname, domain, subdomain, contactemail, databaseurl, isactive, createdat, updatedat)
        VALUES ($1, $2, $3, $4, $5, true, now(), now())
        ON CONFLICT (organizationname) DO NOTHING
        RETURNING id;
      `;
      const newOrganization = await pool.query(insertOrganizationQuery, [
        organizationName,
        domain,
        subdomain,
        contactEmail,
        databaseUrl,
      ]);

      if (newOrganization.rows.length > 0) {
        console.log(`New organization inserted with ID: ${newOrganization.rows[0].id}`);
        organizationId = newOrganization.rows[0].id;
      } else {
        console.log(`Organization "${organizationName}" already exists, retrieving its ID.`);
        const existingOrg = await pool.query(checkQuery, [organizationName]);
        organizationId = existingOrg.rows[0].id;
      }
    }

    // Insert or update default features for the organization
    if (organizationId) {
      console.log(`Adding default features for organization ID: ${organizationId}`);
      for (const featureName of defaultFeatures) {
        try {
          // Check if the feature already exists for this organization
          const featureCheckQuery = `
            SELECT 1 FROM "FeatureFlag" 
            WHERE "organizationId" = $1 AND "featureName" = $2
          `;
          const featureExists = await pool.query(featureCheckQuery, [organizationId, featureName]);

          if (featureExists.rows.length === 0) {
            // Feature does not exist; insert it
            await pool.query(
              `
                INSERT INTO "FeatureFlag" ("organizationId", "featureName", "isEnabled", "createdAt", "updatedAt")
                VALUES ($1, $2, true, now(), now());
              `,
              [organizationId, featureName]
            );
            console.log(`Added feature "${featureName}" for organization "${organizationName}".`);
          } else {
            console.log(
              `Feature "${featureName}" for organization "${organizationName}" already exists. Skipping.`
            );
          }
        } catch (error) {
          console.error(
            `Error adding feature "${featureName}" for organization "${organizationName}" (ID: ${organizationId}):`,
            error
          );
        }
      }
    }

    // Call Auth0 to dynamically add the callback URL for the new subdomain
    console.log(`Updating Auth0 callback URL for subdomain "${subdomain}"...`);
    try {
      await addCallbackURL(subdomain); // Update Auth0 callback for the subdomain
      console.log('Auth0 callback URL updated successfully');
    } catch (error) {
      const auth0Error = error as { response?: { status?: number } };
      if (auth0Error.response && auth0Error.response.status === 409) {
        console.log(`Callback URL for subdomain "${subdomain}" already exists, skipping.`);
      } else {
        console.error('Error adding callback URL to Auth0:', auth0Error);
        return NextResponse.json(
          { error: `Failed to add callback URL for subdomain: ${subdomain}.` },
          { status: 500 }
        );
      }
    }

    // Return success response
    return NextResponse.json(
      { success: true, message: `Organization "${organizationName}" created successfully.` },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error creating organization:', error);
    return NextResponse.json({ error: 'Failed to create organization.' }, { status: 500 });
  }
}
