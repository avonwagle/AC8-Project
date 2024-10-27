import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { organizationId: string } }) {
  try {
    const mainDb = db; // Use `db` directly without calling it as a function

    await mainDb
      .updateTable('Organization')
      .set({ isactive: false })
      .where('id', '=', parseInt(params.organizationId, 10))
      .executeTakeFirstOrThrow();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deactivating organization:', error);
    return NextResponse.json({ message: 'Failed to deactivate organization' }, { status: 500 });
  }
}
