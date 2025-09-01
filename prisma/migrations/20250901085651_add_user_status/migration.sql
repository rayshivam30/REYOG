-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'BANNED');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE';
