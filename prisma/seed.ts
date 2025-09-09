import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const spots = await prisma.studySpot.createMany({
    data: [
      {
        name: 'The Code & Coffee',
        address: '123 Tech Avenue, Silicon Valley, CA',
        latitude: 37.3861,
        longitude: -122.0839,
        type: 'Cafe',
      },
      {
        name: 'Library of Alexandria 2.0',
        address: '456 Wisdom Way, Knowledge City, CA',
        latitude: 34.0522,
        longitude: -118.2437,
        type: 'Library',
      },
      {
        name: 'The Focus Factory',
        address: '789 Productivity Place, Hustle Hub, CA',
        latitude: 37.7749,
        longitude: -122.4194,
        type: 'Workspace',
      },
      {
        name: 'Quiet Corner Cafe',
        address: '101 Study Street, Readsville, CA',
        latitude: 34.1557,
        longitude: -118.4477,
        type: 'Cafe',
      },
      {
        name: 'The Graduate Grind',
        address: '222 University Blvd, Campus Town, CA',
        latitude: 33.6405,
        longitude: -117.8443,
        type: 'Cafe',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${spots.count} new study spots. 🌱`);
  console.log('Database has been seeded. ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });