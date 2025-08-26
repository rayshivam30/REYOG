-- CreateTable
CREATE TABLE "public"."query_likes" (
    "id" TEXT NOT NULL,
    "queryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "query_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "query_likes_queryId_userId_key" ON "public"."query_likes"("queryId", "userId");

-- AddForeignKey
ALTER TABLE "public"."query_likes" ADD CONSTRAINT "query_likes_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "public"."queries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."query_likes" ADD CONSTRAINT "query_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
