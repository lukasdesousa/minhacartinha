CREATE TYPE "PremiumStatus" AS ENUM ('FREE', 'PAYMENT_PENDING', 'PREMIUM');
CREATE TYPE "PaymentStatus" AS ENUM ('CREATING', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED', 'REFUNDED', 'CHARGED_BACK');
CREATE TYPE "AllocationBasis" AS ENUM ('GROSS_AFTER_REFUNDS', 'NET_AFTER_FEES');

ALTER TABLE "letters"
  ADD COLUMN "ownerTokenHash" VARCHAR(64),
  ADD COLUMN "premiumStatus" "PremiumStatus" NOT NULL DEFAULT 'FREE',
  ADD COLUMN "premiumRulesVersion" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "quiz" JSONB,
  ADD COLUMN "quizEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "draftData" JSONB,
  ADD COLUMN "publicationClaim" VARCHAR(36),
  ADD COLUMN "publicationClaimedAt" TIMESTAMP(3);
-- Preserve existing letters without pretending they bought Premium.
ALTER TABLE "letters" ALTER COLUMN "premiumRulesVersion" SET DEFAULT 1;

CREATE TABLE "payments" (
  "id" VARCHAR(36) NOT NULL,
  "letterId" TEXT NOT NULL,
  "activeLetterId" TEXT,
  "externalReference" VARCHAR(64) NOT NULL,
  "idempotencyKey" VARCHAR(36) NOT NULL,
  "providerOrderId" VARCHAR(64),
  "providerPaymentId" VARCHAR(64),
  "providerReferenceId" VARCHAR(64),
  "status" "PaymentStatus" NOT NULL DEFAULT 'CREATING',
  "providerStatus" VARCHAR(50),
  "providerStatusDetail" VARCHAR(100),
  "amountCents" INTEGER NOT NULL,
  "refundedAmountCents" INTEGER NOT NULL DEFAULT 0,
  "feeCents" INTEGER,
  "currency" VARCHAR(3) NOT NULL DEFAULT 'BRL',
  "liveMode" BOOLEAN NOT NULL,
  "payerEmail" VARCHAR(254) NOT NULL,
  "qrCode" TEXT,
  "qrCodeBase64" TEXT,
  "expiresAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "providerUpdatedAt" TIMESTAMP(3),
  "lastSyncedAt" TIMESTAMP(3),
  "syncClaimedAt" TIMESTAMP(3),
  "creationClaimedAt" TIMESTAMP(3),
  "lastErrorCode" VARCHAR(80),
  "allocationBasis" "AllocationBasis" NOT NULL DEFAULT 'GROSS_AFTER_REFUNDS',
  "allocationRateBps" INTEGER NOT NULL DEFAULT 1500,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payments_amount_positive" CHECK ("amountCents" > 0),
  CONSTRAINT "payments_refunds_valid" CHECK ("refundedAmountCents" >= 0 AND "refundedAmountCents" <= "amountCents"),
  CONSTRAINT "payments_fees_valid" CHECK ("feeCents" IS NULL OR "feeCents" >= 0),
  CONSTRAINT "payments_rate_valid" CHECK ("allocationRateBps" BETWEEN 0 AND 10000),
  CONSTRAINT "payments_active_letter_valid" CHECK ("activeLetterId" IS NULL OR "activeLetterId" = "letterId")
);
CREATE UNIQUE INDEX "payments_activeLetterId_key" ON "payments"("activeLetterId");
CREATE UNIQUE INDEX "payments_externalReference_key" ON "payments"("externalReference");
CREATE UNIQUE INDEX "payments_idempotencyKey_key" ON "payments"("idempotencyKey");
CREATE UNIQUE INDEX "payments_providerOrderId_key" ON "payments"("providerOrderId");
CREATE UNIQUE INDEX "payments_providerPaymentId_key" ON "payments"("providerPaymentId");
CREATE UNIQUE INDEX "payments_providerReferenceId_key" ON "payments"("providerReferenceId");
CREATE INDEX "payments_letterId_createdAt_idx" ON "payments"("letterId", "createdAt");
CREATE INDEX "payments_status_liveMode_approvedAt_idx" ON "payments"("status", "liveMode", "approvedAt");
ALTER TABLE "payments" ADD CONSTRAINT "payments_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "letters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "donation_institutions" (
  "id" TEXT NOT NULL,
  "name" VARCHAR(160) NOT NULL,
  "websiteUrl" VARCHAR(600),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "donation_institutions_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "donations" (
  "id" TEXT NOT NULL,
  "institutionId" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "donatedAt" TIMESTAMP(3) NOT NULL,
  "description" VARCHAR(1000) NOT NULL,
  "receiptUrl" VARCHAR(1000),
  "receiptReviewedAt" TIMESTAMP(3),
  "publishedAt" TIMESTAMP(3),
  "note" VARCHAR(1000),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "donations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "donations_amount_positive" CHECK ("amountCents" > 0),
  CONSTRAINT "donations_public_receipt_required" CHECK ("publishedAt" IS NULL OR ("receiptReviewedAt" IS NOT NULL AND "receiptUrl" IS NOT NULL AND "receiptUrl" LIKE 'https://%'))
);
CREATE INDEX "donations_publishedAt_donatedAt_idx" ON "donations"("publishedAt", "donatedAt");
ALTER TABLE "donations" ADD CONSTRAINT "donations_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "donation_institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
