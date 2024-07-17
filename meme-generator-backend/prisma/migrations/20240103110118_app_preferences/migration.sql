-- CreateTable
CREATE TABLE "AppPreferences" (
    "app_preference_id" SERIAL NOT NULL,
    "allow_document_upload_in_chat" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AppPreferences_pkey" PRIMARY KEY ("app_preference_id")
);
