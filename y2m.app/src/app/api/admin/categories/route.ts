import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your Kysely DB setup

// Handle GET request to fetch categories
export async function GET() {
  try {
    const categories = await db
      .selectFrom('Category')
      .select(['id', 'name']) // Fetch only the necessary fields
      .execute();

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories.' },
      { status: 500 }
    );
  }
}

// Handle POST request to add a new category
export async function POST(request: Request) {
  try {
    const { name } = await request.json(); // Parse the request body

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required.' },
        { status: 400 }
      );
    }

    // Insert the new category into the database
    const newCategory = await db
      .insertInto('Category')
      .values({ name })
      .returning(['id']) // Specify which fields to return
      .execute();

    const categoryId = newCategory[0].id.toString(); // Convert BigInt to string

    return NextResponse.json({
      success: true,
      message: 'Category added successfully.',
      category: { id: categoryId, name },
    });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add category.' },
      { status: 500 }
    );
  }
}
