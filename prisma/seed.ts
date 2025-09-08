import { PrismaClient, UserRole, QueryStatus, ComplaintStatus } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Helper function to get a random item from an array
const getRandomItem = <T>(arr: T[]): T => {
  if (arr.length === 0) throw new Error("Cannot get a random item from an empty array.");
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  // --- Lists for random name generation ---
  const firstNames = [
    "Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Krishna", "Rohan", "Ankit", "Manish",
    "Priya", "Ananya", "Diya", "Saanvi", "Tara", "Gauri", "Isha", "Kavya", "Mira", "Sunita"
  ];
  const lastNames = [
    "Sharma", "Verma", "Gupta", "Singh", "Patel", "Kumar", "Yadav", "Jain", "Khan", "Mishra", "Tiwari", "Chauhan"
  ];

  console.log("🌱 Starting seed...")

  // --- 1. Database Clearing ---
  console.log("🧹 Clearing existing data...")
  const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
  `
  const tableNames = tables.map(t => t.table_name);

  const tablesToTruncate = [
    'ratings', 'complaints', 'query_updates', 'queries', 'users', 
    'ngos', 'offices', 'panchayats', 'departments', 'service_stats'
  ];

  for (const table of tablesToTruncate) {
    if (tableNames.includes(table)) {
      console.log(`- Clearing ${table}...`);
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
    }
  }
  console.log("✅ Database cleared");

  // --- 2. Create Core Static Data ---
  console.log("🏢 Creating Departments and Panchayats...")
  const departments = await Promise.all([
    prisma.department.create({ data: { name: "Health", description: "Healthcare services and facilities" } }),
    prisma.department.create({ data: { name: "Education", description: "Schools and educational programs" } }),
    prisma.department.create({ data: { name: "Water", description: "Water supply and sanitation" } }),
    prisma.department.create({ data: { name: "Roads", description: "Road construction and maintenance" } }),
    prisma.department.create({ data: { name: "Sanitation", description: "Waste management and cleanliness" } }),
    prisma.department.create({ data: { name: "Electricity", description: "Power supply and electrical infrastructure" } }),
  ])

  const panchayats = await Promise.all([
    prisma.panchayat.create({ data: { name: "Bhopal Rural Panchayat", district: "Bhopal", state: "Madhya Pradesh", pincode: "462001", latitude: 23.2599, longitude: 77.4126, contactEmail: "bhopal.rural@mp.gov.in", contactPhone: "+91-755-2661234" } }),
    prisma.panchayat.create({ data: { name: "Sehore Panchayat", district: "Sehore", state: "Madhya Pradesh", pincode: "466001", latitude: 23.2017, longitude: 77.0873, contactEmail: "sehore@mp.gov.in", contactPhone: "+91-7562-232123" } }),
    prisma.panchayat.create({ data: { name: "Indore Rural Panchayat", district: "Indore", state: "Madhya Pradesh", pincode: "452001", latitude: 22.7196, longitude: 75.8577, contactEmail: "indore.rural@mp.gov.in", contactPhone: "+91-731-2521111" } }),
    prisma.panchayat.create({ data: { name: "Jabalpur Rural Panchayat", district: "Jabalpur", state: "Madhya Pradesh", pincode: "482001", latitude: 23.1815, longitude: 79.9168, contactEmail: "jabalpur.rural@mp.gov.in", contactPhone: "+91-761-2678901" } }),
    prisma.panchayat.create({ data: { name: "Gwalior Rural Panchayat", district: "Gwalior", state: "Madhya Pradesh", pincode: "474001", latitude: 26.2183, longitude: 78.1828, contactEmail: "gwalior.rural@mp.gov.in", contactPhone: "+91-751-2456789" } }),
    prisma.panchayat.create({ data: { name: "Ujjain Panchayat", district: "Ujjain", state: "Madhya Pradesh", pincode: "456001", latitude: 23.1793, longitude: 75.7831, contactEmail: "ujjain@mp.gov.in", contactPhone: "+91-734-2567890" } }),
  ])

  console.log("🏤 Creating Offices...");
  const officePromises = panchayats.map(panchayat => {
    const healthDept = departments.find(d => d.name === "Health")!;
    const educationDept = departments.find(d => d.name === "Education")!;
    const waterDept = departments.find(d => d.name === "Water")!;
    return [
      prisma.office.create({ data: { name: `Primary Health Center - ${panchayat.district}`, address: `Main Road, ${panchayat.district}`, departmentId: healthDept.id, panchayatId: panchayat.id, latitude: panchayat.latitude!, longitude: panchayat.longitude! } }),
      prisma.office.create({ data: { name: `Govt. Primary School - ${panchayat.district}`, address: `School Street, ${panchayat.district}`, departmentId: educationDept.id, panchayatId: panchayat.id, latitude: panchayat.latitude!, longitude: panchayat.longitude! } }),
      prisma.office.create({ data: { name: `Water Supply Office - ${panchayat.district}`, address: `Civic Center, ${panchayat.district}`, departmentId: waterDept.id, panchayatId: panchayat.id, latitude: panchayat.latitude!, longitude: panchayat.longitude! } })
    ];
  });
  const offices = await Promise.all(officePromises.flat());
  console.log(`✅ Created ${offices.length} Offices`);

  // --- 3. Create Core Users ---
  console.log("👤 Creating Admin and Panchayat Staff users...")
  const hashedPassword = await hashPassword("password123")
  const adminUser = await prisma.user.create({ data: { email: "admin@reyog.gov.in", password: hashedPassword, name: "System Administrator", phone: "+91-9876543210", role: UserRole.ADMIN } })
  
  const panchayatUsers = await Promise.all(
    panchayats.map(p => 
      prisma.user.create({ 
        data: { 
          email: `${p.district.toLowerCase()}.staff@reyog.gov.in`, 
          password: hashedPassword, 
          name: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`, 
          phone: `+91-99999${Math.floor(10000 + Math.random() * 90000)}`, 
          role: UserRole.PANCHAYAT, 
          panchayatId: p.id 
        } 
      })
    )
  );

  // --- 4. Dynamically Create Voters, Queries, and Complaints ---
  console.log("👥 Creating voters and their associated data for each panchayat...")

  // Create specific Ramesh user first
  console.log("- Creating specific voter: Ramesh Patel");
  const rameshVoter = await prisma.user.create({
    data: {
      email: "ramesh.voter@gmail.com",
      password: hashedPassword,
      name: "Ramesh Patel",
      phone: "+91-9876543213",
      role: UserRole.VOTER,
      panchayatId: panchayats[0].id // Assign to Bhopal Rural Panchayat
    }
  });
  const createdVoters = [rameshVoter]; // Initialize the array with Ramesh

  let queryCounter = 0;
  let complaintCounter = 0;

  for (const panchayat of panchayats) {
    const officesInPanchayat = offices.filter(o => o.panchayatId === panchayat.id);
    if (officesInPanchayat.length === 0) {
      console.warn(`⚠ No offices found for ${panchayat.name}, skipping voter creation.`);
      continue;
    }

    for (let i = 1; i <= 5; i++) {
      const voter = await prisma.user.create({
        data: {
          email: `${panchayat.district.toLowerCase()}-voter${i}@example.com`,
          password: hashedPassword,
          name: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
          phone: `+91-88888${i.toString().padStart(5, '0')}`,
          role: UserRole.VOTER,
          panchayatId: panchayat.id
        }
      });
      createdVoters.push(voter);

      await prisma.query.create({ data: { title: "Pending road repair request", description: `Requesting repair for potholes on Main Street in ${panchayat.name}.`, status: QueryStatus.PENDING_REVIEW, userId: voter.id, panchayatId: panchayat.id, officeId: getRandomItem(officesInPanchayat).id, departmentId: getRandomItem(departments).id } });
      await prisma.query.create({ data: { title: "Accepted water pipe leak", description: `The submitted query about the water leak has been accepted in ${panchayat.name}.`, status: QueryStatus.ACCEPTED, acceptedAt: new Date(), userId: voter.id, panchayatId: panchayat.id, officeId: getRandomItem(officesInPanchayat).id, departmentId: getRandomItem(departments).id } });
      await prisma.query.create({ data: { title: "Resolved streetlight issue", description: `The streetlight on our block in ${panchayat.name} has been fixed.`, status: QueryStatus.RESOLVED, acceptedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), resolvedAt: new Date(), userId: voter.id, panchayatId: panchayat.id, officeId: getRandomItem(officesInPanchayat).id, departmentId: getRandomItem(departments).id } });
      const declinedQuery = await prisma.query.create({ data: { title: "Declined request for new park", description: `The request for a new community park in ${panchayat.name} was declined.`, status: QueryStatus.DECLINED, userId: voter.id, panchayatId: panchayat.id, officeId: getRandomItem(officesInPanchayat).id, departmentId: getRandomItem(departments).id } });
      queryCounter += 4;
      
      await prisma.complaint.create({ data: { subject: `Direct complaint from ${voter.name}`, description: `There is irregular garbage collection in ${panchayat.district}.`, status: ComplaintStatus.OPEN, userId: voter.id } });
      await prisma.complaint.create({ data: { subject: `Complaint on declined query #${declinedQuery.id}`, description: `My query was declined without a proper reason. Please review.`, status: ComplaintStatus.UNDER_REVIEW, userId: voter.id, queryId: declinedQuery.id } });
      complaintCounter += 2;
    }
  }

  // --- 5. Create NGOs ---
  console.log("🤝 Creating NGOs...");
  const ngos = await Promise.all([
    prisma.nGO.create({ data: { name: "Rural Development Foundation", focusArea: "Education and Healthcare", coverage: "Madhya Pradesh", contactName: "Dr. Anjali Verma", contactEmail: "contact@rdf.org.in", contactPhone: "+91-9876543220", address: "Plot 15, Civil Lines, Bhopal, MP 462001", website: "https://rdf.org.in", } }),
    prisma.nGO.create({ data: { name: "Clean Water Initiative", focusArea: "Water and Sanitation", coverage: "Central India", contactName: "Ravi Agarwal", contactEmail: "info@cleanwater.org", contactPhone: "+91-9876543221", address: "23, Green Park, Bhopal, MP 462003", } }),
    prisma.nGO.create({ data: { name: "Women Empowerment Society", focusArea: "Women Rights and Development", coverage: "Bhopal District", contactName: "Meera Joshi", contactEmail: "contact@wes.org.in", contactPhone: "+91-9876543222", address: "45, Mahila Bhawan, Bhopal, MP 462001", website: "https://wes.org.in", } }),
  ]);

  // --- 6. Create Ratings ---
  console.log("⭐ Creating Ratings...");
  if (createdVoters.length > 0 && offices.length > 0) {
    const createdRatings = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const voter = getRandomItem(createdVoters);
      const office = getRandomItem(offices);
      const uniqueKey = `${voter.id}-${office.id}`;

      if (!createdRatings.has(uniqueKey)) {
        await prisma.rating.create({
          data: {
            rating: Math.floor(Math.random() * 5) + 1,
            comment: getRandomItem(["Excellent service!", "Very helpful.", "Could be better.", "Slow response.", "Outstanding!"]),
            userId: voter.id,
            officeId: office.id,
          }
        });
        createdRatings.add(uniqueKey);
      }
    }
  }

  // --- 7. Create Service Stats ---
  console.log("📊 Creating Service Stats...");
  const serviceStatPromises = [];
  for (const panchayat of panchayats.slice(0, 2)) {
    serviceStatPromises.push(
      prisma.serviceStat.create({ data: { category: "Hospitals", metric: "doctors", value: Math.floor(2 + Math.random() * 3), unit: "count", panchayatId: panchayat.id } }),
      prisma.serviceStat.create({ data: { category: "Hospitals", metric: "beds", value: Math.floor(15 + Math.random() * 10), unit: "count", panchayatId: panchayat.id } }),
      prisma.serviceStat.create({ data: { category: "Schools", metric: "teachers", value: Math.floor(8 + Math.random() * 5), unit: "count", panchayatId: panchayat.id } }),
      prisma.serviceStat.create({ data: { category: "Schools", metric: "students", value: Math.floor(250 + Math.random() * 100), unit: "count", panchayatId: panchayat.id } }),
    );
  }
  const serviceStats = await Promise.all(serviceStatPromises.flat());

  const totalRatings = await prisma.rating.count();

  // --- Summary ---
  console.log("\n✅ Seed completed successfully!")
  console.log("\n📊 Created:")
  console.log(`- ${departments.length} Departments`)
  console.log(`- ${panchayats.length} Panchayats`)
  console.log(`- ${offices.length} Offices`)
  console.log(`- ${1 + panchayatUsers.length + createdVoters.length} Users (1 Admin, ${panchayatUsers.length} Staff, ${createdVoters.length} Voters)`)
  console.log(`- ${queryCounter} Queries`)
  console.log(`- ${complaintCounter} Complaints`)
  console.log(`- ${ngos.length} NGOs`)
  console.log(`- ${totalRatings} Ratings`)
  console.log(`- ${serviceStats.length} Service Stats`)

  console.log("\n🔐 Login Credentials (Password for all is 'password123'):")
  console.log(`Admin: ${adminUser.email}`)
  console.log(`Panchayat Staff (Example): ${panchayatUsers[0].email}`)
  console.log(`Voter (Ramesh): ${rameshVoter.email}`)
  console.log(`Voter (Example): ${createdVoters[1]?.email || 'N/A'}`)
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:")
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })