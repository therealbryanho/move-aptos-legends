/*
  Warnings:

  - You are about to drop the column `liked_by` on the `ResponseDislikes` table. All the data in the column will be lost.
  - You are about to drop the column `liked_by` on the `ResponseLikes` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `ResponseDislikes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `ResponseLikes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ResponseDislikes" DROP CONSTRAINT "ResponseDislikes_liked_by_fkey";

-- DropForeignKey
ALTER TABLE "ResponseLikes" DROP CONSTRAINT "ResponseLikes_liked_by_fkey";

-- AlterTable
ALTER TABLE "ResponseDislikes" DROP COLUMN "liked_by",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ResponseLikes" DROP COLUMN "liked_by",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ResponseLikes" ADD CONSTRAINT "ResponseLikes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseDislikes" ADD CONSTRAINT "ResponseDislikes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
