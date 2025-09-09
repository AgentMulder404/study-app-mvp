'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
}

export default function FollowButton({ targetUserId, initialIsFollowing }: FollowButtonProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdToFollow: targetUserId }),
      });
      if (res.ok) {
        setIsFollowing(true);
        router.refresh(); // Refresh the page to update follower counts
      }
    } catch (error) {
      console.error('Failed to follow user', error);
    }
    setIsLoading(false);
  };

  const handleUnfollow = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/follow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdToUnfollow: targetUserId }),
      });
      if (res.ok) {
        setIsFollowing(false);
        router.refresh(); // Refresh the page to update follower counts
      }
    } catch (error) {
      console.error('Failed to unfollow user', error);
    }
    setIsLoading(false);
  };

  if (isFollowing) {
    return (
      <button
        onClick={handleUnfollow}
        disabled={isLoading}
        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
      >
        {isLoading ? '...' : 'Unfollow'}
      </button>
    );
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
    >
      {isLoading ? '...' : 'Follow'}
    </button>
  );
}