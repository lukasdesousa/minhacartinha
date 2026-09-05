import { Prisma, LetterStatus } from "@/generated/prisma/client";
import { withPrisma } from "@/lib/prisma";
import { createLetterPublicId } from "@/lib/letters/public-id";
import { getOwnerToken, hashOwnerToken, LetterAccessError, requireLetterOwner } from "@/lib/letters/ownership";
import { readLetterJson, RequestBodyError, REQUEST_KEY_PATTERN } from "@/lib/letters/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const privateHeaders = { "Cache-Control": "private, no-store" };

function response(letter: { id: string; premiumStatus: string; status: string; draftData: unknown }) {
  return Response.json({ id: letter.id, premiumStatus: letter.premiumStatus, status: letter.status, draft: letter.draftData }, { headers: privateHeaders });
}

function errorResponse(error: unknown) {
  if (error instanceof LetterAccessError || error instanceof RequestBodyError) {
    return Response.json({ error: error.message }, { status: error.status, headers: privateHeaders });
  }
  if (error instanceof SyntaxError) return Response.json({ error: "O conteúdo enviado é inválido." }, { status: 400, headers: privateHeaders });
  console.error("[letter.draft] Não foi possível salvar ou consultar o rascunho.");
  return Response.json({ error: "Não foi possível acessar o rascunho agora. Sua edição continua neste dispositivo." }, { status: 503, headers: privateHeaders });
}

function draftData(value: unknown): Prisma.InputJsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new RequestBodyError("O rascunho é inválido.", 422);
  const input = value as Record<string, unknown>;
  if (typeof input.website === "string" && input.website.trim()) throw new RequestBodyError("Não foi possível validar este envio.", 422);
  // Only editable content is saved here. Ownership, payment and publication state
  // are never accepted from a browser snapshot. Publication validates all fields.
  const allowed = ["recipientName", "recipientEmail", "senderName", "title", "message", "signature", "relationshipStartedAt", "openingText", "closingText", "heroImage", "gallery", "favoritePlace", "song", "themeId", "showRelationshipTime", "showMusic", "website", "quiz", "quizEnabled"];
  const clean: Record<string, unknown> = {};
  for (const key of allowed) if (Object.hasOwn(input, key)) clean[key] = input[key];
  if (Array.isArray(clean.gallery) && clean.gallery.length > 6) throw new RequestBodyError("Adicione no máximo 6 fotos ao carrossel.", 422);
  if (Array.isArray(clean.quiz) && clean.quiz.length > 20) throw new RequestBodyError("Adicione no máximo 20 perguntas.", 422);
  return clean as Prisma.InputJsonObject;
}

export async function GET(request: Request) {
  try {
    getOwnerToken(request);
    const requestKey = new URL(request.url).searchParams.get("requestKey") ?? "";
    if (!REQUEST_KEY_PATTERN.test(requestKey)) throw new RequestBodyError("O rascunho é inválido.", 400);
    const letter = await withPrisma((prisma) => prisma.letter.findUnique({ where: { requestKey } }));
    if (!letter) return Response.json({ error: "Rascunho não encontrado." }, { status: 404, headers: privateHeaders });
    requireLetterOwner(request, letter);
    return response(letter);
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try {
    const token = getOwnerToken(request);
    const body = await readLetterJson(request);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new RequestBodyError("O rascunho é inválido.", 422);
    const { requestKey, draft } = body as Record<string, unknown>;
    if (typeof requestKey !== "string" || !REQUEST_KEY_PATTERN.test(requestKey)) throw new RequestBodyError("O rascunho é inválido.", 422);
    const snapshot = draftData(draft);
    const letter = await withPrisma(async (prisma) => {
      const result = await prisma.letter.upsert({
        where: { requestKey },
        update: {},
        create: {
          requestKey, ownerTokenHash: hashOwnerToken(token), slug: createLetterPublicId(),
          recipientName: "", senderName: "", title: "", message: "", signature: "", openingText: "", closingText: "",
          draftData: snapshot,
        },
      });
      requireLetterOwner(request, result);
      if (result.status === LetterStatus.PUBLISHED) return result;
      await prisma.letter.updateMany({
        where: { id: result.id, status: LetterStatus.DRAFT }, data: { draftData: snapshot },
      });
      return { ...result, draftData: snapshot };
    });
    return response(letter);
  } catch (error) { return errorResponse(error); }
}
