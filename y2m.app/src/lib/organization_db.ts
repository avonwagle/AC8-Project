import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from '@/types/db'; // Assuming DB interface is already defined

// Create a connection to the main database to query the Organization table
const mainDbPool = new Pool({
  connectionString: process.env.DATABASE_URL, // Main site's database URL from .env.local
});

// Helper function to get the tenant's database URL and database name based on the subdomain
async function getTenantDatabaseInfo(
  subdomain: string
): Promise<{ databaseUrl: string; databaseName: string } | null> {
  const client = await mainDbPool.connect();

  try {
    const result = await client.query(
      'SELECT "databaseurl", "databasename" FROM "Organization" WHERE "subdomain" = $1 AND "isactive" = true',
      [subdomain]
    );

    if (result.rows.length === 0) {
      return null; // No matching tenant or inactive tenant
    }

    // Return the tenant's database URL and database name
    return {
      databaseUrl: result.rows[0].databaseUrl,
      databaseName: result.rows[0].databaseName,
    };
  } finally {
    client.release();
  }
}

// Function to create a tenant-specific database connection
export async function tenantDb(subdomain: string): Promise<Kysely<DB>> {
  const tenantInfo = await getTenantDatabaseInfo(subdomain);

  if (!tenantInfo) {
    throw new Error(`No active organization found for subdomain: ${subdomain}`);
  }

  const { databaseUrl, databaseName } = tenantInfo;

  console.log(`Connecting to ${databaseName} for subdomain ${subdomain}`);

  // Connect to the tenant-specific database using Kysely and pg
  const tenantDialect = new PostgresDialect({
    pool: new Pool({
      connectionString: databaseUrl, // Use the tenant's database URL
    }),
  });

  // Database interface is passed to Kysely's constructor, and from now on, Kysely
  // knows your database structure.
  return new Kysely<DB>({
    dialect: tenantDialect,
  });
}
