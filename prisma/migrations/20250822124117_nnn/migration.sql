-- AlterTable
ALTER TABLE "public"."queries" ADD COLUMN     "upvoteCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."query_upvotes" (
    "id" TEXT NOT NULL,
    "queryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "query_upvotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "query_upvotes_queryId_userId_key" ON "public"."query_upvotes"("queryId", "userId");

-- AddForeignKey
ALTER TABLE "public"."query_upvotes" ADD CONSTRAINT "query_upvotes_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "public"."queries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."query_upvotes" ADD CONSTRAINT "query_upvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
