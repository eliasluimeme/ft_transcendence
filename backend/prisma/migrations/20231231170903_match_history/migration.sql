/*
  Warnings:

  - You are about to drop the column `player1Id` on the `MatchHistory` table. All the data in the column will be lost.
  - You are about to drop the column `player2Id` on the `MatchHistory` table. All the data in the column will be lost.
  - Added the required column `looserId` to the `MatchHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `MatchHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MatchHistory" DROP CONSTRAINT "MatchHistory_player1Id_fkey";

-- DropForeignKey
ALTER TABLE "MatchHistory" DROP CONSTRAINT "MatchHistory_player2Id_fkey";

-- AlterTable
ALTER TABLE "MatchHistory" DROP COLUMN "player1Id",
DROP COLUMN "player2Id",
ADD COLUMN     "looserId" INTEGER NOT NULL,
ADD COLUMN     "winnerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchHistory" ADD CONSTRAINT "MatchHistory_looserId_fkey" FOREIGN KEY ("looserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
