/*
  Warnings:

  - Added the required column `media_name` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "Responses" DROP CONSTRAINT "Responses_message_id_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "media_name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chats"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responses" ADD CONSTRAINT "Responses_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Messages"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;
