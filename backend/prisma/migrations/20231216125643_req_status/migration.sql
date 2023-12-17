/*
  Warnings:

  - You are about to drop the column `content` on the `DM` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `DM` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `DM` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "REQUEST" ADD VALUE 'NONE';

-- DropForeignKey
ALTER TABLE "DM" DROP CONSTRAINT "DM_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "DM" DROP CONSTRAINT "DM_senderId_fkey";

-- AlterTable
ALTER TABLE "DM" DROP COLUMN "content",
DROP COLUMN "receiverId",
DROP COLUMN "senderId";
