// src/app/api/admin/login/route.ts
import { loginAdmin } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Authenticate the admin user
    const admin = await loginAdmin(email, password);

    if (admin) {
      // Include the user's role in the response
      return NextResponse.json(
        { success: true, email: admin.email, role: admin.role, message: 'Login successful' },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error: unknown) {
    console.error('Error logging in:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: `Failed to log in: ${errorMessage}` }, { status: 500 });
  }
}
