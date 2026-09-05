import { InvalidWebhookSignatureError } from "mercadopago";
import { PaymentError } from "@/lib/payments/config";
import { reconcileWebhook, safePaymentErrorCode } from "@/lib/payments/service";
import { verifyOrderWebhook } from "@/lib/payments/webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET?.trim();
  if (!secret) return Response.json({ error: "Webhook indisponível." }, { status: 503 });
  try {
    const orderId = verifyOrderWebhook(request, secret);
    if (Number(request.headers.get("content-length") ?? 0) > 16_384) return new Response(null, { status: 413 });
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 16_384) return new Response(null, { status: 413 });
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) return new Response(null, { status: 400 });
    const notification = body as { type?: unknown; data?: { id?: unknown } };
    if (notification.type !== "order" || typeof notification.data?.id !== "string" || notification.data.id.toUpperCase() !== orderId) {
      return Response.json({ error: "Notificação inválida." }, { status: 400 });
    }
    // Do not trust body.status, action, live_mode or any amount supplied by a notification.
    await reconcileWebhook(orderId);
    return Response.json({ received: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError || (error instanceof PaymentError && error.status === 401)) {
      return Response.json({ error: "Assinatura inválida." }, { status: 401 });
    }
    if (error instanceof SyntaxError) return new Response(null, { status: 400 });
    console.error(JSON.stringify({ area: "payments", event: "webhook_retry_required", code: safePaymentErrorCode(error) }));
    // Retryable error: acknowledge only after persistence, so Mercado Pago retries failures.
    return Response.json({ error: "Aguardando conciliação." }, { status: 503 });
  }
}
