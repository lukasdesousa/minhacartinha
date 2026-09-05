import { LetterAccessError } from "@/lib/letters/ownership";
import { PaymentError } from "@/lib/payments/config";
import { createPix, getPixState, safePaymentErrorCode } from "@/lib/payments/service";

export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };

function validLetterId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{10,64}$/.test(value);
}

function errorResponse(error: unknown) {
  if (error instanceof PaymentError || error instanceof LetterAccessError) {
    return Response.json({ error: error.message }, { status: error.status, headers });
  }
  if (error instanceof SyntaxError) return Response.json({ error: "Dados inválidos." }, { status: 400, headers });
  console.error(JSON.stringify({ area: "payments", event: "request_failed", code: safePaymentErrorCode(error) }));
  return Response.json({ error: "O Pix está temporariamente indisponível. Tente novamente em instantes." }, { status: 503, headers });
}

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 2048) throw new PaymentError("Dados inválidos.", 413, "BODY_TOO_LARGE");
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 2048) throw new PaymentError("Dados inválidos.", 413, "BODY_TOO_LARGE");
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new PaymentError("Dados inválidos.", 400, "INVALID_BODY");
    const { letterId, payerEmail } = body as Record<string, unknown>;
    if (!validLetterId(letterId)) throw new PaymentError("Cartinha inválida.", 400, "INVALID_LETTER_ID");
    if (typeof payerEmail !== "string" || payerEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payerEmail.trim())) {
      throw new PaymentError("Informe seu e-mail para gerar o Pix.", 400, "INVALID_PAYER_EMAIL");
    }
    return Response.json(await createPix(request, letterId, payerEmail.trim().toLowerCase()), { headers });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request: Request) {
  try {
    const letterId = new URL(request.url).searchParams.get("letterId");
    if (!validLetterId(letterId)) throw new PaymentError("Cartinha inválida.", 400, "INVALID_LETTER_ID");
    return Response.json(await getPixState(request, letterId), { headers });
  } catch (error) {
    return errorResponse(error);
  }
}
