/*
  Warnings:

  - The `wins` column on the `LadderLevel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `losses` column on the `LadderLevel` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LadderLevel" DROP COLUMN "wins",
ADD COLUMN     "wins" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "losses",
ADD COLUMN     "losses" INTEGER NOT NULL DEFAULT 0;
