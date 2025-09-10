import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { auth } from '@/app/auth';
import FollowButton from '@/app/components/FollowButton';

const prisma = new PrismaClient();

// Define a clear type for the component's props
interface ProfilePageProps {
  params: {
    username: string;
  };
}

async function getProfileData(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      reviews: {
        orderBy: { createdAt: 'desc' },
        include: { spot: true },
      },
      // Also fetch the counts for followers and following
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });
  return user;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const username = decodeURIComponent(params.username);

  // Fetch both the profile user and the currently logged-in user in parallel
  const [user, session] = await Promise.all([
    getProfileData(username),
    auth(),
  ]);

  if (!user) {
    return <div className="text-center p-8">User not found</div>;
  }

  const currentUserId = session?.user?.id;
  
  // Determine if the current user is already following this profile's user
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* User Info Header */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-4xl mr-6">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">{user.username}</h1>
                <div className="flex space-x-4 text-gray-500 mt-2">
                  <span><span className="font-bold">{user._count.followers}</span> followers</span>
                  <span><span className="font-bold">{user._count.following}</span> following</span>
                </div>
              </div>
            </div>
            {/* Show follow button if logged in and not viewing your own profile */}
            {currentUserId && currentUserId !== user.id && (
              <FollowButton
                targetUserId={user.id}
                isFollowingInitial={isFollowing}
              />
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

