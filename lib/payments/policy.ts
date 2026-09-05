import type { OrderResponse } from "mercadopago/dist/clients/order/commonTypes";
import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { PaymentError, PREMIUM_CURRENCY, PREMIUM_PRICE_CENTS } from "./config";

export type LocalPaymentStatus = "CREATING" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "EXPIRED" | "REFUNDED" | "CHARGED_BACK";

export type ExpectedPayment = {
  externalReference: string;
  providerOrderId: string | null;
  providerPaymentId: string | null;
  providerReferenceId: string | null;
  amountCents: number;
  liveMode: boolean;
};

export function moneyToCents(value: unknown): number {
  const normalized = typeof value === "number" ? String(value) : value;
  if (typeof normalized !== "string" || !/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new PaymentError("Não foi possível confirmar o valor do pagamento.", 502, "INVALID_MONEY");
  }
  const [units, cents = ""] = normalized.split(".");
  const result = Number(units) * 100 + Number(cents.padEnd(2, "0"));
  if (!Number.isSafeInteger(result)) throw new PaymentError("Valor inválido.", 502, "INVALID_MONEY");
  return result;
}

function mismatch(condition: boolean, code: string): asserts condition {
  if (!condition) throw new PaymentError("Não foi possível confirmar os dados do pagamento.", 502, code);
}

function asDate(value?: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}

export function orderStatus(status?: string, detail?: string): LocalPaymentStatus {
  if (status === "refunded") return "REFUNDED";
  if (status === "charged_back") return "CHARGED_BACK";
  if (status === "expired") return "EXPIRED";
  if (status === "canceled" || status === "cancelled") return "CANCELLED";
  if (status === "failed") return "REJECTED";
  if (status === "processed" && (detail === "accredited" || detail === "partially_refunded")) return "APPROVED";
  if (status === "created" || status === "processing") return "CREATING";
  return "PENDING";
}

export function paymentStatus(status?: string, detail?: string): LocalPaymentStatus {
  if (status === "charged_back") return "CHARGED_BACK";
  if (status === "refunded") return "REFUNDED";
  if (status === "cancelled" && detail === "expired") return "EXPIRED";
  if (status === "cancelled") return "CANCELLED";
  if (status === "rejected") return "REJECTED";
  if (status === "approved") return "APPROVED";
  if (status === "pending" || status === "in_process" || status === "authorized") return "PENDING";
  return "CREATING";
}

function financialDetails(financial: PaymentResponse, expected: ExpectedPayment, collectorId: string) {
  mismatch(financial.id !== undefined && /^\d+$/.test(String(financial.id)), "PAYMENT_ID_MISMATCH");
  mismatch(!expected.providerPaymentId || String(financial.id) === expected.providerPaymentId, "PAYMENT_ID_MISMATCH");
  mismatch(financial.external_reference === expected.externalReference, "PAYMENT_REFERENCE_MISMATCH");
  mismatch(financial.collector_id !== undefined && String(financial.collector_id) === collectorId, "PAYMENT_COLLECTOR_MISMATCH");
  mismatch(financial.live_mode === expected.liveMode, "PAYMENT_LIVE_MODE_MISMATCH");
  mismatch(financial.currency_id === PREMIUM_CURRENCY && moneyToCents(financial.transaction_amount) === expected.amountCents, "PAYMENT_AMOUNT_MISMATCH");
  mismatch(expected.amountCents === PREMIUM_PRICE_CENTS, "PAYMENT_AMOUNT_MISMATCH");
  mismatch(financial.payment_method_id === "pix" && financial.payment_type_id === "bank_transfer", "PAYMENT_METHOD_MISMATCH");
  const refundedAmountCents = moneyToCents(financial.transaction_amount_refunded ?? 0);
  mismatch(refundedAmountCents <= expected.amountCents, "REFUND_AMOUNT_MISMATCH");
  const feeCents = Array.isArray(financial.fee_details) && financial.fee_details.every((fee) => fee.fee_payer === "collector" || fee.fee_payer === "payer")
    ? financial.fee_details.filter((fee) => fee.fee_payer === "collector").reduce((sum, fee) => sum + moneyToCents(fee.amount), 0)
    : null;
  return { refundedAmountCents, feeCents };
}

export function validateDirectPaymentSnapshot(financial: PaymentResponse, expected: ExpectedPayment, collectorId: string) {
  const details = financialDetails(financial, expected, collectorId);
  let status = paymentStatus(financial.status, financial.status_detail);
  const approvedAt = asDate(financial.date_approved);
  if (status === "APPROVED") mismatch(!!approvedAt, "PAYMENT_NOT_ACCREDITED");
  if (status === "REFUNDED" || status === "CHARGED_BACK") details.refundedAmountCents = expected.amountCents;
  if (status === "APPROVED" && details.refundedAmountCents === expected.amountCents) status = "REFUNDED";
  const transactionData = financial.point_of_interaction?.transaction_data;
  return {
    status,
    providerPaymentId: String(financial.id),
    providerStatus: financial.status ?? null,
    providerStatusDetail: financial.status_detail ?? null,
    refundedAmountCents: details.refundedAmountCents,
    feeCents: details.feeCents,
    liveMode: financial.live_mode!,
    approvedAt,
    expiresAt: asDate(financial.date_of_expiration),
    providerUpdatedAt: asDate(financial.date_last_updated) ?? asDate(financial.date_created),
    qrCode: transactionData?.qr_code ?? null,
    qrCodeBase64: transactionData?.qr_code_base64 ?? null,
  };
}

export function validateOrderIdentity(order: OrderResponse, expected: ExpectedPayment, collectorId: string) {
  mismatch(typeof order.id === "string" && /^ORD[A-Z0-9]{20,60}$/i.test(order.id), "ORDER_ID_MISMATCH");
  mismatch(!expected.providerOrderId || order.id === expected.providerOrderId, "ORDER_ID_MISMATCH");
  mismatch(order.external_reference === expected.externalReference, "ORDER_REFERENCE_MISMATCH");
  mismatch(expected.amountCents === PREMIUM_PRICE_CENTS && moneyToCents(order.total_amount) === expected.amountCents, "ORDER_AMOUNT_MISMATCH");
  mismatch(order.type === "online" && order.processing_mode === "automatic", "ORDER_MODE_MISMATCH");
  // Some creation responses omit user_id; the authenticated payment is also checked below.
  mismatch(!order.user_id || String(order.user_id) === collectorId, "ORDER_COLLECTOR_MISMATCH");
  mismatch(!order.country_code || ["BR", "BRA"].includes(order.country_code), "ORDER_COUNTRY_MISMATCH");
  mismatch(!order.currency || order.currency === PREMIUM_CURRENCY, "ORDER_CURRENCY_MISMATCH");
  const payments = order.transactions?.payments ?? [];
  mismatch(payments.length <= 1, "ORDER_TRANSACTION_COUNT");
  const transaction = payments[0];
  if (transaction) {
    mismatch(typeof transaction.id === "string" && /^PAY[A-Z0-9]{20,60}$/i.test(transaction.id), "TRANSACTION_ID_MISMATCH");
    mismatch(!expected.providerPaymentId || transaction.id === expected.providerPaymentId, "TRANSACTION_ID_MISMATCH");
    mismatch(!expected.providerReferenceId || transaction.reference_id === expected.providerReferenceId, "PAYMENT_ID_MISMATCH");
    mismatch(moneyToCents(transaction.amount) === expected.amountCents, "TRANSACTION_AMOUNT_MISMATCH");
    mismatch(transaction.payment_method?.id === "pix" && transaction.payment_method.type === "bank_transfer", "PAYMENT_METHOD_MISMATCH");
  }
  return transaction;
}

export function validatePaymentSnapshot(order: OrderResponse, financial: PaymentResponse | null, expected: ExpectedPayment, collectorId: string) {
  const transaction = validateOrderIdentity(order, expected, collectorId);
  let status = orderStatus(order.status, order.status_detail);
  let refundedAmountCents = 0;
  let feeCents: number | null = null;
  let approvedAt: Date | null = null;
  let liveMode = expected.liveMode;

  if (financial) {
    mismatch(String(financial.id) === transaction?.reference_id, "PAYMENT_ID_MISMATCH");
    mismatch(financial.external_reference === expected.externalReference, "PAYMENT_REFERENCE_MISMATCH");
    mismatch(financial.collector_id !== undefined && String(financial.collector_id) === collectorId, "PAYMENT_COLLECTOR_MISMATCH");
    mismatch(financial.live_mode === expected.liveMode, "PAYMENT_LIVE_MODE_MISMATCH");
    mismatch(financial.currency_id === PREMIUM_CURRENCY && moneyToCents(financial.transaction_amount) === expected.amountCents, "PAYMENT_AMOUNT_MISMATCH");
    mismatch(financial.payment_method_id === "pix" && financial.payment_type_id === "bank_transfer", "PAYMENT_METHOD_MISMATCH");
    liveMode = financial.live_mode;
    refundedAmountCents = moneyToCents(financial.transaction_amount_refunded ?? 0);
    if (transaction?.refunded_amount !== undefined) {
      mismatch(moneyToCents(transaction.refunded_amount) === refundedAmountCents, "REFUND_RECONCILIATION_PENDING");
    }
    if (order.status_detail === "partially_refunded" || transaction?.status_detail === "partially_refunded") {
      mismatch(refundedAmountCents > 0, "REFUND_RECONCILIATION_PENDING");
    }
    mismatch(refundedAmountCents <= expected.amountCents, "REFUND_AMOUNT_MISMATCH");
    if (Array.isArray(financial.fee_details) && financial.fee_details.every((fee) => fee.fee_payer === "collector" || fee.fee_payer === "payer")) {
      // NET_AFTER_FEES deducts only fees borne by the seller, never buyer charges.
      feeCents = financial.fee_details.filter((fee) => fee.fee_payer === "collector").reduce((sum, fee) => sum + moneyToCents(fee.amount), 0);
    }
    approvedAt = asDate(financial.date_approved);
    if (financial.status === "charged_back") status = "CHARGED_BACK";
    else if (financial.status === "refunded" || refundedAmountCents === expected.amountCents) status = "REFUNDED";
    else if (financial.status === "cancelled") status = "CANCELLED";
    else if (financial.status === "rejected") status = "REJECTED";
    else if (status === "APPROVED") {
      // Both resources must agree; a stale or intermediate response cannot grant Premium.
      mismatch(financial.status === "approved" && transaction?.status === "processed" && ["accredited", "partially_refunded"].includes(transaction.status_detail ?? "") && !!approvedAt, "PAYMENT_NOT_ACCREDITED");
      if (!refundedAmountCents) mismatch(moneyToCents(order.total_paid_amount) === expected.amountCents, "PAID_AMOUNT_MISMATCH");
    }
  } else {
    // Order responses can be asynchronous. Never grant access without the financial record.
    mismatch(status !== "APPROVED" && status !== "REFUNDED" && status !== "CHARGED_BACK", "FINANCIAL_RECORD_MISSING");
  }

  if (status === "REFUNDED" || status === "CHARGED_BACK") refundedAmountCents = expected.amountCents;
  const expiresAt = asDate(transaction?.date_of_expiration);
  return {
    status,
    providerOrderId: order.id!,
    providerPaymentId: transaction?.id ?? null,
    providerReferenceId: transaction?.reference_id ?? null,
    providerStatus: order.status ?? null,
    providerStatusDetail: order.status_detail ?? null,
    refundedAmountCents,
    feeCents,
    liveMode,
    approvedAt,
    expiresAt,
    providerUpdatedAt: asDate(order.last_updated_date) ?? asDate(financial?.date_last_updated),
    qrCode: transaction?.payment_method?.qr_code ?? null,
    qrCodeBase64: transaction?.payment_method?.qr_code_base64 ?? null,
  };
}

export function grantsPremium(payment: { status: string; refundedAmountCents: number }) {
  return payment.status === "APPROVED" && payment.refundedAmountCents === 0;
}

export function isActivePayment(status: string) {
  return status === "CREATING" || status === "PENDING";
}

export function mayApplySnapshot(current: { status: string; providerUpdatedAt: Date | null; refundedAmountCents?: number }, incoming: { status: string; providerUpdatedAt: Date | null; refundedAmountCents?: number }) {
  if (current.providerUpdatedAt && incoming.providerUpdatedAt && incoming.providerUpdatedAt < current.providerUpdatedAt) return false;
  // Notifications re-fetch current provider data, but never revive a terminal attempt
  // from a delayed creation response after its active reservation was released.
  if (!isActivePayment(current.status) && isActivePayment(incoming.status)) return false;
  if (["REFUNDED", "CHARGED_BACK"].includes(current.status) && incoming.status === "APPROVED") return false;
  if ((incoming.refundedAmountCents ?? 0) < (current.refundedAmountCents ?? 0)) return false;
  return true;
}
