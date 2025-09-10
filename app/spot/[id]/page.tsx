import { PrismaClient } from '@prisma/client';
import { auth } from '@/app/auth'; // <-- THE CORRECTED IMPORT PATH
import CreateReviewForm from '@/app/components/CreateReviewForm';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getSpotDetails(id: string) {
  const spot = await prisma.studySpot.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  return spot;
}

export default async function SpotDetailPage({ params }: { params: { id: string } }) {
  const spot = await getSpotDetails(params.id);
  const session = await auth();

  if (!spot) {
    return <div>Spot not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">{spot.name}</h1>
          <p className="mt-2 text-lg text-gray-600">{spot.address}</p>
          <span className="mt-4 inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
            {spot.type}
          </span>
        </div>

        {/* Review Form Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Leave a Review</h2>
          {session?.user ? (
            <CreateReviewForm spotId={spot.id} />
          ) : (
            <p className="text-gray-600">
              You must be{' '}
              <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
                logged in
              </Link>{' '}
              to leave a review.
            </p>
          )}
        </div>

        {/* Reviews List Section */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Reviews ({spot.reviews.length})
          </h2>
          <div className="space-y-6">
            {spot.reviews.length > 0 ? (
              spot.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold mr-3">
                      {review.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <Link href={`/profile/${review.user.username}`} className="font-semibold text-gray-800 hover:underline">
                        {review.user.username}
                      </Link>
                      <div className="flex items-center text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Be the first to leave a review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

