-- CreateTable
CREATE TABLE "ApiKey" (
    "api_key_id" SERIAL NOT NULL,
    "api_key" TEXT NOT NULL,
    "api_key_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("api_key_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_api_key_key" ON "ApiKey"("api_key");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
