import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// --- HANDLER FOR FOLLOWING A USER ---
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const currentUserId = session.user.id;

  try {
    const body = await request.json();
    const { userIdToFollow } = body;

    if (!userIdToFollow) {
      return new NextResponse('User ID to follow is required', { status: 400 });
    }

    if (currentUserId === userIdToFollow) {
      return new NextResponse("You cannot follow yourself", { status: 400 });
    }

    // Create a new record in the Follows table
    const follow = await prisma.follows.create({
      data: {
        followerId: currentUserId,
        followingId: userIdToFollow,
      },
    });

    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    console.error('[FOLLOW_POST_ERROR]', error);
    // Handle cases where the follow relationship already exists
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        return new NextResponse('You are already following this user', { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// --- HANDLER FOR UNFOLLOWING A USER ---
export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const currentUserId = session.user.id;

  try {
    const body = await request.json();
    const { userIdToUnfollow } = body;

    if (!userIdToUnfollow) {
      return new NextResponse('User ID to unfollow is required', { status: 400 });
    }

    // Delete the record from the Follows table
    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userIdToUnfollow,
        },
      },
    });

    return new NextResponse('Successfully unfollowed', { status: 200 });
  } catch (error) {
    console.error('[FOLLOW_DELETE_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
