// prisma/seed.ts

import { PrismaClient, UserRole, QueryStatus, ComplaintStatus } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  console.log("🌱 Starting seed...")
  
  // Skip clearing if tables don't exist
  console.log("🔍 Checking database state...")
  // Using a more robust way to get table names that works across different databases
  const tables = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
  `
  
  const tableNames = (tables as any[]).map(t => t.table_name);
  console.log("Found tables:", tableNames);
  
  // Only try to clear tables that exist
  if (tableNames.length > 0) {
    console.log("🧹 Clearing existing data...");
    
    // ## THIS IS THE CORRECTED LINE ##
    // Names are now lowercase and plural to match the actual table names in the database.
    const tablesToTruncate = [
      'ratings', 'complaints', 'query_updates', 'queries', 'users', 
      'ngos', 'offices', 'panchayats', 'departments'
    ];
    
    for (const table of tablesToTruncate) {
      // The check now correctly finds the table name (e.g., 'departments') in the list of found tables.
      if (tableNames.includes(table)) {
        console.log(`- Clearing ${table}...`);
        // Using the correct table name in the TRUNCATE command.
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
      }
    }
    console.log("✅ Database cleared");
  } else {
    console.log("ℹ️ No existing tables found, proceeding with seed...");
  }

  // Create Departments
  const departments = await Promise.all([
    prisma.department.create({
      data: { name: "Health", description: "Healthcare services and facilities" },
    }),
    prisma.department.create({
      data: { name: "Education", description: "Schools and educational programs" },
    }),
    prisma.department.create({
      data: { name: "Water", description: "Water supply and sanitation" },
    }),
    prisma.department.create({
      data: { name: "Roads", description: "Road construction and maintenance" },
    }),
    prisma.department.create({
      data: { name: "Sanitation", description: "Waste management and cleanliness" },
    }),
    prisma.department.create({
      data: { name: "Electricity", description: "Power supply and electrical infrastructure" },
    }),
  ])

  // Create Panchayats (now 6 of them, as requested)
  const panchayats = await Promise.all([
    prisma.panchayat.create({
      data: {
        name: "Bhopal Rural Panchayat",
        district: "Bhopal",
        state: "Madhya Pradesh",
        pincode: "462001",
        latitude: 23.2599,
        longitude: 77.4126,
        contactEmail: "bhopal.rural@mp.gov.in",
        contactPhone: "+91-755-2661234",
      },
    }),
    prisma.panchayat.create({
      data: {
        name: "Sehore Panchayat",
        district: "Sehore",
        state: "Madhya Pradesh",
        pincode: "466001",
        latitude: 23.2017,
        longitude: 77.0873,
        contactEmail: "sehore@mp.gov.in",
        contactPhone: "+91-7562-232123",
      },
    }),
    // New Panchayats
    prisma.panchayat.create({
      data: {
        name: "Indore Rural Panchayat",
        district: "Indore",
        state: "Madhya Pradesh",
        pincode: "452001",
        latitude: 22.7196,
        longitude: 75.8577,
        contactEmail: "indore.rural@mp.gov.in",
        contactPhone: "+91-731-2521111",
      },
    }),
    prisma.panchayat.create({
      data: {
        name: "Jabalpur Rural Panchayat",
        district: "Jabalpur",
        state: "Madhya Pradesh",
        pincode: "482001",
        latitude: 23.1815,
        longitude: 79.9168,
        contactEmail: "jabalpur.rural@mp.gov.in",
        contactPhone: "+91-761-2678901",
      },
    }),
    prisma.panchayat.create({
      data: {
        name: "Gwalior Rural Panchayat",
        district: "Gwalior",
        state: "Madhya Pradesh",
        pincode: "474001",
        latitude: 26.2183,
        longitude: 78.1828,
        contactEmail: "gwalior.rural@mp.gov.in",
        contactPhone: "+91-751-2456789",
      },
    }),
    prisma.panchayat.create({
      data: {
        name: "Ujjain Panchayat",
        district: "Ujjain",
        state: "Madhya Pradesh",
        pincode: "456001",
        latitude: 23.1793,
        longitude: 75.7831,
        contactEmail: "ujjain@mp.gov.in",
        contactPhone: "+91-734-2567890",
      },
    }),
  ])

  // Create Offices
  const offices = await Promise.all([
    // Bhopal Rural offices
    prisma.office.create({
      data: {
        name: "Primary Health Center - Bhopal Rural",
        address: "Village Road, Bhopal Rural, MP 462001",
        latitude: 23.2599,
        longitude: 77.4126,
        contactPhone: "+91-755-2661235",
        workingHours: "9:00 AM - 5:00 PM",
        departmentId: departments[0].id, // Health
        panchayatId: panchayats[0].id,
      },
    }),
    prisma.office.create({
      data: {
        name: "Government Primary School - Bhopal",
        address: "School Street, Bhopal Rural, MP 462001",
        latitude: 23.261,
        longitude: 77.414,
        contactPhone: "+91-755-2661236",
        workingHours: "8:00 AM - 4:00 PM",
        departmentId: departments[1].id, // Education
        panchayatId: panchayats[0].id,
      },
    }),
    prisma.office.create({
      data: {
        name: "Water Supply Office - Bhopal",
        address: "Municipal Building, Bhopal Rural, MP 462001",
        latitude: 23.258,
        longitude: 77.41,
        contactPhone: "+91-755-2661237",
        workingHours: "10:00 AM - 6:00 PM",
        departmentId: departments[2].id, // Water
        panchayatId: panchayats[0].id,
      },
    }),
    // Sehore offices
    prisma.office.create({
      data: {
        name: "Road Development Office - Sehore",
        address: "Main Road, Sehore, MP 466001",
        latitude: 23.2017,
        longitude: 77.0873,
        contactPhone: "+91-7562-232124",
        workingHours: "9:00 AM - 5:00 PM",
        departmentId: departments[3].id, // Roads
        panchayatId: panchayats[1].id,
      },
    }),
    prisma.office.create({
      data: {
        name: "Sanitation Department - Sehore",
        address: "Civic Center, Sehore, MP 466001",
        latitude: 23.203,
        longitude: 77.089,
        contactPhone: "+91-7562-232125",
        workingHours: "8:00 AM - 4:00 PM",
        departmentId: departments[4].id, // Sanitation
        panchayatId: panchayats[1].id,
      },
    }),
    prisma.office.create({
      data: {
        name: "Electricity Board - Sehore",
        address: "Power House Road, Sehore, MP 466001",
        latitude: 23.2,
        longitude: 77.085,
        contactPhone: "+91-7562-232126",
        workingHours: "9:00 AM - 6:00 PM",
        departmentId: departments[5].id, // Electricity
        panchayatId: panchayats[1].id,
      },
    }),
  ])

  // Create Users
  const hashedPassword = await hashPassword("password123")

  // Admin user
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@reyog.gov.in",
      password: hashedPassword,
      name: "System Administrator",
      phone: "+91-9876543210",
      role: UserRole.ADMIN,
    },
  })

  // Panchayat users
  const panchayatUsers = await Promise.all([
    // Assigning users to the newly created panchayats
    prisma.user.create({
      data: {
        email: "bhopal.staff@reyog.gov.in",
        password: hashedPassword,
        name: "Rajesh Kumar",
        phone: "+91-9876543211",
        role: UserRole.PANCHAYAT,
        panchayatId: panchayats[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: "sehore.staff@reyog.gov.in",
        password: hashedPassword,
        name: "Priya Sharma",
        phone: "+91-9876543212",
        role: UserRole.PANCHAYAT,
        panchayatId: panchayats[1].id,
      },
    }),
    // User 3: Assigned to the third panchayat
    prisma.user.create({
      data: {
        email: "indore.staff@reyog.gov.in",
        password: hashedPassword,
        name: "Amit Patel",
        phone: "+91-7654321333",
        role: UserRole.PANCHAYAT,
        panchayatId: panchayats[2].id,
      },
    }),
    // User 4: Assigned to the fourth panchayat
    prisma.user.create({
      data: {
        email: "jabalpur.staff@reyog.gov.in",
        password: hashedPassword,
        name: "Sunita Singh",
        phone: "+91-6543214444",
        role: UserRole.PANCHAYAT,
        panchayatId: panchayats[3].id,
      },
    }),
    // User 5: Assigned to the fifth panchayat
    prisma.user.create({
      data: {
        email: "gwalior.staff@reyog.gov.in",
        password: hashedPassword,
        name: "Vikram Reddy",
        phone: "+91-5432155555",
        role: UserRole.PANCHAYAT,
        panchayatId: panchayats[4].id,
      },
    }),
    // User 6: Assigned to the sixth panchayat
    prisma.user.create({
      data: {
        email: "ujjain.staff@reyog.gov.in",
        password: hashedPassword,
        name: "Anjali Gupta",
        phone: "+91-4321666666",
        role: UserRole.PANCHAYAT,
        panchayatId: panchayats[5].id,
      },
    }),
  ])

  // Voter users
  const voterUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: "ramesh.voter@gmail.com",
        password: hashedPassword,
        name: "Ramesh Patel",
        phone: "+91-9876543213",
        role: UserRole.VOTER,
      },
    }),
    prisma.user.create({
      data: {
        email: "sunita.voter@gmail.com",
        password: hashedPassword,
        name: "Sunita Devi",
        phone: "+91-9876543214",
        role: UserRole.VOTER,
      },
    }),
    prisma.user.create({
      data: {
        email: "amit.voter@gmail.com",
        password: hashedPassword,
        name: "Amit Singh",
        phone: "+91-9876543215",
        role: UserRole.VOTER,
      },
    }),
    prisma.user.create({
      data: {
        email: "kavita.voter@gmail.com",
        password: hashedPassword,
        name: "Kavita Jain",
        phone: "+91-9876543216",
        role: UserRole.VOTER,
      },
    }),
    prisma.user.create({
      data: {
        email: "deepak.voter@gmail.com",
        password: hashedPassword,
        name: "Deepak Gupta",
        phone: "+91-9876543217",
        role: UserRole.VOTER,
      },
    }),
  ])

  // Create Queries with mixed statuses
  const queries = await Promise.all([
    prisma.query.create({
      data: {
        title: "Water supply issue in our area",
        description: "There has been no water supply for the past 3 days in our locality. Please help.",
        status: QueryStatus.IN_PROGRESS,
        latitude: 23.2599,
        longitude: 77.4126,
        budgetIssued: 50000,
        budgetSpent: 25000,
        officialIncharge: "Rajesh Kumar",
        teamAssigned: "Water Maintenance Team A",
        estimatedEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        acceptedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        userId: voterUsers[0].id,
        departmentId: departments[2].id, // Water
        officeId: offices[2].id,
        panchayatId: panchayats[0].id,
      },
    }),
    prisma.query.create({
      data: {
        title: "Road repair needed urgently",
        description: "The main road has several potholes causing accidents. Immediate repair needed.",
        status: QueryStatus.ACCEPTED,
        latitude: 23.2017,
        longitude: 77.0873,
        budgetIssued: 100000,
        officialIncharge: "Priya Sharma",
        estimatedStart: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        estimatedEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        acceptedAt: new Date(),
        userId: voterUsers[1].id,
        departmentId: departments[3].id, // Roads
        officeId: offices[3].id,
        panchayatId: panchayats[1].id,
      },
    }),
    prisma.query.create({
      data: {
        title: "School building maintenance",
        description: "The school roof is leaking during monsoon. Children are facing difficulties.",
        status: QueryStatus.RESOLVED,
        budgetIssued: 75000,
        budgetSpent: 72000,
        officialIncharge: "Rajesh Kumar",
        teamAssigned: "Building Maintenance Team",
        acceptedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        userId: voterUsers[2].id,
        departmentId: departments[1].id, // Education
        officeId: offices[1].id,
        panchayatId: panchayats[0].id,
      },
    }),
    prisma.query.create({
      data: {
        title: "Electricity pole replacement",
        description: "Old electricity pole is damaged and poses safety risk.",
        status: QueryStatus.PENDING_REVIEW,
        latitude: 23.2,
        longitude: 77.085,
        userId: voterUsers[3].id,
        departmentId: departments[5].id, // Electricity
        officeId: offices[5].id,
      },
    }),
    prisma.query.create({
      data: {
        title: "Garbage collection not regular",
        description: "Garbage is not being collected regularly in our area, causing health issues.",
        status: QueryStatus.WAITLISTED,
        estimatedStart: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        userId: voterUsers[4].id,
        departmentId: departments[4].id, // Sanitation
        officeId: offices[4].id,
        panchayatId: panchayats[1].id,
      },
    }),
    prisma.query.create({
      data: {
        title: "Medical equipment shortage",
        description: "The health center lacks basic medical equipment for emergency cases.",
        status: QueryStatus.DECLINED,
        userId: voterUsers[0].id,
        departmentId: departments[0].id, // Health
        officeId: offices[0].id,
      },
    }),
    prisma.query.create({
      data: {
        title: "Street light installation",
        description: "Our street has no lighting, making it unsafe during night hours.",
        status: QueryStatus.CLOSED,
        budgetIssued: 30000,
        budgetSpent: 28000,
        acceptedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        closedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        userId: voterUsers[1].id,
        departmentId: departments[5].id, // Electricity
        officeId: offices[5].id,
        panchayatId: panchayats[1].id,
      },
    }),
    prisma.query.create({
      data: {
        title: "Teacher shortage in school",
        description: "The government school has only 2 teachers for 150 students.",
        status: QueryStatus.IN_PROGRESS,
        budgetIssued: 200000,
        budgetSpent: 50000,
        officialIncharge: "Rajesh Kumar",
        estimatedEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        acceptedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        userId: voterUsers[2].id,
        departmentId: departments[1].id, // Education
        officeId: offices[1].id,
        panchayatId: panchayats[0].id,
      },
    }),
  ])

  // Create Query Updates
  await Promise.all([
    prisma.queryUpdate.create({
      data: {
        status: QueryStatus.ACCEPTED,
        note: "Query accepted. Water maintenance team will start work tomorrow.",
        queryId: queries[0].id,
        userId: panchayatUsers[0].id,
      },
    }),
    prisma.queryUpdate.create({
      data: {
        status: QueryStatus.IN_PROGRESS,
        note: "Work started. Pipeline repair in progress.",
        budgetSpentDelta: 25000,
        queryId: queries[0].id,
        userId: panchayatUsers[0].id,
      },
    }),
    prisma.queryUpdate.create({
      data: {
        status: QueryStatus.RESOLVED,
        note: "School roof repair completed successfully.",
        budgetSpentDelta: 72000,
        queryId: queries[2].id,
        userId: panchayatUsers[0].id,
      },
    }),
    prisma.queryUpdate.create({
      data: {
        status: QueryStatus.DECLINED,
        note: "Budget not available for medical equipment this fiscal year.",
        queryId: queries[5].id,
        userId: panchayatUsers[0].id,
      },
    }),
  ])

  // Create Complaints
  await Promise.all([
    prisma.complaint.create({
      data: {
        subject: "Corruption in road construction project",
        description: "The contractor is using substandard materials for road construction.",
        status: ComplaintStatus.UNDER_REVIEW,
        userId: voterUsers[0].id,
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Panchayat staff not responding to queries",
        description: "Multiple queries submitted but no response from panchayat office.",
        status: ComplaintStatus.OPEN,
        userId: voterUsers[1].id,
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Misuse of government funds",
        description: "Funds allocated for water project being used for other purposes.",
        status: ComplaintStatus.RESOLVED,
        resolution: "Investigation completed. Appropriate action taken against responsible officials.",
        userId: voterUsers[2].id,
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Discrimination in service delivery",
        description: "Certain communities are being ignored in government service delivery.",
        status: ComplaintStatus.OPEN,
        userId: voterUsers[3].id,
      },
    }),
  ])

  // Create NGOs
  await Promise.all([
    prisma.nGO.create({
      data: {
        name: "Rural Development Foundation",
        focusArea: "Education and Healthcare",
        coverage: "Madhya Pradesh",
        contactName: "Dr. Anjali Verma",
        contactEmail: "contact@rdf.org.in",
        contactPhone: "+91-9876543220",
        address: "Plot 15, Civil Lines, Bhopal, MP 462001",
        website: "https://rdf.org.in",
      },
    }),
    prisma.nGO.create({
      data: {
        name: "Clean Water Initiative",
        focusArea: "Water and Sanitation",
        coverage: "Central India",
        contactName: "Ravi Agarwal",
        contactEmail: "info@cleanwater.org",
        contactPhone: "+91-9876543221",
        address: "23, Green Park, Bhopal, MP 462003",
      },
    }),
    prisma.nGO.create({
      data: {
        name: "Women Empowerment Society",
        focusArea: "Women Rights and Development",
        coverage: "Bhopal District",
        contactName: "Meera Joshi",
        contactEmail: "contact@wes.org.in",
        contactPhone: "+91-9876543222",
        address: "45, Mahila Bhawan, Bhopal, MP 462001",
        website: "https://wes.org.in",
      },
    }),
  ])

  // Create Ratings
  await Promise.all([
    prisma.rating.create({
      data: {
        rating: 4,
        comment: "Good service, staff is helpful",
        userId: voterUsers[0].id,
        officeId: offices[0].id,
      },
    }),
    prisma.rating.create({
      data: {
        rating: 5,
        comment: "Excellent response time and quality work",
        userId: voterUsers[1].id,
        officeId: offices[2].id,
      },
    }),
    prisma.rating.create({
      data: {
        rating: 3,
        comment: "Average service, room for improvement",
        userId: voterUsers[2].id,
        officeId: offices[1].id,
      },
    }),
    prisma.rating.create({
      data: {
        rating: 5,
        comment: "Very professional and efficient",
        userId: voterUsers[3].id,
        officeId: offices[3].id,
      },
    }),
    prisma.rating.create({
      data: {
        rating: 2,
        comment: "Slow response, needs improvement",
        userId: voterUsers[4].id,
        officeId: offices[4].id,
      },
    }),
    prisma.rating.create({
      data: {
        rating: 4,
        comment: "Good infrastructure and staff",
        userId: voterUsers[0].id,
        officeId: offices[1].id,
      },
    }),
    prisma.rating.create({
      data: {
        rating: 5,
        comment: "Outstanding service quality",
        userId: voterUsers[1].id,
        officeId: offices[5].id,
      },
    }),
    prisma.rating.create({
      data: {
        rating: 3,
        comment: "Decent service but can be better",
        userId: voterUsers[2].id,
        officeId: offices[0].id,
      },
    }),
    prisma.rating.create({
      data: {
        rating: 4,
        comment: "Helpful staff and good facilities",
        userId: voterUsers[3].id,
        officeId: offices[2].id,
      },
    }),
    prisma.rating.create({
      data: {
        rating: 1,
        comment: "Very poor service and rude staff",
        userId: voterUsers[4].id,
        officeId: offices[3].id,
      },
    }),
  ])

  // Create Service Stats
  await Promise.all([
    // Bhopal Rural Panchayat stats
    prisma.serviceStat.create({
      data: {
        category: "Hospitals",
        metric: "doctors",
        value: 3,
        unit: "count",
        panchayatId: panchayats[0].id,
      },
    }),
    prisma.serviceStat.create({
      data: {
        category: "Hospitals",
        metric: "nurses",
        value: 8,
        unit: "count",
        panchayatId: panchayats[0].id,
      },
    }),
    prisma.serviceStat.create({
      data: {
        category: "Hospitals",
        metric: "beds",
        value: 25,
        unit: "count",
        panchayatId: panchayats[0].id,
      },
    }),
    prisma.serviceStat.create({
      data: {
        category: "Schools",
        metric: "teachers",
        value: 12,
        unit: "count",
        panchayatId: panchayats[0].id,
      },
    }),
    prisma.serviceStat.create({
      data: {
        category: "Schools",
        metric: "students",
        value: 350,
        unit: "count",
        panchayatId: panchayats[0].id,
      },
    }),
    // Sehore Panchayat stats
    prisma.serviceStat.create({
      data: {
        category: "Hospitals",
        metric: "doctors",
        value: 2,
        unit: "count",
        panchayatId: panchayats[1].id,
      },
    }),
    prisma.serviceStat.create({
      data: {
        category: "Hospitals",
        metric: "nurses",
        value: 5,
        unit: "count",
        panchayatId: panchayats[1].id,
      },
    }),
    prisma.serviceStat.create({
      data: {
        category: "Hospitals",
        metric: "beds",
        value: 15,
        unit: "count",
        panchayatId: panchayats[1].id,
      },
    }),
    prisma.serviceStat.create({
      data: {
        category: "Schools",
        metric: "teachers",
        value: 8,
        unit: "count",
        panchayatId: panchayats[1].id,
      },
    }),
    prisma.serviceStat.create({
      data: {
        category: "Schools",
        metric: "students",
        value: 280,
        unit: "count",
        panchayatId: panchayats[1].id,
      },
    }),
  ])

  console.log("✅ Seed completed successfully!")
  console.log("\n📊 Created:")
  console.log(`- ${departments.length} Departments`)
  console.log(`- ${panchayats.length} Panchayats`)
  console.log(`- ${offices.length} Offices`)
  console.log(`- ${1 + panchayatUsers.length + voterUsers.length} Users`)
  console.log(`- ${queries.length} Queries`)
  console.log(`- 4 Complaints`)
  console.log(`- 3 NGOs`)
  console.log(`- 10 Ratings`)
  console.log(`- 10 Service Stats`)

  console.log("\n🔐 Login Credentials:")
  console.log("Admin: admin@reyog.gov.in / password123")
  console.log("Panchayat (Bhopal): bhopal.staff@reyog.gov.in / password123")
  console.log("Panchayat (Sehore): sehore.staff@reyog.gov.in / password123")
  console.log("Voter: ramesh.voter@gmail.com / password123")
  console.log("(+ 4 more voter accounts)")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })