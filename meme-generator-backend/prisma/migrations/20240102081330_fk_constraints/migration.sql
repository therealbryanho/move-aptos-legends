-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_created_by_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_message_id_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_uploaded_by_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_created_by_fkey";

-- DropForeignKey
ALTER TABLE "Responses" DROP CONSTRAINT "Responses_created_by_fkey";

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Messages"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responses" ADD CONSTRAINT "Responses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
