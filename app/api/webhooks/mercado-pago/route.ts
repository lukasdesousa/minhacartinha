import { InvalidWebhookSignatureError } from "mercadopago";
import { PaymentError } from "@/lib/payments/config";
import { reconcilePaymentWebhook, reconcileWebhook, safePaymentErrorCode } from "@/lib/payments/service";
import { verifyMercadoPagoWebhook } from "@/lib/payments/webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET?.trim();
  if (!secret) return Response.json({ error: "Webhook indisponível." }, { status: 503 });
  try {
    const resource = verifyMercadoPagoWebhook(request, secret);
    if (Number(request.headers.get("content-length") ?? 0) > 16_384) return new Response(null, { status: 413 });
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 16_384) return new Response(null, { status: 413 });
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) return new Response(null, { status: 400 });
    const notification = body as { type?: unknown; data?: { id?: unknown } };
    const bodyId = notification.data?.id === undefined ? "" : String(notification.data.id);
    const expectedBodyId = resource.type === "order" ? bodyId.toUpperCase() : bodyId;
    if (notification.type !== resource.type || expectedBodyId !== resource.id) {
      return Response.json({ error: "Notificação inválida." }, { status: 400 });
    }
    // Do not trust body.status, action, live_mode or any amount supplied by a notification.
    if (resource.type === "order") await reconcileWebhook(resource.id);
    else await reconcilePaymentWebhook(resource.id);
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
