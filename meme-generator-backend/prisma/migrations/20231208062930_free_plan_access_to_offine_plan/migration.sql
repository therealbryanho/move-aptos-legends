/*
  Warnings:

  - You are about to drop the column `free_access_expires_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `free_access_given_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `free_access_plan` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "free_access_expires_at",
DROP COLUMN "free_access_given_at",
DROP COLUMN "free_access_plan",
ADD COLUMN     "offline_plan" "Plan",
ADD COLUMN     "offline_plan_access_expires_at" TIMESTAMP(3),
ADD COLUMN     "offline_plan_access_given_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
