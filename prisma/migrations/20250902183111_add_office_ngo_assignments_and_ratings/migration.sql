-- CreateTable
CREATE TABLE "public"."query_office_assignments" (
    "id" TEXT NOT NULL,
    "queryId" TEXT NOT NULL,
    "officeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "query_office_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."query_ngo_assignments" (
    "id" TEXT NOT NULL,
    "queryId" TEXT NOT NULL,
    "ngoId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "query_ngo_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."query_ratings" (
    "id" TEXT NOT NULL,
    "queryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "officeId" TEXT,
    "ngoId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "query_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ngo_ratings" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "ngoId" TEXT NOT NULL,

    CONSTRAINT "ngo_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "query_office_assignments_queryId_officeId_key" ON "public"."query_office_assignments"("queryId", "officeId");

-- CreateIndex
CREATE UNIQUE INDEX "query_ngo_assignments_queryId_ngoId_key" ON "public"."query_ngo_assignments"("queryId", "ngoId");

-- CreateIndex
CREATE UNIQUE INDEX "query_ratings_queryId_userId_officeId_key" ON "public"."query_ratings"("queryId", "userId", "officeId");

-- CreateIndex
CREATE UNIQUE INDEX "query_ratings_queryId_userId_ngoId_key" ON "public"."query_ratings"("queryId", "userId", "ngoId");

-- CreateIndex
CREATE UNIQUE INDEX "ngo_ratings_userId_ngoId_key" ON "public"."ngo_ratings"("userId", "ngoId");

-- AddForeignKey
ALTER TABLE "public"."query_office_assignments" ADD CONSTRAINT "query_office_assignments_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "public"."queries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."query_office_assignments" ADD CONSTRAINT "query_office_assignments_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "public"."offices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."query_ngo_assignments" ADD CONSTRAINT "query_ngo_assignments_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "public"."queries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."query_ngo_assignments" ADD CONSTRAINT "query_ngo_assignments_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "public"."ngos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."query_ratings" ADD CONSTRAINT "query_ratings_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "public"."queries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."query_ratings" ADD CONSTRAINT "query_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."query_ratings" ADD CONSTRAINT "query_ratings_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "public"."offices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."query_ratings" ADD CONSTRAINT "query_ratings_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "public"."ngos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ngo_ratings" ADD CONSTRAINT "ngo_ratings_ngoId_fkey" FOREIGN KEY ("ngoId") REFERENCES "public"."ngos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ngo_ratings" ADD CONSTRAINT "ngo_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
