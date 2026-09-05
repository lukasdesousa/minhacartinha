import { randomUUID } from "node:crypto";
import {
  EmailDeliveryStatus,
  LetterImageRole,
  LetterStatus,
  LetterTheme,
  Prisma,
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
import { getPublicLetterPath } from "@/lib/letters/public-url";
import { withPrisma } from "@/lib/prisma";
import { LetterAccessError, getOwnerToken, requireLetterOwner } from "@/lib/letters/ownership";
import { readLetterJson, RequestBodyError, REQUEST_KEY_PATTERN } from "@/lib/letters/request";
import { assertPublishEntitlement, needsPremium, PremiumRequiredError } from "@/lib/letters/entitlement";

export const runtime = "nodejs";

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
  let claimedLetterId: string | null = null;
  const publicationClaim = randomUUID();

  try {
    getOwnerToken(request);
    const requestKey = request.headers.get("Idempotency-Key")?.trim() ?? "";
    if (!REQUEST_KEY_PATTERN.test(requestKey)) {
      return Response.json(
        { error: "Não foi possível identificar este envio. Atualize a página e tente novamente." },
        { status: 400 },
      );
    }

    const draft = await withPrisma((prisma) => prisma.letter.findUnique({ where: { requestKey } }));
    if (!draft) throw new RequestBodyError("Salve o rascunho antes de publicar a cartinha.", 409);
    requireLetterOwner(request, draft);
    if (draft.status === LetterStatus.PUBLISHED) {
      return Response.json(await getExistingLetterResponse(requestKey, request.url), { headers: { "Cache-Control": "private, no-store" } });
    }
    const payload = parseLetterPayload(await readLetterJson(request));
    const premiumFeatures = { quizEnabled: payload.quizEnabled, galleryCount: payload.images.filter((image) => image.role === "GALLERY").length };
    assertPublishEntitlement(premiumFeatures, draft.premiumStatus);
    const requiresPremium = needsPremium(premiumFeatures);
    const claim = await withPrisma((prisma) => prisma.letter.updateMany({
      where: {
        id: draft.id, status: LetterStatus.DRAFT,
        OR: [{ publicationClaim: null }, { publicationClaimedAt: { lt: new Date(Date.now() - 10 * 60_000) } }],
      },
      data: { publicationClaim, publicationClaimedAt: new Date() },
    }));
    if (!claim.count) throw new RequestBodyError("Esta cartinha está sendo publicada. Aguarde um instante e tente novamente.", 409);
    claimedLetterId = draft.id;
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

    const letter = await withPrisma((prisma) => prisma.$transaction(async (tx) => {
      // Compare entitlement again at commit: a concurrent refund must not let
      // an unpaid Premium draft publish after image uploads complete.
      const published = await tx.letter.updateMany({
        where: { id: draft.id, status: LetterStatus.DRAFT, publicationClaim, ...(requiresPremium ? { premiumStatus: "PREMIUM" as const } : {}) },
        data: {
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
          quizEnabled: payload.quizEnabled,
          quiz: payload.quiz,
          draftData: Prisma.DbNull,
          publicationClaim: null,
          publicationClaimedAt: null,
          status: LetterStatus.PUBLISHED,
          publishedAt: now,
          emailStatus: EmailDeliveryStatus.PENDING,
        },
      });
      if (!published.count) {
        if (requiresPremium) throw new PremiumRequiredError();
        throw new RequestBodyError("O estado da cartinha mudou. Tente publicar novamente.", 409);
      }
      return tx.letter.update({
        where: { id: draft.id },
        data: {
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
      });
    }));
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
      void error;
      console.error(
        `A cartinha ${letter.id} foi criada, mas a preparação da entrega falhou.`,
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

    if (error instanceof LetterAccessError || error instanceof RequestBodyError || error instanceof PremiumRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof LetterValidationError) {
      return Response.json({ error: error.message }, { status: 422 });
    }

    if (error instanceof SyntaxError) {
      return Response.json({ error: "O conteúdo enviado é inválido." }, { status: 400 });
    }

    console.error("[letter.publish] Não foi possível publicar a cartinha.");
    return Response.json(
      { error: "Não foi possível publicar a cartinha agora. Tente novamente." },
      { status: 500 },
    );
  } finally {
    if (claimedLetterId && !letterWasCreated) {
      await withPrisma((prisma) => prisma.letter.updateMany({
        where: { id: claimedLetterId!, publicationClaim },
        data: { publicationClaim: null, publicationClaimedAt: null },
      })).catch(() => console.error("[letter.publish] Falha ao liberar tentativa de publicação."));
    }
  }
}
