/*
  Warnings:

  - Added the required column `chat_id` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "chat_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chats"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
