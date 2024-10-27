import { NextRequest, NextResponse } from 'next/server';
import { registerAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const newUser = await registerAdmin(email, password);
    return NextResponse.json({ success: true, newUser });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
