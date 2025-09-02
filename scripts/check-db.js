const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...');
    
    // Check panchayats
    const panchayats = await prisma.panchayat.findMany();
    console.log(`📍 Panchayats: ${panchayats.length}`);
    panchayats.forEach(p => console.log(`  - ${p.name} (${p.id})`));
    
    // Check departments
    const departments = await prisma.department.findMany();
    console.log(`🏢 Departments: ${departments.length}`);
    departments.forEach(d => console.log(`  - ${d.name} (${d.id})`));
    
    // Check offices
    const offices = await prisma.office.findMany({
      include: {
        department: true,
        panchayat: true
      }
    });
    console.log(`🏛️ Offices: ${offices.length}`);
    offices.forEach(o => console.log(`  - ${o.name} (${o.department.name}, ${o.panchayat.name})`));
    
    // Check users
    const users = await prisma.user.findMany({
      include: {
        panchayat: true
      }
    });
    console.log(`👥 Users: ${users.length}`);
    users.forEach(u => console.log(`  - ${u.name} (${u.email}) - Panchayat: ${u.panchayat?.name || 'None'} - Role: ${u.role}`));
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
