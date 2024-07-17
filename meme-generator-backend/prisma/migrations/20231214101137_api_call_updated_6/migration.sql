/*
  Warnings:

  - The values [SERVICE_A] on the enum `Service` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Service_new" AS ENUM ('IP_COUNTRY_LOOKUP', 'IP_COMPLETE_LOOKUP');
ALTER TABLE "ApiCall" ALTER COLUMN "service" TYPE "Service_new" USING ("service"::text::"Service_new");
ALTER TYPE "Service" RENAME TO "Service_old";
ALTER TYPE "Service_new" RENAME TO "Service";
DROP TYPE "Service_old";
COMMIT;
