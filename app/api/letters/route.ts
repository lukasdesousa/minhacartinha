import { randomUUID } from "node:crypto";
import {
  EmailDeliveryStatus,
  LetterImageRole,
  LetterStatus,
  LetterTheme,
} from "@/generated/prisma/client";
import {
  removeCloudinaryImages,
  uploadLetterImage,
  type UploadedLetterImage,
} from "@/lib/cloudinary";
import {
  LetterValidationError,
  parseLetterPayload,
  type ValidatedLetterImage,
} from "@/lib/letters/validation";
import {
  deliverCreatedLetter,
  getExistingLetterResponse,
} from "@/lib/letters/delivery";
import { createLetterPublicId } from "@/lib/letters/public-id";
import { getPublicLetterPath } from "@/lib/letters/public-url";
import { withPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 4_400_000;
const REQUEST_KEY_PATTERN = /^[A-Za-z0-9_-]{20,64}$/;

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
  let letterWasCreated = false;
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return Response.json(
      { error: "As imagens ultrapassaram o limite permitido para esta cartinha." },
      { status: 413 },
    );
  }

  try {
    const requestKey = request.headers.get("Idempotency-Key")?.trim() ?? "";
    if (!REQUEST_KEY_PATTERN.test(requestKey)) {
      return Response.json(
        { error: "Não foi possível identificar este envio. Atualize a página e tente novamente." },
        { status: 400 },
      );
    }

    const existingLetter = await getExistingLetterResponse(requestKey, request.url);
    if (existingLetter) {
      return Response.json(existingLetter, { status: 200 });
    }

    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_REQUEST_BYTES) {
      return Response.json(
        { error: "As imagens ultrapassaram o limite permitido para esta cartinha." },
        { status: 413 },
      );
    }

    const payload = parseLetterPayload(JSON.parse(rawBody));
    const slug = createLetterPublicId();
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
          requestKey,
          recipientName: payload.recipientName,
          recipientEmail: payload.recipientEmail,
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
          emailStatus: EmailDeliveryStatus.PENDING,
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
    letterWasCreated = true;

    try {
      const delivery = await deliverCreatedLetter(
        {
          ...letter,
          recipientEmail: payload.recipientEmail,
          recipientName: payload.recipientName,
          senderName: payload.senderName,
          themeId: payload.themeId,
        },
        request.url,
      );
      return Response.json(delivery, { status: 201 });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "falha desconhecida";
      console.error(
        `A cartinha ${letter.id} foi criada, mas a preparação da entrega falhou: ${reason}`,
      );
      return Response.json(
        {
          id: letter.id,
          slug: letter.slug,
          path: getPublicLetterPath(letter.slug),
          publicUrl: new URL(getPublicLetterPath(letter.slug), request.url).toString(),
          qrCodeDataUrl: "",
          emailStatus: "failed",
          emailMessage: "A cartinha está pronta, mas a entrega por e-mail precisa ser reenviada.",
        },
        { status: 201 },
      );
    }
  } catch (error) {
    if (!letterWasCreated && uploadedPublicIds.length) {
      await removeCloudinaryImages(uploadedPublicIds);
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      const requestKey = request.headers.get("Idempotency-Key")?.trim() ?? "";
      const existingLetter = await getExistingLetterResponse(requestKey, request.url);
      if (existingLetter) return Response.json(existingLetter, { status: 200 });
    }

    if (error instanceof LetterValidationError) {
      return Response.json({ error: error.message }, { status: 422 });
    }

    if (error instanceof SyntaxError) {
      return Response.json({ error: "O conteúdo enviado é inválido." }, { status: 400 });
    }

    const reason = error instanceof Error ? error.message : "falha desconhecida";
    console.error(`Não foi possível criar a cartinha: ${reason}`);
    return Response.json(
      { error: "Não foi possível publicar a cartinha agora. Tente novamente." },
      { status: 500 },
    );
  }
}
