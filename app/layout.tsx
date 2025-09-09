// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from './components/AuthProvider';
import Navbar from './components/Navbar'; // <-- IMPORT NAVBAR

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Study App',
  description: 'Find your next study spot.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar /> {/* <--- ADD NAVBAR HERE */}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}