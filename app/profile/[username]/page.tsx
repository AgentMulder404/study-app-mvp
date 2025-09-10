import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { auth } from '@/app/auth'; // <-- UPDATED IMPORT PATH
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
      // Count how many people this user is following
      following: true,
      // Count how many people are following this user
      followers: true,
    },
  });

  if (!user) return null;

  // Check if the currently logged-in user is already following this profile's user
  const isFollowing = currentUserId
    ? !!(await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      }))
    : false;

  return { ...user, isFollowing };
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const session = await auth();
  const currentUserId = session?.user?.id;
  const username = decodeURIComponent(params.username);
  const user = await getProfileData(username, currentUserId);

  if (!user) {
    return <div className="text-center p-8">User not found</div>;
  }
  
  const isOwnProfile = currentUserId === user.id;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-5xl mr-0 sm:mr-6 mb-4 sm:mb-0 flex-shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h1 className="text-3xl font-extrabold text-gray-900">{user.username}</h1>
              <div className="flex justify-center sm:justify-start space-x-4 mt-2 text-gray-600">
                <span><span className="font-bold">{user.reviews.length}</span> Reviews</span>
                <span><span className="font-bold">{user.followers.length}</span> Followers</span>
                <span><span className="font-bold">{user.following.length}</span> Following</span>
              </div>
            </div>
            {!isOwnProfile && currentUserId && (
              <div className="mt-4 sm:mt-0">
                <FollowButton
                  targetUserId={user.id}
                  isFollowingInitial={user.isFollowing}
                />
              </div>
            )}
          </div>
        </div>

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

