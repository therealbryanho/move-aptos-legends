-- CreateEnum
CREATE TYPE "Service" AS ENUM ('SERVICE_A');

-- CreateEnum
CREATE TYPE "ApiCallFailCode" AS ENUM ('UNAUTHORIZED_ACCESS', 'INVALID_PARAMETERS', 'RATE_LIMIT_EXCEEDED', 'NETWORK_ERROR', 'INTERNAL_SERVER_ERROR');

-- CreateTable
CREATE TABLE "ApiCall" (
    "api_call_id" SERIAL NOT NULL,
    "api_key_id" INTEGER NOT NULL,
    "service" "Service" NOT NULL,
    "success" BOOLEAN NOT NULL,
    "failed_reason" "ApiCallFailCode",
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiCall_pkey" PRIMARY KEY ("api_call_id")
);

-- AddForeignKey
ALTER TABLE "ApiCall" ADD CONSTRAINT "ApiCall_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "ApiKey"("api_key_id") ON DELETE CASCADE ON UPDATE CASCADE;
