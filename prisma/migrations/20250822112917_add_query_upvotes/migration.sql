/*
  Warnings:

  - You are about to drop the column `lastLogin` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "lastLogin";

-- CreateTable
CREATE TABLE "public"."QueryUpvote" (
    "id" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "queryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QueryUpvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QueryUpvote_voterId_queryId_key" ON "public"."QueryUpvote"("voterId", "queryId");

-- AddForeignKey
ALTER TABLE "public"."QueryUpvote" ADD CONSTRAINT "QueryUpvote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QueryUpvote" ADD CONSTRAINT "QueryUpvote_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "public"."queries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
