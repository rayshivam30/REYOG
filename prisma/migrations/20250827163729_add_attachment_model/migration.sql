/*
  Warnings:

  - You are about to drop the column `attachments` on the `queries` table. All the data in the column will be lost.
  - You are about to drop the column `attachments` on the `query_updates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."queries" DROP COLUMN "attachments";

-- AlterTable
ALTER TABLE "public"."query_updates" DROP COLUMN "attachments";

-- CreateTable
CREATE TABLE "public"."attachments" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "publicId" TEXT,
    "queryId" TEXT,
    "queryUpdateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "public"."queries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_queryUpdateId_fkey" FOREIGN KEY ("queryUpdateId") REFERENCES "public"."query_updates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
