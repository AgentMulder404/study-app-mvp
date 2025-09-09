import type { StudySpot, Review } from '@prisma/client';
import Link from 'next/link';

// The 'spot' prop now includes an array of its reviews
interface StudySpotCardProps {
  spot: StudySpot & {
    reviews: Pick<Review, 'rating'>[];
  };
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'cafe': return 'bg-amber-100 text-amber-800';
    case 'library': return 'bg-blue-100 text-blue-800';
    case 'workspace': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function StudySpotCard({ spot }: StudySpotCardProps) {
  // Calculate the average rating and review count
  const reviewCount = spot.reviews.length;
  const averageRating = reviewCount > 0
    ? spot.reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
    : 0;
  
  const roundedRating = Math.round(averageRating);

  return (
    <Link href={`/spot/${spot.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Image coming soon</span>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900 truncate pr-4">
              {spot.name}
            </h2>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getTypeColor(spot.type)}`}>
              {spot.type}
            </span>
          </div>
          <p className="mt-2 text-gray-600">{spot.address}</p>
          
          {/* Display the dynamic rating */}
          <div className="mt-4 flex items-center">
            {reviewCount > 0 ? (
              <>
                <div className="flex items-center text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < roundedRating ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-500 text-sm">
                  {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </>
            ) : (
              <span className="text-gray-500 text-sm">(No reviews yet)</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}