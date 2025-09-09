import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import FollowButton from '@/app/components/FollowButton';

const prisma = new PrismaClient();

async function getProfileData(username: string, currentUserId?: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: { spot: true },
      },
      // Include the counts of followers and following
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) return { user: null, isFollowing: false };

  // Check if the current logged-in user is following this profile user
  let isFollowing = false;
  if (currentUserId && currentUserId !== user.id) {
    const followRecord = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!followRecord;
  }

  return { user, isFollowing };
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const session = await auth();
  const currentUserId = session?.user?.id;
  const username = decodeURIComponent(params.username);

  const { user, isFollowing } = await getProfileData(username, currentUserId);

  if (!user) {
    return <div className="text-center p-8">User not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* User Info Header */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-4xl mr-6">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">{user.username}</h1>
                <div className="flex items-center space-x-4 text-gray-500 mt-1">
                  <span>{user.reviews.length} reviews</span>
                  <span>{user._count.followers} followers</span>
                  <span>{user._count.following} following</span>
                </div>
              </div>
            </div>
            {/* Show FollowButton if logged in and not viewing own profile */}
            {currentUserId && currentUserId !== user.id && (
              <FollowButton targetUserId={user.id} initialIsFollowing={isFollowing} />
            )}
          </div>
        </div>

        {/* User's Reviews List */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            All Reviews by {user.username}
          </h2>
          <div className="space-y-6">
            {user.reviews.length > 0 ? (
              user.reviews.map((review) => (
                <div key={review.id} className="border-t border-gray-200 pt-6">
                  <div className="mb-2">
                    <p className="font-semibold text-lg text-gray-800">
                      Reviewed{' '}
                      <Link href={`/spot/${review.spot.id}`} className="text-indigo-600 hover:underline">
                        {review.spot.name}
                      </Link>
                    </p>
                    <div className="flex items-center text-yellow-400 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">This user hasn't written any reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}