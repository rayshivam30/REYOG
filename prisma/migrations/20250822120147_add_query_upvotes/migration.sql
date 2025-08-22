/*
  Warnings:

  - You are about to drop the `QueryUpvote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."QueryUpvote" DROP CONSTRAINT "QueryUpvote_queryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."QueryUpvote" DROP CONSTRAINT "QueryUpvote_voterId_fkey";

-- DropTable
DROP TABLE "public"."QueryUpvote";
