/*
  Warnings:

  - You are about to drop the column `failed_reason` on the `ApiCall` table. All the data in the column will be lost.
  - You are about to drop the column `success` on the `ApiCall` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ApiCallStatus" AS ENUM ('SUCCESS', 'FAIL');

-- AlterEnum
ALTER TYPE "ApiCallFailCode" ADD VALUE 'API_KEY_NOT_PROVIDED';

-- AlterTable
ALTER TABLE "ApiCall" DROP COLUMN "failed_reason",
DROP COLUMN "success",
ADD COLUMN     "fail_code" "ApiCallFailCode",
ADD COLUMN     "request_body" JSONB,
ADD COLUMN     "response_body" JSONB,
ADD COLUMN     "status" "ApiCallStatus" DEFAULT 'FAIL',
ALTER COLUMN "api_key_id" DROP NOT NULL;
