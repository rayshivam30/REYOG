-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- Check users table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'User';

-- Check if there are any users
SELECT COUNT(*) as user_count FROM "User";

-- Check migrations table
SELECT * FROM "_prisma_migrations";
