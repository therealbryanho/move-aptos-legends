-- CreateTable
CREATE TABLE "Chats" (
    "chat_id" SERIAL NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "message_id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "Responses" (
    "response_id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "response" TEXT NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "Responses_pkey" PRIMARY KEY ("response_id")
);

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responses" ADD CONSTRAINT "Responses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responses" ADD CONSTRAINT "Responses_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Messages"("message_id") ON DELETE RESTRICT ON UPDATE CASCADE;
