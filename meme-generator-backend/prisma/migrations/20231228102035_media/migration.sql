-- CreateTable
CREATE TABLE "Media" (
    "media_id" SERIAL NOT NULL,
    "media_type" TEXT NOT NULL,
    "media_content" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" INTEGER NOT NULL,
    "message_id" INTEGER,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("media_id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Messages"("message_id") ON DELETE SET NULL ON UPDATE CASCADE;
