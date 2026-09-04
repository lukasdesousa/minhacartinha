-- AlterTable
ALTER TABLE "letter_images" DROP COLUMN "bytes",
DROP COLUMN "mimeType",
ADD COLUMN     "assetId" VARCHAR(255) NOT NULL,
ADD COLUMN     "format" VARCHAR(20) NOT NULL,
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "publicId" VARCHAR(255) NOT NULL,
ADD COLUMN     "secureUrl" VARCHAR(600) NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "letter_images_assetId_key" ON "letter_images"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "letter_images_publicId_key" ON "letter_images"("publicId");
