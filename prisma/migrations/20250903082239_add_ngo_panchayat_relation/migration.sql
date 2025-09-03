/*
  Warnings:

  - You are about to drop the column `panchayatId` on the `ngos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ngos" DROP CONSTRAINT "ngos_panchayatId_fkey";

-- AlterTable
ALTER TABLE "public"."ngos" DROP COLUMN "panchayatId";
