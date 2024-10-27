import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tenant } = req.body; // Get tenant (organization name) from the request body

  // Connect to the main PostgreSQL server
  const pool = new Pool({
    connectionString: process.env.MASTER_DATABASE_URL, // Main connection to manage databases
  });

  try {
    // Step 1: Create a new database for the tenant (organization)
    const createDatabaseQuery = `CREATE DATABASE ${tenant}_db`;
    await pool.query(createDatabaseQuery);

    // Step 2: Create a connection to the newly created tenant database
    const tenantPool = new Pool({
      connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/${tenant}_db`,
    });

    // Step 3: Define the SQL query to create the necessary tables
    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS themes (
        id SERIAL PRIMARY KEY,
        backgroundColor VARCHAR(255),
        textColor VARCHAR(255),
        logoUrl VARCHAR(255)
      );
    `;

    // Step 4: Execute the table creation query in the tenant's database
    await tenantPool.query(createTablesQuery);

    res
      .status(200)
      .json({ message: `Database and tables for tenant ${tenant} created successfully.` });
  } catch (error) {
    console.error('Error creating tenant database:', error);
    res.status(500).json({ error: 'Failed to create tenant database and tables.' });
  } finally {
    await pool.end();
  }
}
