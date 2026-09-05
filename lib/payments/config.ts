// Server-owned price. Browser amounts are never accepted by payment creation.
export { PREMIUM_PRICE_CENTS } from "../premium";
export const PREMIUM_CURRENCY = "BRL";
export const PIX_EXPIRATION = "PT30M";
export const PAYMENT_POLL_INTERVAL_MS = 15_000;
export const ANIMAL_CAUSE_RATE_BPS = 1500;

export class PaymentError extends Error {
  constructor(message: string, public readonly status = 502, public readonly code = "PAYMENT_UNAVAILABLE") {
    super(message);
    this.name = "PaymentError";
  }
}

export function getPaymentConfig() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
  const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET?.trim();
  const collectorId = process.env.MERCADO_PAGO_COLLECTOR_ID?.trim();
  const mode = process.env.MERCADO_PAGO_LIVE_MODE;
  const allocationBasis = process.env.ANIMAL_CAUSE_ALLOCATION_BASIS ?? "GROSS_AFTER_REFUNDS";
  const missing = [
    !accessToken && "MERCADO_PAGO_ACCESS_TOKEN",
    !webhookSecret && "MERCADO_PAGO_WEBHOOK_SECRET",
    (!collectorId || !/^\d+$/.test(collectorId)) && "MERCADO_PAGO_COLLECTOR_ID",
    !["true", "false"].includes(mode ?? "") && "MERCADO_PAGO_LIVE_MODE",
  ].filter(Boolean);
  if (missing.length || !accessToken || !webhookSecret || !collectorId || !mode) {
    console.error(`[payments] Configuração incompleta: ${missing.join(", ")}`);
    throw new PaymentError("O pagamento Pix ainda não está configurado corretamente. Tente novamente mais tarde.", 503, "PAYMENT_CONFIGURATION");
  }
  if (allocationBasis !== "GROSS_AFTER_REFUNDS" && allocationBasis !== "NET_AFTER_FEES") {
    throw new PaymentError("O Pix está temporariamente indisponível.", 503, "ALLOCATION_CONFIGURATION");
  }
  return { accessToken, collectorId, liveMode: mode === "true", allocationBasis: allocationBasis as "GROSS_AFTER_REFUNDS" | "NET_AFTER_FEES" };
}
