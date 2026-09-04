import { randomUUID } from "node:crypto";
import { LetterImageRole, LetterStatus, LetterTheme } from "@/generated/prisma/client";
import {
  removeCloudinaryImages,
  uploadLetterImage,
  type UploadedLetterImage,
} from "@/lib/cloudinary";
import { createLetterSlug } from "@/lib/letters/slug";
import {
  LetterValidationError,
  parseLetterPayload,
  type ValidatedLetterImage,
} from "@/lib/letters/validation";
import { withPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 4_400_000;

const themeMap = {
  vinho: LetterTheme.ROMANCE,
  lavanda: LetterTheme.LAVENDER,
  entardecer: LetterTheme.SUNSET,
} as const;

const imageRoleMap = {
  HERO: LetterImageRole.HERO,
  GALLERY: LetterImageRole.GALLERY,
  FAVORITE_PLACE: LetterImageRole.FAVORITE_PLACE,
} as const;

export async function POST(request: Request) {
  const uploadedPublicIds: string[] = [];
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return Response.json(
      { error: "As imagens ultrapassaram o limite permitido para esta cartinha." },
      { status: 413 },
    );
  }

  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_REQUEST_BYTES) {
      return Response.json(
        { error: "As imagens ultrapassaram o limite permitido para esta cartinha." },
        { status: 413 },
      );
    }

    const payload = parseLetterPayload(JSON.parse(rawBody));
    const slug = `${createLetterSlug(payload.recipientName)}-${randomUUID().replaceAll("-", "").slice(0, 16)}`;
    const uploadBatchId = randomUUID();
    const now = new Date();
    const uploadedImages: Array<{
      image: ValidatedLetterImage;
      uploaded: UploadedLetterImage;
    }> = [];

    for (const image of payload.images) {
      const uploaded = await uploadLetterImage(image, uploadBatchId);
      uploadedPublicIds.push(uploaded.publicId);
      uploadedImages.push({ image, uploaded });
    }

    const letter = await withPrisma((prisma) =>
      prisma.letter.create({
        data: {
          slug,
          recipientName: payload.recipientName,
          senderName: payload.senderName,
          title: payload.title,
          message: payload.message,
          signature: payload.signature,
          relationshipStartedAt: payload.relationshipStartedAt,
          openingText: payload.openingText,
          closingText: payload.closingText,
          favoritePlaceName: payload.favoritePlaceName,
          favoritePlaceCaption: payload.favoritePlaceCaption,
          songTitle: payload.songTitle,
          songArtist: payload.songArtist,
          spotifyUrl: payload.spotifyUrl,
          theme: themeMap[payload.themeId],
          showRelationshipTime: payload.showRelationshipTime,
          showMusic: payload.showMusic,
          status: LetterStatus.PUBLISHED,
          publishedAt: now,
          images: {
            create: uploadedImages.map(({ image, uploaded }) => ({
              role: imageRoleMap[image.role],
              position: image.position,
              caption: image.caption,
              assetId: uploaded.assetId,
              publicId: uploaded.publicId,
              secureUrl: uploaded.secureUrl,
              format: uploaded.format,
              width: uploaded.width,
              height: uploaded.height,
              size: uploaded.size,
            })),
          },
        },
        select: {
          id: true,
          slug: true,
        },
      }),
    );

    return Response.json(
      {
        id: letter.id,
        slug: letter.slug,
        path: `/para/${letter.slug}`,
      },
      { status: 201 },
    );
  } catch (error) {
    if (uploadedPublicIds.length) {
      await removeCloudinaryImages(uploadedPublicIds);
    }

    if (error instanceof LetterValidationError) {
      return Response.json({ error: error.message }, { status: 422 });
    }

    if (error instanceof SyntaxError) {
      return Response.json({ error: "O conteúdo enviado é inválido." }, { status: 400 });
    }

    console.error("Não foi possível criar a cartinha.", error);
    return Response.json(
      { error: "Não foi possível publicar a cartinha agora. Tente novamente." },
      { status: 500 },
    );
  }
}
