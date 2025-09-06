import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Get all users who don't have notification preferences
  const users = await prisma.user.findMany({
    where: {
      notificationPreference: null,
    },
    select: {
      id: true,
    },
  });

  console.log(`Found ${users.length} users without notification preferences`);

  // Create default preferences for each user
  for (const user of users) {
    try {
      await prisma.notificationPreference.create({
        data: {
          userId: user.id,
          // All notifications enabled by default
          emailEnabled: true,
          pushEnabled: true,
          inAppEnabled: true,
          queryUpdates: true,
          comments: true,
          likes: true,
          shares: true,
          mentions: true,
          assignments: true,
          statusChanges: true,
          weeklyDigest: true,
          marketing: false, // Disabled by default
        },
      });
      console.log(`Created notification preferences for user ${user.id}`);
    } catch (error) {
      console.error(`Error creating preferences for user ${user.id}:`, error);
    }
  }

  console.log('Completed adding default notification preferences');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
