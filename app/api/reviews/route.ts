import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/app/auth'; // <-- UPDATED IMPORT PATH

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const body = await request.json();
    const { content, rating, spotId } = body;

    if (!content || !rating || !spotId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating must be a number between 1 and 5' }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        content,
        rating,
        spotId,
        userId,
      },
    });

    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    console.error('[REVIEWS_POST_ERROR]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}