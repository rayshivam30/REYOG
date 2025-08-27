import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkAndSeedPanchayats() {
  try {
    // Check if there are any panchayats
    const panchayats = await prisma.panchayat.findMany()
    
    if (panchayats.length === 0) {
      console.log("No panchayats found. Adding sample panchayats...")
      
      // Add sample panchayats
      const samplePanchayats = [
        {
          name: "Sample Panchayat 1",
          district: "Sample District 1",
          state: "Kerala",
          pincode: "123456",
          contactEmail: "panchayat1@example.com",
          contactPhone: "1234567890",
        },
        {
          name: "Sample Panchayat 2",
          district: "Sample District 2",
          state: "Kerala",
          pincode: "654321",
          contactEmail: "panchayat2@example.com",
          contactPhone: "0987654321",
        },
      ]

      await prisma.panchayat.createMany({
        data: samplePanchayats,
      })

      console.log("Added sample panchayats successfully!")
    } else {
      console.log(`Found ${panchayats.length} panchayats in the database.`)
      console.log("Sample panchayats:", panchayats.slice(0, 5))
    }
  } catch (error) {
    console.error("Error checking/adding panchayats:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndSeedPanchayats()
