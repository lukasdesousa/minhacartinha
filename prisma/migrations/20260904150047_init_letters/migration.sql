-- CreateEnum
CREATE TYPE "LetterTheme" AS ENUM ('ROMANCE', 'LAVENDER', 'SUNSET');

-- CreateEnum
CREATE TYPE "LetterStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "LetterImageRole" AS ENUM ('HERO', 'GALLERY', 'FAVORITE_PLACE');

-- CreateTable
CREATE TABLE "letters" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "recipientName" VARCHAR(40) NOT NULL,
    "senderName" VARCHAR(40) NOT NULL,
    "title" VARCHAR(70) NOT NULL,
    "message" TEXT NOT NULL,
    "signature" VARCHAR(60) NOT NULL,
    "specialDate" DATE,
    "openingText" VARCHAR(70) NOT NULL,
    "closingText" VARCHAR(100) NOT NULL,
    "favoritePlaceName" VARCHAR(60),
    "favoritePlaceCaption" VARCHAR(180),
    "songTitle" VARCHAR(60),
    "songArtist" VARCHAR(70),
    "theme" "LetterTheme" NOT NULL DEFAULT 'ROMANCE',
    "showDate" BOOLEAN NOT NULL DEFAULT true,
    "showMusic" BOOLEAN NOT NULL DEFAULT true,
    "status" "LetterStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "letter_images" (
    "id" TEXT NOT NULL,
    "letterId" TEXT NOT NULL,
    "role" "LetterImageRole" NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "caption" VARCHAR(180),
    "mimeType" VARCHAR(30) NOT NULL,
    "bytes" BYTEA NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "letter_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "letters_slug_key" ON "letters"("slug");

-- CreateIndex
CREATE INDEX "letters_status_createdAt_idx" ON "letters"("status", "createdAt");

-- CreateIndex
CREATE INDEX "letter_images_letterId_role_position_idx" ON "letter_images"("letterId", "role", "position");

-- AddForeignKey
ALTER TABLE "letter_images" ADD CONSTRAINT "letter_images_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "letters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
