/*
  Warnings:

  - You are about to drop the `ApiCall` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApiKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApiCall" DROP CONSTRAINT "ApiCall_api_key_id_fkey";

-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_user_id_fkey";

-- DropTable
DROP TABLE "ApiCall";

-- DropTable
DROP TABLE "ApiKey";

-- DropEnum
DROP TYPE "ApiCallFailCode";

-- DropEnum
DROP TYPE "ApiCallStatus";

-- DropEnum
DROP TYPE "Service";
