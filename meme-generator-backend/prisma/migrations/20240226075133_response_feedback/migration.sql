-- CreateEnum
CREATE TYPE "ResponseFeedbackOption" AS ENUM ('NONE', 'LIKED', 'DISLIKED');

-- AlterTable
ALTER TABLE "Responses" ADD COLUMN     "response_feedback" "ResponseFeedbackOption" NOT NULL DEFAULT 'NONE';
