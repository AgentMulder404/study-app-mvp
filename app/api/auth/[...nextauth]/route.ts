import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import type { Adapter } from 'next-auth/adapters';

const prisma = new PrismaClient();

const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) {
          return null;
        }
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!passwordsMatch) {
          return null;
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  // --- THIS IS THE NEW, CRUCIAL PART ---
  callbacks: {
    // This callback is called whenever a JWT is created or updated.
    async jwt({ token, user }) {
      // The `user` object is only available on the initial sign-in.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // This callback is called whenever a session is checked.
    async session({ session, token }) {
      // We are taking the user ID from the token and adding it to the session object.
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export const { GET, POST } = handlers;
export { auth, signIn, signOut };


