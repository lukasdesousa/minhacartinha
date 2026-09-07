import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { removeCloudinaryImages } from "@/lib/cloudinary";
import { withPrisma } from "@/lib/prisma";

const DEFAULT_LETTER_BATCH_SIZE = 25;
const DEFAULT_IMAGE_BATCH_SIZE = 200;

type CleanupOptions = {
  now?: Date;
  letterBatchSize?: number;
  imageBatchSize?: number;
};

async function stageExpiredLetter(letterId: string, now: Date) {
  return withPrisma((prisma) => prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "letters" WHERE "id" = ${letterId} FOR UPDATE`;
    const letter = await tx.letter.findFirst({
      where: {
        id: letterId,
        status: "PUBLISHED",
        premiumStatus: { not: "PREMIUM" },
        expiresAt: { lte: now },
      },
      select: {
        images: { select: { publicId: true } },
      },
    });
    if (!letter) return false;

    if (letter.images.length) {
      await tx.cloudinaryDeletion.createMany({
        data: letter.images.map(({ publicId }) => ({ publicId })),
        skipDuplicates: true,
      });
    }
    await tx.payment.updateMany({
      where: { letterId },
      data: { activeLetterId: null },
    });
    await tx.letter.delete({ where: { id: letterId } });
    return true;
  }));
}

async function drainCloudinaryDeletionQueue(imageBatchSize: number, now: Date) {
  const queued = await withPrisma((prisma) => prisma.cloudinaryDeletion.findMany({
    orderBy: { createdAt: "asc" },
    take: imageBatchSize,
  }));
  if (!queued.length) return { imagesDeleted: 0, imagesPending: 0 };

  const result = await removeCloudinaryImages(queued.map(({ publicId }) => publicId));
  const failed = new Set(result.failedPublicIds);
  const deletedIds = queued.filter(({ publicId }) => !failed.has(publicId)).map(({ id }) => id);
  const failedIds = queued.filter(({ publicId }) => failed.has(publicId)).map(({ id }) => id);

  await withPrisma(async (prisma) => {
    await prisma.$transaction([
      prisma.cloudinaryDeletion.deleteMany({ where: { id: { in: deletedIds } } }),
      prisma.cloudinaryDeletion.updateMany({
        where: { id: { in: failedIds } },
        data: {
          attempts: { increment: 1 },
          lastAttemptAt: now,
          lastError: "O Cloudinary não confirmou a exclusão; uma nova tentativa será feita.",
        },
      }),
    ]);
  });

  return { imagesDeleted: deletedIds.length, imagesPending: failedIds.length };
}

export async function cleanupExpiredLetters(options: CleanupOptions = {}) {
  const now = options.now ?? new Date();
  const letterBatchSize = options.letterBatchSize ?? DEFAULT_LETTER_BATCH_SIZE;
  const imageBatchSize = options.imageBatchSize ?? DEFAULT_IMAGE_BATCH_SIZE;
  const expired = await withPrisma((prisma) => prisma.letter.findMany({
    where: {
      status: "PUBLISHED",
      premiumStatus: { not: "PREMIUM" },
      expiresAt: { lte: now },
    },
    orderBy: { expiresAt: "asc" },
    select: { id: true },
    take: letterBatchSize,
  }));

  let lettersDeleted = 0;
  for (const { id } of expired) {
    try {
      if (await stageExpiredLetter(id, now)) lettersDeleted += 1;
    } catch (error) {
      const code = error instanceof Prisma.PrismaClientKnownRequestError ? error.code : "UNKNOWN";
      console.error(`[letter.expiration] Falha ao remover cartinha expirada (${code}).`);
    }
  }

  const images = await drainCloudinaryDeletionQueue(imageBatchSize, now);
  return { lettersDeleted, ...images };
}
