-- Preserve the existing special date while giving it relationship semantics.
ALTER TABLE "letters" RENAME COLUMN "specialDate" TO "relationshipStartedAt";

ALTER TABLE "letters"
ALTER COLUMN "relationshipStartedAt" TYPE TIMESTAMP(3)
USING "relationshipStartedAt"::timestamp(3);

ALTER TABLE "letters" RENAME COLUMN "showDate" TO "showRelationshipTime";

-- Add the canonical Spotify track URL used by the official embed.
ALTER TABLE "letters" ADD COLUMN "spotifyUrl" VARCHAR(300);
