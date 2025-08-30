import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUserPanchayats() {
  try {
    console.log('Checking user-panchayat associations...')
    
    // Check all users and their panchayat associations
    const users = await prisma.user.findMany({
      include: {
        panchayat: true
      }
    })
    
    console.log(`Total users: ${users.length}`)
    
    const usersWithPanchayat = users.filter(user => user.panchayat)
    const usersWithoutPanchayat = users.filter(user => !user.panchayat)
    
    console.log(`Users with panchayat: ${usersWithPanchayat.length}`)
    console.log(`Users without panchayat: ${usersWithoutPanchayat.length}`)
    
    if (usersWithoutPanchayat.length > 0) {
      console.log('\nUsers without panchayat:')
      usersWithoutPanchayat.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - panchayatId: ${user.panchayatId}`)
      })
    }
    
    // Check available panchayats
    const panchayats = await prisma.panchayat.findMany()
    console.log(`\nAvailable panchayats: ${panchayats.length}`)
    panchayats.forEach(p => {
      console.log(`- ${p.name} (${p.district}, ${p.state})`)
    })
    
    // If users don't have panchayats, assign them to the first available panchayat
    if (usersWithoutPanchayat.length > 0 && panchayats.length > 0) {
      console.log('\nAssigning users to first available panchayat...')
      const firstPanchayat = panchayats[0]
      
      await prisma.user.updateMany({
        where: {
          panchayatId: null
        },
        data: {
          panchayatId: firstPanchayat.id
        }
      })
      
      console.log(`Assigned ${usersWithoutPanchayat.length} users to ${firstPanchayat.name}`)
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserPanchayats()
