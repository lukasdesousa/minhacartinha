ALTER TABLE "letters"
  ADD COLUMN "showFavoritePlace" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "expiresAt" TIMESTAMP(3);

-- Every already-published free letter follows the same two-day lifetime.
-- createdAt is the safe fallback for legacy rows that predate publishedAt.
UPDATE "letters"
SET "expiresAt" = COALESCE("publishedAt", "createdAt") + INTERVAL '2 days'
WHERE "status" = 'PUBLISHED' AND "premiumStatus" <> 'PREMIUM';

ALTER TABLE "letters"
  ADD CONSTRAINT "letters_free_publication_expiration_required"
  CHECK ("status" <> 'PUBLISHED' OR "premiumStatus" = 'PREMIUM' OR "expiresAt" IS NOT NULL);

CREATE INDEX "letters_status_premiumStatus_expiresAt_idx"
  ON "letters"("status", "premiumStatus", "expiresAt");

-- Keep the financial ledger after personal letter content expires.
-- The cleanup clears activeLetterId before deleting a letter.
ALTER TABLE "payments" DROP CONSTRAINT "payments_letterId_fkey";
ALTER TABLE "payments" ALTER COLUMN "letterId" DROP NOT NULL;
ALTER TABLE "payments" ADD CONSTRAINT "payments_letterId_fkey"
  FOREIGN KEY ("letterId") REFERENCES "letters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "cloudinary_deletions" (
  "id" TEXT NOT NULL,
  "publicId" VARCHAR(255) NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastError" VARCHAR(500),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastAttemptAt" TIMESTAMP(3),
  CONSTRAINT "cloudinary_deletions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "cloudinary_deletions_publicId_key" ON "cloudinary_deletions"("publicId");
CREATE INDEX "cloudinary_deletions_createdAt_idx" ON "cloudinary_deletions"("createdAt");
