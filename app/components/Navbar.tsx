// src/app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            StudyApp
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-4">
            {status === 'loading' && (
              <p className="text-gray-500">Loading...</p>
            )}

            {status === 'unauthenticated' && (
              <>
                <Link href="/login" className="text-gray-600 hover:text-indigo-600">
                  Login
                </Link>
                <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Sign Up
                </Link>
              </>
            )}

            {status === 'authenticated' && (
              <>
                <span className="text-gray-700">{session.user?.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}