/*
  Warnings:

  - Made the column `fail_code` on table `ApiCall` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `ApiCall` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ApiCall" ALTER COLUMN "fail_code" SET NOT NULL,
ALTER COLUMN "fail_code" SET DEFAULT 'INCOMPLETE',
ALTER COLUMN "status" SET NOT NULL;
