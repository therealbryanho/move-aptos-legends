-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('PLAN_A', 'PLAN_B', 'PLAN_C', 'PLAN_D');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "free_access_expires_at" TIMESTAMP(3),
ADD COLUMN     "free_access_given_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "free_access_plan" "Plan";
