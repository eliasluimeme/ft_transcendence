/*
  Warnings:

  - You are about to drop the column `losses` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LadderLevel" ADD COLUMN     "losses" INTEGER[] DEFAULT ARRAY[0, 0]::INTEGER[],
ADD COLUMN     "wins" INTEGER[] DEFAULT ARRAY[0, 0]::INTEGER[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "losses",
DROP COLUMN "wins";
