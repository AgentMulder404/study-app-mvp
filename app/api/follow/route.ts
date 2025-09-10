import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/app/auth'; // <-- THE CORRECTED IMPORT PATH

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const currentUserId = session.user.id;
  const { targetUserId } = await request.json();

  if (currentUserId === targetUserId) {
    return new NextResponse("You cannot follow yourself", { status: 400 });
  }

  try {
    await prisma.follows.create({
      data: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("FOLLOW_ERROR", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const currentUserId = session.user.id;
  const { targetUserId } = await request.json();

  try {
    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("UNFOLLOW_ERROR", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}