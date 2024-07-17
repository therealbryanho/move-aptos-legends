/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "email_verification_code" TEXT,
ADD COLUMN     "verification_email_sent_time" TIMESTAMP(3),
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verified_at" TIMESTAMP(3),
ALTER COLUMN "customer_id" DROP NOT NULL;
