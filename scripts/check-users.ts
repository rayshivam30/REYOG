import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log('Users in database:');
    console.table(users);
    
    // Check specific demo accounts
    const demoEmails = [
      'admin@reyog.gov.in',
      'bhopal.staff@reyog.gov.in',
      'sehore.staff@reyog.gov.in',
      'ramesh.voter@gmail.com'
    ];
    
    console.log('\nChecking demo accounts:');
    for (const email of demoEmails) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { email: true, name: true, role: true }
      });
      console.log(`${email}:`, user ? '✅ Found' : '❌ Not found');
    }
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
