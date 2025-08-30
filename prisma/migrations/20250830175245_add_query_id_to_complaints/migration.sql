-- AlterTable
ALTER TABLE "public"."complaints" ADD COLUMN     "queryId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."complaints" ADD CONSTRAINT "complaints_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "public"."queries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
