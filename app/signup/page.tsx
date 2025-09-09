// src/app/signup/page.tsx

// Because this page uses hooks like useState for user interaction, it must be a Client Component.
'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  // State variables to hold the form input
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter(); // For redirecting the user after successful signup

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission which reloads the page
    setError(''); // Clear previous errors

    // Basic validation
    if (!email || !username || !password) {
      setError('All fields are necessary.');
      return;
    }

    try {
      // Send the data to our API endpoint
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      // Handle the response from the API
      if (res.ok) {
        const form = e.target as HTMLFormElement;
        form.reset(); // Reset form fields
        router.push('/login'); // Redirect to login page on success
        console.log('User registered successfully!');
      } else {
        const data = await res.json();
        setError(data.message || 'Something went wrong.');
        console.error('Error registering user:', data.message);
      }
    } catch (error) {
      setError('Something went wrong.');
      console.error('An error occurred during registration:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}