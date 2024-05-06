/*
  Warnings:

  - You are about to drop the `GoogleSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GoogleSession" DROP CONSTRAINT "GoogleSession_userId_fkey";

-- DropTable
DROP TABLE "GoogleSession";
