import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { organizationId: string } }) {
  try {
    const { organizationId } = params;
    const organization = await db
      .selectFrom('Organization')
      .selectAll()
      .where('id', '=', parseInt(organizationId))
      .executeTakeFirst();

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json({ organization }, { status: 200 });
  } catch (error) {
    console.error('Error fetching organization details:', error);
    return NextResponse.json({ error: 'Failed to fetch organization details' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { organizationId: string } }) {
  try {
    const { organizationId } = params;
    const { organizationname, domain, subdomain, contactemail } = await req.json();

    await db
      .updateTable('Organization')
      .set({
        organizationname,
        domain,
        subdomain,
        contactemail,
        updatedat: new Date().toISOString(),
      })
      .where('id', '=', parseInt(organizationId))
      .execute();

    return NextResponse.json(
      { success: true, message: 'Organization updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}
