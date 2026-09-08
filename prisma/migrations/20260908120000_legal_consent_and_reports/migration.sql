-- Existing letters intentionally keep these fields NULL: no retroactive consent.
ALTER TABLE "letters"
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "termsVersion" VARCHAR(20),
ADD COLUMN "privacyVersion" VARCHAR(20);

CREATE TYPE "ContentReportReason" AS ENUM (
  'UNAUTHORIZED_IMAGE',
  'PERSONAL_DATA',
  'HARASSMENT',
  'NON_CONSENSUAL_INTIMATE_CONTENT',
  'COPYRIGHT',
  'OTHER'
);

CREATE TYPE "ContentReportStatus" AS ENUM (
  'PENDING',
  'REVIEWING',
  'RESOLVED',
  'REJECTED'
);

CREATE TABLE "content_reports" (
  "id" TEXT NOT NULL,
  "letterReference" VARCHAR(500) NOT NULL,
  "reason" "ContentReportReason" NOT NULL,
  "description" VARCHAR(2000) NOT NULL,
  "contactEmail" VARCHAR(254) NOT NULL,
  "status" "ContentReportStatus" NOT NULL DEFAULT 'PENDING',
  "notificationMessageId" VARCHAR(100),
  "notificationSentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "content_reports_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "content_reports_contactEmail_createdAt_idx" ON "content_reports"("contactEmail", "createdAt");
CREATE INDEX "content_reports_status_createdAt_idx" ON "content_reports"("status", "createdAt");
