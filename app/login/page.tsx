'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // This import is for the new V5 function

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // This is the new V5 way to call the sign-in function
      const res = await signIn('credentials', {
        redirect: false, // We handle the redirect manually
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid Credentials');
        return;
      }

      // On success, refresh and push to the homepage
      router.replace('/');
      router.refresh(); // This helps update the navbar
    } catch (error) {
      console.error(error);
      setError('Something went wrong.');
    }
  };

  // The JSX for the form remains the same
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          {error && <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>}
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
        </form>
      </div>
    </div>
  );
}
