/*
  Warnings:

  - The primary key for the `ChatroomUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `DM` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatroomUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('OWNER', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "VISIBILITY" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ChatroomUsers" DROP CONSTRAINT "_ChatroomUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatroomUsers" DROP CONSTRAINT "_ChatroomUsers_B_fkey";

-- AlterTable
ALTER TABLE "Chatroom" ADD COLUMN     "password" TEXT,
ADD COLUMN     "visibility" "VISIBILITY" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "ChatroomUsers" DROP CONSTRAINT "ChatroomUsers_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMuted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'USER',
ADD CONSTRAINT "ChatroomUsers_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "DM";

-- DropTable
DROP TABLE "_ChatroomUsers";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ChatroomUsers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
