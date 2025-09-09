import { PrismaClient } from '@prisma/client';
import StudySpotCard from '@/app/components/StudySpotCard';

const prisma = new PrismaClient();

// --- THIS FUNCTION IS UPDATED ---
async function getStudySpots() {
  const spots = await prisma.studySpot.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    // We are now including related data.
    include: {
      // For each spot, include its reviews...
      reviews: {
        // ...but we only need the 'rating' field to do our calculation.
        // This is more efficient than fetching the full review text.
        select: {
          rating: true,
        },
      },
    },
  });
  return spots;
}

export default async function HomePage() {
  const studySpots = await getStudySpots();

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Discover Your Next Study Spot
        </h1>
        
        <div className="space-y-8">
          {studySpots.map((spot) => (
            <StudySpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </div>
    </main>
  );
}