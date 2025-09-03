-- AlterTable
ALTER TABLE "public"."ngos" ADD COLUMN     "panchayatId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."ngos" ADD CONSTRAINT "ngos_panchayatId_fkey" FOREIGN KEY ("panchayatId") REFERENCES "public"."panchayats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
