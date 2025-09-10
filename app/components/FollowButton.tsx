'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FollowButtonProps {
  targetUserId: string;
  isFollowingInitial: boolean; // <-- THE MISSING PROPERTY
}

export default function FollowButton({ targetUserId, isFollowingInitial }: FollowButtonProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);
  const [isPending, setIsPending] = useState(false);

  const follow = async () => {
    setIsPending(true);
    const res = await fetch('/api/follow', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      setIsFollowing(true);
      router.refresh(); // Refresh the page to update follower counts
    }
    setIsPending(false);
  };

  const unfollow = async () => {
    setIsPending(true);
    const res = await fetch('/api/follow', {
      method: 'DELETE',
      body: JSON.stringify({ targetUserId }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      setIsFollowing(false);
      router.refresh(); // Refresh the page to update follower counts
    }
    setIsPending(false);
  };

  if (isFollowing) {
    return (
      <button
        onClick={unfollow}
        disabled={isPending}
        className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
      >
        {isPending ? '...' : 'Unfollow'}
      </button>
    );
  }

  return (
    <button
      onClick={follow}
      disabled={isPending}
      className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
    >
      {isPending ? '...' : 'Follow'}
    </button>
  );
}
