/*
  Warnings:

  - You are about to drop the column `avatarId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "avatarId",
DROP COLUMN "avatarUrl";
