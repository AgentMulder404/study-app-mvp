'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// This component needs to know which spot it's for.
interface CreateReviewFormProps {
  spotId: string;
}

export default function CreateReviewForm({ spotId }: CreateReviewFormProps) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (rating === 0) {
      setError('Please select a star rating.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          rating,
          spotId,
        }),
      });

      if (res.ok) {
        // Reset form and refresh the page to show the new review
        setContent('');
        setRating(0);
        router.refresh(); 
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className={`cursor-pointer text-4xl ${
                (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Your Review
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="What did you think of this spot?"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
