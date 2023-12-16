/*
  Warnings:

  - The values [AIBUGGY] on the enum `MODE` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[intraId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `intraId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MODE_new" AS ENUM ('AI', 'CLASSIC');
ALTER TABLE "MatchHistory" ALTER COLUMN "mode" TYPE "MODE_new" USING ("mode"::text::"MODE_new");
ALTER TYPE "MODE" RENAME TO "MODE_old";
ALTER TYPE "MODE_new" RENAME TO "MODE";
DROP TYPE "MODE_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "intraId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_intraId_key" ON "User"("intraId");
