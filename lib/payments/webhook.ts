import { InvalidWebhookSignatureError, WebhookSignatureValidator } from "mercadopago";
import { PaymentError } from "./config";

export function verifyMercadoPagoWebhook(request: Request, secret: string) {
  const url = new URL(request.url);
  const resourceId = url.searchParams.get("data.id");
  const requestId = request.headers.get("x-request-id");
  if (!resourceId || (!/^ORD[A-Z0-9]{20,60}$/i.test(resourceId) && !/^\d{1,32}$/.test(resourceId)) || !requestId || requestId.length > 200) {
    throw new PaymentError("Notificação inválida.", 401, "INVALID_WEBHOOK_ID");
  }
  const signatureOptions = {
    xSignature: request.headers.get("x-signature"),
    xRequestId: requestId,
    dataId: resourceId,
    secret,
    // Provider retries can arrive much later. Replays only re-fetch authoritative
    // current state and apply an idempotent transaction, never the notification body.
  };
  try {
    WebhookSignatureValidator.validate(signatureOptions);
  } catch (error) {
    if (!(error instanceof InvalidWebhookSignatureError)) throw error;
    // Alphanumeric IDs may be canonicalized to lowercase by webhook delivery.
    // Both forms still require a valid HMAC for precisely the same Order ID.
    if (!resourceId.toUpperCase().startsWith("ORD")) throw error;
    WebhookSignatureValidator.validate({ ...signatureOptions, dataId: resourceId.toLowerCase() });
  }
  return resourceId.toUpperCase().startsWith("ORD") ? { type: "order" as const, id: resourceId.toUpperCase() } : { type: "payment" as const, id: resourceId };
}

export function verifyOrderWebhook(request: Request, secret: string) {
  const resource = verifyMercadoPagoWebhook(request, secret);
  if (resource.type !== "order") throw new PaymentError("Notificação inválida.", 401, "INVALID_WEBHOOK_ID");
  return resource.id;
}
