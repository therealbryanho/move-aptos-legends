/*
  Warnings:

  - The values [RATE_LIMIT_EXCEEDED] on the enum `ApiCallFailCode` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApiCallFailCode_new" AS ENUM ('INCOMPLETE', 'API_KEY_NOT_PROVIDED', 'INVALID_API_KEY', 'NO_SUBSCRIPTION_FOUND', 'MAX_PLAN_LIMIT_REACHED', 'UNAUTHORIZED_ACCESS', 'INVALID_PARAMETERS', 'NETWORK_ERROR', 'INTERNAL_SERVER_ERROR');
ALTER TABLE "ApiCall" ALTER COLUMN "fail_code" DROP DEFAULT;
ALTER TABLE "ApiCall" ALTER COLUMN "fail_code" TYPE "ApiCallFailCode_new" USING ("fail_code"::text::"ApiCallFailCode_new");
ALTER TYPE "ApiCallFailCode" RENAME TO "ApiCallFailCode_old";
ALTER TYPE "ApiCallFailCode_new" RENAME TO "ApiCallFailCode";
DROP TYPE "ApiCallFailCode_old";
ALTER TABLE "ApiCall" ALTER COLUMN "fail_code" SET DEFAULT 'INCOMPLETE';
COMMIT;
