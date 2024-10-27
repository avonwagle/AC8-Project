import { NextRequest, NextResponse } from 'next/server';
import { loginAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const user = await loginAdmin(email, password);
    // Set session or token here (implementation depends on your auth mechanism)
    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
