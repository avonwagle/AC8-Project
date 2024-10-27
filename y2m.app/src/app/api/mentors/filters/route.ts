import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Fetch distinct options for filters
    const specializationOptions = await db
      .selectFrom('User')
      .select('specialization')
      .distinct()
      .where('isMentor', '=', true)
      .execute();

    const availabilityOptions = await db
      .selectFrom('User')
      .select('availability')
      .distinct()
      .where('isMentor', '=', true)
      .execute();

    const priceOptions = await db
      .selectFrom('User')
      .select('price')
      .distinct()
      .where('isMentor', '=', true)
      .execute();

    const ratingOptions = await db
      .selectFrom('User')
      .select('rating')
      .distinct()
      .where('isMentor', '=', true)
      .execute();

    const countryOptions = await db
      .selectFrom('User')
      .select('country')
      .distinct()
      .where('isMentor', '=', true)
      .execute();

    return NextResponse.json(
      {
        specialization: specializationOptions.map((opt) => opt.specialization),
        availability: availabilityOptions.map((opt) => opt.availability),
        price: priceOptions.map((opt) => opt.price),
        country: countryOptions.map((opt) => opt.country),
        rating: ratingOptions.map((opt) => opt.rating),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
