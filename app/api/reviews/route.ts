import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // --- DEBUG LOG 1: Check if the API is being hit ---
  console.log('\n--- REVIEW API ENDPOINT HIT ---');

  try {
    const session = await auth();

    // --- DEBUG LOG 2: See what the session object looks like ---
    console.log('SESSION OBJECT:', session);

    if (!session?.user?.id) {
      console.log('Authentication failed: No session or user ID found.');
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const userId = session.user.id;
    console.log('Authenticated user ID:', userId);

    const body = await request.json();

    // --- DEBUG LOG 3: See what data the form is sending ---
    console.log('INCOMING REQUEST BODY:', body);

    const { content, rating, spotId } = body;

    if (!content || !rating || !spotId) {
      console.log('Validation failed: Missing required fields.');
      return new NextResponse('Missing required fields', { status: 400 });
    }

    console.log('Data validated. Attempting to create review in database...');

    const newReview = await prisma.review.create({
      data: {
        content,
        rating,
        spotId,
        userId,
      },
    });

    // --- DEBUG LOG 4: Confirm that the review was created ---
    console.log('SUCCESS: Review created in database:', newReview);

    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    // --- DEBUG LOG 5: Catch any unexpected errors ---
    console.error('!!! CATCH BLOCK ERROR IN REVIEW API !!!:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}