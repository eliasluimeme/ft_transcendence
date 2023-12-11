/*
  Warnings:

  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "level",
DROP COLUMN "rank";

-- CreateTable
CREATE TABLE "LadderLevel" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "level" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LadderLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LadderLevel_userId_key" ON "LadderLevel"("userId");

-- AddForeignKey
ALTER TABLE "LadderLevel" ADD CONSTRAINT "LadderLevel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
