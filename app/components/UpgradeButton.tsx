'use client';

import { useState } from 'react';

export default function UpgradeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgradeClick = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 1. Send a request to our backend API to create a checkout session
      const res = await fetch('/api/checkout', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to create checkout session.');
      }

      // 2. Get the checkout session URL from the response
      const { url } = await res.json();
      if (!url) {
        throw new Error('Could not get checkout URL.');
      }

      // 3. Redirect the user to the Stripe checkout page
      window.location.href = url;

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleUpgradeClick}
        disabled={isLoading}
        className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Upgrade for $25.00'}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}