import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your Kysely DB setup

export async function GET() {
  try {
    // Fetch all categories
    const categories = await db
      .selectFrom('Category')
      .select(['Category.id', 'Category.name'])
      .execute();

    if (categories.length === 0) {
      return NextResponse.json({ success: false, message: 'No categories found.' });
    }

    // Return the list of categories
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch categories.' });
  }
}
