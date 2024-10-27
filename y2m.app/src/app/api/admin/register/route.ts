import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Main database connection
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json(); // Extract role from the request

    if (!email || !password) {
      // Ensure role is included
      return NextResponse.json({ error: 'Missing email, password, or role' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db
      .selectFrom('AdminUser')
      .select(['email'])
      .where('email', '=', email)
      .executeTakeFirst();

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password before saving it
    const hashedPassword = await hashPassword(password);

    // Insert new user into the AdminUser table
    await db
      .insertInto('AdminUser')
      .values({
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .execute();

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Registration successful' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error registering user:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: `Failed to register user: ${errorMessage}` },
      { status: 500 }
    );
  }
}
