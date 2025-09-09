// src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validate incoming data
    if (!email || !password) {
      return new NextResponse('Missing email or password', { status: 400 });
    }

    // 2. Find the user in the database by their email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // 3. If user doesn't exist, or password doesn't match, send error
    //    We use a generic error message for security reasons.
    if (!user) {
      return new NextResponse('Invalid credentials', { status: 401 }); // 401 Unauthorized
    }
    
    // 4. Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return new NextResponse('Invalid credentials', { status: 401 }); // 401 Unauthorized
    }

    // 5. If login is successful, return the user (without the password)
    //    In a real app, this is where you'd create a session token (e.g., JWT)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 200 }); // 200 OK

  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}