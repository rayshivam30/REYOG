import { PrismaClient, UserRole, QueryStatus, ComplaintStatus, UserStatus } from "@prisma/client"
import { hashPassword } from "../lib/auth" // Assuming this function exists and works correctly

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// --- HELPER FUNCTIONS & DATA ---
const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const voterNames = [
    { firstName: "Ramesh", lastName: "Patel" }, { firstName: "Sunita", lastName: "Devi" },
    { firstName: "Amit", lastName: "Singh" }, { firstName: "Kavita", lastName: "Jain" },
    { firstName: "Deepak", lastName: "Gupta" }, { firstName: "Priya", lastName: "Sharma" },
    { firstName: "Rajesh", lastName: "Kumar" }, { firstName: "Anjali", lastName: "Verma" },
    { firstName: "Manoj", lastName: "Tiwari" }, { firstName: "Pooja", lastName: "Mishra" },
    { firstName: "Sanjay", lastName: "Yadav" }, { firstName: "Meena", lastName: "Chauhan" },
    { firstName: "Vikram", lastName: "Rathore" }, { firstName: "Geeta", lastName: "Solanki" },
    { firstName: "Arun", lastName: "Joshi" }, { firstName: "Neha", lastName: "Mehta" },
    { firstName: "Suresh", lastName: "Nair" }, { firstName: "Lata", lastName: "Agrawal" },
    { firstName: "Harish", lastName: "Pandey" }, { firstName: "Rekha", lastName: "Malviya" },
    { firstName: "Gopal", lastName: "Verma" }, { firstName: "Usha", lastName: "Sahu" },
    { firstName: "Chandan", lastName: "Reddy" }, { firstName: "Savita", lastName: "Pawar" },
    { firstName: "Mohan", lastName: "Shukla" }
];

const panchayatQueries = [
    { title: "Irregular Water Supply in Ward 5", description: "The water supply in Ward 5 has been very erratic for the past two weeks. We need a consistent schedule and adequate pressure." },
    { title: "Repair of Damaged Road near Main Market", description: "The main road leading to the market is full of potholes, causing traffic issues and accidents. It needs immediate repair." },
    { title: "Broken Street Lights on Station Road", description: "Most of the street lights on Station Road are not working, making it unsafe to travel at night. Please replace the faulty lights." },
    { title: "Garbage Disposal and Collection Issues", description: "Garbage is not being collected regularly, leading to unhygienic conditions and the risk of diseases. The collection frequency must be increased." },
    { title: "Encroachment on Public Park Land", description: "A section of the community park has been illegally encroached upon by a local vendor. This needs to be cleared." },
];

const userComments = [
    "I completely agree with this. This has been a problem for months.",
    "Thank you for raising this important issue.",
    "What is the timeline for a resolution? We need action now.",
    "The authorities need to look into this matter urgently.",
];

const ratingComments = [
    "Service was quick and efficient.",
    "The staff was very helpful and guided me through the process.",
    "Could be better, the waiting time was too long.",
    "A very clean and well-maintained facility.",
    "I had a terrible experience, nobody was willing to help."
];

const directComplaintData = [
    { subject: "Unresponsive Staff at Office", description: "I visited the office today and the staff was very unhelpful and rude." },
    { subject: "Delay in Service Delivery", description: "The promised service has been delayed by over a week with no communication." },
    { subject: "Misinformation Provided", description: "The information given on the website about the required documents was incorrect." },
    { subject: "Difficulty in Contacting Department", description: "The phone numbers provided for the department are either busy or not answered." },
];

const deniedQueryComplaintData = {
    subject: "Query was Unfairly Declined",
    description: "My query was declined without a proper reason. The justification was vague and unsatisfactory."
};


// --- MAIN SEED FUNCTION ---
async function main() {
  console.log("🌱 Starting seed...")

  // 1. Database Cleanup
  console.log("\n🧹 Clearing existing data...")
  const tablesToTruncate = [
    'notification_preferences', 'audit_logs', 'notifications',
    'query_office_assignments', 'query_ngo_assignments', 'query_ratings', 'ngo_ratings',
    'comments', 'query_likes', 'query_upvotes', 'attachments',
    'ratings', 'complaints', 'query_updates', 'queries',
    'service_stats', 'offices', 'ngos', 'users', 'departments', 'panchayats'
  ];

  for (const table of tablesToTruncate) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
      console.log(`- Cleared ${table}`);
    } catch (error: any) {
      if (error.code !== '42P01') { // Ignore "table does not exist" error
        console.warn(`- Could not clear ${table}: ${error.message}`);
      }
    }
  }
  console.log("✅ Database cleared successfully.");

  // 2. Create Departments
  console.log("\n🏢 Creating Departments...")
  const departments = await Promise.all([
    prisma.department.create({ data: { name: "Health", description: "Healthcare services and facilities" } }),
    prisma.department.create({ data: { name: "Education", description: "Schools and educational programs" } }),
    prisma.department.create({ data: { name: "Water", description: "Water supply and sanitation" } }),
    prisma.department.create({ data: { name: "Roads", description: "Road construction and maintenance" } }),
    prisma.department.create({ data: { name: "Sanitation", description: "Waste management and cleanliness" } }),
    prisma.department.create({ data: { name: "Electricity", description: "Power supply and electrical infrastructure" } }),
  ]);

  // 3. Create Panchayats
  console.log("\n🏞 Creating Panchayats...")
  const panchayats = await Promise.all([
    prisma.panchayat.create({ data: { name: "Indore Rural Panchayat", district: "Indore", state: "Madhya Pradesh", pincode: "452001", latitude: 22.7196, longitude: 75.8577, contactEmail: "indore.rural@mp.gov.in", contactPhone: "+91-731-2521111" } }),
    prisma.panchayat.create({ data: { name: "Bhopal Rural Panchayat", district: "Bhopal", state: "Madhya Pradesh", pincode: "462001", latitude: 23.2599, longitude: 77.4126, contactEmail: "bhopal.rural@mp.gov.in", contactPhone: "+91-755-2661234" } }),
    prisma.panchayat.create({ data: { name: "Jabalpur Rural Panchayat", district: "Jabalpur", state: "Madhya Pradesh", pincode: "482001", latitude: 23.1815, longitude: 79.9168, contactEmail: "jabalpur.rural@mp.gov.in", contactPhone: "+91-761-2678901" } }),
    prisma.panchayat.create({ data: { name: "Gwalior Rural Panchayat", district: "Gwalior", state: "Madhya Pradesh", pincode: "474001", latitude: 26.2183, longitude: 78.1828, contactEmail: "gwalior.rural@mp.gov.in", contactPhone: "+91-751-2456789" } }),
    prisma.panchayat.create({ data: { name: "Ujjain Panchayat", district: "Ujjain", state: "Madhya Pradesh", pincode: "456001", latitude: 23.1793, longitude: 75.7831, contactEmail: "ujjain@mp.gov.in", contactPhone: "+91-734-2567890" } }),
  ]);

  // 4. Create 5 Offices for each Panchayat
  console.log("\n🏤 Creating Offices...")
  const offices = [];
  const officeData = [
      // Indore Offices
      { name: "PHC Rau", address: "Rau, Indore", depIndex: 0 },
      { name: "Govt School Simrol", address: "Simrol, Indore", depIndex: 1 },
      { name: "Water Dept Mhow", address: "Mhow, Indore", depIndex: 2 },
      { name: "Road Office Depalpur", address: "Depalpur, Indore", depIndex: 3 },
      { name: "Sanitation Unit Sanwer", address: "Sanwer, Indore", depIndex: 4 },
      // Bhopal Offices
      { name: "Water Works Kolar", address: "Kolar, Bhopal", depIndex: 2 },
      { name: "Road Dept Berasia", address: "Berasia, Bhopal", depIndex: 3 },
      { name: "Community Hall Phanda", address: "Phanda, Bhopal", depIndex: 0 },
      { name: "High School Huzur", address: "Huzur, Bhopal", depIndex: 1 },
      { name: "Electric Substation", address: "Bairagarh, Bhopal", depIndex: 5 },
      // Jabalpur Offices
      { name: "Sanitation Office Panagar", address: "Panagar, Jabalpur", depIndex: 4 },
      { name: "Health Clinic Sihora", address: "Sihora, Jabalpur", depIndex: 0 },
      { name: "PWD Office Shahpura", address: "Shahpura, Jabalpur", depIndex: 3 },
      { name: "Water Pump House Kundam", address: "Kundam, Jabalpur", depIndex: 2 },
      { name: "Education Office Patan", address: "Patan, Jabalpur", depIndex: 1 },
      // Gwalior Offices
      { name: "Electricity Board Morar", address: "Morar, Gwalior", depIndex: 5 },
      { name: "Primary School Ghatigaon", address: "Ghatigaon, Gwalior", depIndex: 1 },
      { name: "Health Unit Bhitarwar", address: "Bhitarwar, Gwalior", depIndex: 0 },
      { name: "Sanitation Dept Dabra", address: "Dabra, Gwalior", depIndex: 4 },
      { name: "Road Inspector Office", address: "Antari, Gwalior", depIndex: 3 },
      // Ujjain Offices
      { name: "Health Center Nagda", address: "Nagda, Ujjain", depIndex: 0 },
      { name: "PWD Office Khachrod", address: "Khachrod, Ujjain", depIndex: 3 },
      { name: "Water Works Tarana", address: "Tarana, Ujjain", depIndex: 2 },
      { name: "Education Block Mahidpur", address: "Mahidpur, Ujjain", depIndex: 1 },
      { name: "Sanitation Office Ghatiya", address: "Ghatiya, Ujjain", depIndex: 4 },
  ];

  let officeIndex = 0;
  for (const panchayat of panchayats) {
      for (let i = 0; i < 5; i++) {
          const data = officeData[officeIndex++];
          const office = await prisma.office.create({
              data: {
                  name: data.name,
                  address: data.address,
                  latitude: panchayat.latitude + (Math.random() - 0.5) * 0.1,
                  longitude: panchayat.longitude + (Math.random() - 0.5) * 0.1,
                  departmentId: departments[data.depIndex].id,
                  panchayatId: panchayat.id,
              }
          });
          offices.push(office);
      }
  }

  // 5. Create NGOs
  console.log("\n🤝 Creating NGOs...")
  const ngos = await Promise.all([
     prisma.nGO.create({ data: { name: "Madhya Pradesh Vikas Samiti", focusArea: "Rural Development", coverage: "Madhya Pradesh", contactName: "Anil Sharma", contactEmail: "contact@mpvs.org", contactPhone: "+91-9876543220" } }),
     prisma.nGO.create({ data: { name: "Narmada Bachao Andolan", focusArea: "Environment & Water", coverage: "Narmada Valley", contactName: "Medha Patkar", contactEmail: "info@nba.org", contactPhone: "+91-9876543221" } }),
  ]);

  // 6. Create Service Stats
  console.log("\n📊 Creating Service Stats...")
  let totalStatsCreated = 0;
  const serviceStatsData = [
      { category: "Water", metric: "Household Water Connection Coverage", unit: "%" },
      { category: "Sanitation", metric: "Waste Collection Efficiency", unit: "%" },
      { category: "Health", metric: "Child Immunization Rate", unit: "%" },
      { category: "Education", metric: "Literacy Rate", unit: "%" },
      { category: "Infrastructure", metric: "Paved Road Length", unit: "km" }
  ];

  for (const panchayat of panchayats) {
      for (const stat of serviceStatsData) {
          let value;
          if (stat.unit === "%") {
              value = getRandomNumber(75, 98);
          } else { // km
              value = getRandomNumber(50, 250);
          }

          await prisma.serviceStat.create({
              data: {
                  panchayatId: panchayat.id,
                  category: stat.category,
                  metric: stat.metric,
                  value: value,
                  unit: stat.unit,
              }
          });
          totalStatsCreated++;
      }
  }
  console.log(`✅ Created ${totalStatsCreated} service stats.`);

  // 7. Create Users (Admin, Panchayat Staff, and Voters)
  console.log("\n👥 Creating Users...")
  const hashedPassword = await hashPassword("password123")
  
  const adminUser = await prisma.user.create({ data: { email: "admin@reyog.gov.in", password: hashedPassword, name: "System Administrator", phone: "+91-9876543210", role: UserRole.ADMIN } });

  const panchayatUsers = [];
  const allVoterUsers = [];
  let voterNameIndex = 0;

  for (const [index, panchayat] of panchayats.entries()) {
    const panchayatUser = await prisma.user.create({ data: { email: `${panchayat.name.split(' ')[0].toLowerCase()}.staff@reyog.gov.in`, password: hashedPassword, name: `Staff Member ${index + 1}`, phone: `+91-900000000${index}`, role: UserRole.PANCHAYAT, panchayatId: panchayat.id, } });
    panchayatUsers.push(panchayatUser);

    for (let i = 1; i <= 5; i++) {
        const nameInfo = voterNames[voterNameIndex++];
        const voter = await prisma.user.create({ data: { email: `${nameInfo.firstName.toLowerCase()}.voter@gmail.com`, password: hashedPassword, name: `${nameInfo.firstName} ${nameInfo.lastName}`, role: UserRole.VOTER, panchayatId: panchayat.id, wardNumber: i } });
        allVoterUsers.push(voter);
    }
  }

  // 8. Create Office Ratings
  console.log("\n⭐ Creating Office Ratings...")
  for (const office of offices) {
      for (let i = 0; i < getRandomNumber(2, 5); i++) {
          const randomVoter = getRandomElement(allVoterUsers);
          const existingRating = await prisma.rating.findFirst({
              where: {
                  officeId: office.id,
                  userId: randomVoter.id,
              }
          });

          if (!existingRating) {
              await prisma.rating.create({
                  data: {
                      officeId: office.id,
                      userId: randomVoter.id,
                      rating: getRandomNumber(1, 5),
                      comment: getRandomElement(ratingComments),
                  }
              });
          }
      }
  }

  // 9. Create Curated, Specific Data for Demos
  console.log("\n✨ Creating Curated Demo Data...")
  
  const curatedQueries = await Promise.all([
    prisma.query.create({ data: { title: "Street light required at Main Chowk", description: "It is very dark at night, posing a safety risk.", status: QueryStatus.PENDING_REVIEW, userId: allVoterUsers[0].id, departmentId: departments[5].id, panchayatId: panchayats[0].id, hasReachedThreshold: true, upvoteCount: 15 } }),
    prisma.query.create({ data: { title: "Need for a public toilet in the market area", description: "There are no public facilities, causing great inconvenience.", status: QueryStatus.ACCEPTED, userId: allVoterUsers[6].id, departmentId: departments[4].id, officeId: offices[4].id, panchayatId: panchayats[1].id, acceptedAt: new Date(), budgetIssued: 200000, officialIncharge: panchayatUsers[1].name, hasReachedThreshold: true, upvoteCount: 25 } }),
    prisma.query.create({ data: { title: "Contaminated water supply", description: "The tap water has been dirty for a week.", status: QueryStatus.IN_PROGRESS, userId: allVoterUsers[24].id, departmentId: departments[2].id, officeId: offices[2].id, panchayatId: panchayats[4].id, acceptedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), budgetIssued: 50000, budgetSpent: 15000, teamAssigned: "Water Pipeline Team", hasReachedThreshold: true, upvoteCount: 30 } }),
    prisma.query.create({ data: { title: "Broken benches at bus stop", description: "The benches at the main bus stop are broken.", status: QueryStatus.RESOLVED, userId: allVoterUsers[1].id, departmentId: departments[3].id, panchayatId: panchayats[0].id, resolvedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), budgetSpent: 5000, hasReachedThreshold: true, upvoteCount: 20 } }),
  ]);

  await prisma.queryUpdate.create({ data: { queryId: curatedQueries[2].id, userId: panchayatUsers[4].id, status: QueryStatus.IN_PROGRESS, note: "Team dispatched to inspect the pipeline.", budgetSpentDelta: 15000 } });
  await prisma.comment.create({ data: { queryId: curatedQueries[2].id, userId: allVoterUsers[23].id, content: "Thank you for the quick action! Please resolve this soon." } });
  
  // Note: The specific complaint from the demo section is now removed to avoid duplication,
  // as the bulk complaint generation will cover it.
  
  await prisma.queryNgoAssignment.create({ data: { queryId: curatedQueries[2].id, ngoId: ngos[1].id, assignedBy: panchayatUsers[4].id }});
  await prisma.ngoRating.create({ data: { userId: allVoterUsers[24].id, ngoId: ngos[1].id, rating: 5, comment: "Clean Water Initiative helped us test our water. Very professional team." } });
  console.log("✅ Curated data created successfully.");
  
  // 10. Generate Additional Bulk Data for Volume Testing
  console.log("\n🔄 Generating Bulk Random Data for Volume...")
  const statuses = Object.values(QueryStatus);

  for (const user of allVoterUsers) {
    for (const status of statuses) {
        const queryData = getRandomElement(panchayatQueries);
        const budgetIssued = getRandomNumber(25000, 250000);
        const randomPanchayat = getRandomElement(panchayats);
        const randomDepartment = getRandomElement(departments);

        const userWithPanchayat = await prisma.user.findUnique({
            where: { id: user.id },
            include: { panchayat: true }
        });

        const query = await prisma.query.create({
            data: {
                title: queryData.title,
                description: queryData.description,
                status: status,
                userId: user.id,
                panchayatId: randomPanchayat.id,
                departmentId: randomDepartment.id,
                upvoteCount: getRandomNumber(50, 100),
                hasReachedThreshold: true,
                commentCount: getRandomNumber(0,2),
                latitude: userWithPanchayat?.panchayat?.latitude ?? 22.7,
                longitude: userWithPanchayat?.panchayat?.longitude ?? 75.8,
                budgetIssued: budgetIssued,
                budgetSpent: status === 'RESOLVED' || status === 'CLOSED' ? budgetIssued * 0.90 : 0,
            },
        });
        
        for (let j = 0; j < query.commentCount; j++) {
            await prisma.comment.create({
                data: {
                    content: getRandomElement(userComments),
                    queryId: query.id,
                    userId: getRandomElement(allVoterUsers).id,
                }
            });
        }
    }
  }
  console.log("✅ Bulk data generated successfully.");

  // 11. Generate Bulk Complaints for each Voter
  console.log("\n📝 Generating Bulk Complaints...");
  let totalComplaintsCreated = 0;
  for (const user of allVoterUsers) {
      const declinedQueriesByUser = await prisma.query.findMany({
          where: {
              userId: user.id,
              status: QueryStatus.DECLINED,
          }
      });

      const numComplaints = getRandomNumber(4, 5);
      for (let i = 0; i < numComplaints; i++) {
          let complaintInputData;

          // Alternate between query-related (if possible) and direct complaints
          if (i % 2 === 0 && declinedQueriesByUser.length > 0) {
              // Create a complaint linked to a declined query
              const randomDeclinedQuery = getRandomElement(declinedQueriesByUser);
              complaintInputData = {
                  userId: user.id,
                  queryId: randomDeclinedQuery.id,
                  subject: deniedQueryComplaintData.subject,
                  description: deniedQueryComplaintData.description,
                  status: ComplaintStatus.OPEN
              };
          } else {
              // Create a direct complaint (not linked to a query)
              const randomDirectComplaint = getRandomElement(directComplaintData);
              complaintInputData = {
                  userId: user.id,
                  queryId: null,
                  subject: randomDirectComplaint.subject,
                  description: randomDirectComplaint.description,
                  status: ComplaintStatus.OPEN
              };
          }

          await prisma.complaint.create({ data: complaintInputData });
          totalComplaintsCreated++;
      }
  }
  console.log(`✅ Bulk complaints created successfully: ${totalComplaintsCreated}`);


  // --- FINALIZATION ---
  console.log("\n✅ Seed completed successfully!")
  console.log("\n--- Summary ---")
  console.log(`- ${departments.length} Departments`)
  console.log(`- ${panchayats.length} Panchayats`)
  console.log(`- ${offices.length} Offices`)
  console.log(`- ${ngos.length} NGOs`)
  console.log(`- ${totalStatsCreated} Service Stats`)
  console.log(`- ${allVoterUsers.length + panchayatUsers.length + 1} Users (1 Admin, ${panchayatUsers.length} Panchayat, ${allVoterUsers.length} Voters)`)
  console.log(`- ${totalComplaintsCreated} Complaints`) // Added complaint count to summary

  console.log("\n🔐 Login Credentials (Password for all is 'password123'):")
  console.log(`Admin: ${adminUser.email}`)
  console.log(`Panchayat (Indore): ${panchayatUsers[0].email}`)
  console.log(`Voter (Indore): ${allVoterUsers[0].email}`)
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:")
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log("\n🔌 Disconnecting Prisma Client...")
    await prisma.$disconnect()
  })