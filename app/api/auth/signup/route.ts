// src/app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 1. Extract the body from the incoming request
    const body = await request.json();
    const { email, username, password } = body;

    // 2. Validate the incoming data
    if (!email || !username || !password) {
      return new NextResponse('Missing email, username, or password', { status: 400 });
    }

    // 3. Check if the user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      return new NextResponse('User with this email or username already exists', { status: 409 }); // 409 Conflict
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // 6. Return the newly created user (without the password)
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('[SIGNUP_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}