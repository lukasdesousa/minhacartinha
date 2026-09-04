-- CreateEnum
CREATE TYPE "EmailDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "letters"
ADD COLUMN "requestKey" VARCHAR(64),
ADD COLUMN "recipientEmail" VARCHAR(254),
ADD COLUMN "emailStatus" "EmailDeliveryStatus",
ADD COLUMN "emailMessageId" VARCHAR(100),
ADD COLUMN "emailSentAt" TIMESTAMP(3),
ADD COLUMN "emailLastError" VARCHAR(500),
ADD COLUMN "emailAttempts" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "letters_requestKey_key" ON "letters"("requestKey");
