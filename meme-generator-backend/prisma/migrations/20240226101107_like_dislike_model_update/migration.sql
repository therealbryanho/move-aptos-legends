/*
  Warnings:

  - You are about to drop the column `response_feedback` on the `Responses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Responses" DROP COLUMN "response_feedback";

-- DropEnum
DROP TYPE "ResponseFeedbackOption";

-- CreateTable
CREATE TABLE "ResponseLikes" (
    "response_likes_id" SERIAL NOT NULL,
    "response_id" INTEGER NOT NULL,
    "liked_by" INTEGER NOT NULL,

    CONSTRAINT "ResponseLikes_pkey" PRIMARY KEY ("response_likes_id")
);

-- CreateTable
CREATE TABLE "ResponseDislikes" (
    "response_likes_id" SERIAL NOT NULL,
    "response_id" INTEGER NOT NULL,
    "liked_by" INTEGER NOT NULL,

    CONSTRAINT "ResponseDislikes_pkey" PRIMARY KEY ("response_likes_id")
);

-- AddForeignKey
ALTER TABLE "ResponseLikes" ADD CONSTRAINT "ResponseLikes_liked_by_fkey" FOREIGN KEY ("liked_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseLikes" ADD CONSTRAINT "ResponseLikes_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "Responses"("response_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseDislikes" ADD CONSTRAINT "ResponseDislikes_liked_by_fkey" FOREIGN KEY ("liked_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseDislikes" ADD CONSTRAINT "ResponseDislikes_response_id_fkey" FOREIGN KEY ("response_id") REFERENCES "Responses"("response_id") ON DELETE RESTRICT ON UPDATE CASCADE;
