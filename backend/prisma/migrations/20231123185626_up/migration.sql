/*
  Warnings:

  - You are about to drop the column `blockedById` on the `Blocks` table. All the data in the column will be lost.
  - You are about to drop the column `accessToken` on the `User` table. All the data in the column will be lost.
  - The `wins` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `losses` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `blockedId` to the `Blocks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MODE" AS ENUM ('CLASSIC', 'AIBUGGY');

-- DropForeignKey
ALTER TABLE "Blocks" DROP CONSTRAINT "Blocks_blockedById_fkey";

-- AlterTable
ALTER TABLE "Blocks" DROP COLUMN "blockedById",
ADD COLUMN     "blockedId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "accessToken",
DROP COLUMN "wins",
ADD COLUMN     "wins" INTEGER[] DEFAULT ARRAY[0, 0]::INTEGER[],
DROP COLUMN "losses",
ADD COLUMN     "losses" INTEGER[] DEFAULT ARRAY[0, 0]::INTEGER[];

-- CreateTable
CREATE TABLE "MatchHistory" (
    "id" SERIAL NOT NULL,
    "player1Id" INTEGER NOT NULL,
    "player2Id" INTEGER NOT NULL,
    "score1" INTEGER NOT NULL DEFAULT 0,
    "score2" INTEGER NOT NULL DEFAULT 0,
    "mode" "MODE" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Blocks" ADD CONSTRAINT "Blocks_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
