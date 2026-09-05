import { randomUUID } from "node:crypto";
import { MercadoPagoError } from "mercadopago";
import type { Payment, Prisma } from "@/generated/prisma/client";
import type { OrderResponse } from "mercadopago/dist/clients/order/commonTypes";
import { requireLetterOwner } from "@/lib/letters/ownership";
import { withPrisma } from "@/lib/prisma";
import { ANIMAL_CAUSE_RATE_BPS, getPaymentConfig, PAYMENT_POLL_INTERVAL_MS, PaymentError, PREMIUM_PRICE_CENTS } from "./config";
import { mercadoPago, pixOrderBody } from "./mercado-pago";
import { grantsPremium, isActivePayment, mayApplySnapshot, validateOrderIdentity, validatePaymentSnapshot } from "./policy";

const LEASE_MS = 60_000;
const SYNC_INTERVAL_MS = 12_000;

function paymentLog(event: string, paymentId: string, code?: string) {
  // Deliberately exclude SDK errors, payer data, tokens and Pix payloads.
  console.info(JSON.stringify({ area: "payments", event, paymentId, ...(code ? { code } : {}) }));
}

export function safePaymentErrorCode(error: unknown) {
  return error instanceof PaymentError ? error.code : error instanceof MercadoPagoError ? `PROVIDER_HTTP_${error.status}` : "PROVIDER_OR_DATABASE_UNAVAILABLE";
}

async function lockLetter(tx: Prisma.TransactionClient, letterId: string) {
  await tx.$queryRaw`SELECT "id" FROM "letters" WHERE "id" = ${letterId} FOR UPDATE`;
}

async function refreshPremiumStatus(tx: Prisma.TransactionClient, letterId: string) {
  const paid = await tx.payment.findFirst({ where: { letterId, status: "APPROVED", refundedAmountCents: 0 }, select: { id: true } });
  const pending = paid ? null : await tx.payment.findFirst({ where: { activeLetterId: letterId }, select: { id: true } });
  return tx.letter.update({ where: { id: letterId }, data: { premiumStatus: paid ? "PREMIUM" : pending ? "PAYMENT_PENDING" : "FREE" } });
}

async function reservePayment(request: Request, letterId: string, payerEmail: string) {
  const config = getPaymentConfig();
  return withPrisma((prisma) => prisma.$transaction(async (tx) => {
    await lockLetter(tx, letterId);
    const letter = await tx.letter.findUnique({ where: { id: letterId } });
    if (!letter) throw new PaymentError("Cartinha não encontrada.", 404, "LETTER_NOT_FOUND");
    requireLetterOwner(request, letter);
    if (letter.premiumStatus === "PREMIUM") return null;
    if (letter.status === "PUBLISHED") throw new PaymentError("Esta cartinha já foi publicada. Crie uma nova cartinha para usar o Premium.", 409, "LETTER_ALREADY_PUBLISHED");
    const existing = await tx.payment.findUnique({ where: { activeLetterId: letterId } });
    if (existing) return existing;
    // Row lock + a unique activeLetterId protect parallel clicks and multiple app servers.
    const id = randomUUID();
    const payment = await tx.payment.create({ data: {
      id,
      letterId,
      activeLetterId: letterId,
      externalReference: `mc_${id}`,
      idempotencyKey: randomUUID(),
      amountCents: PREMIUM_PRICE_CENTS,
      liveMode: config.liveMode,
      payerEmail,
      allocationBasis: config.allocationBasis,
      allocationRateBps: ANIMAL_CAUSE_RATE_BPS,
    } });
    await tx.letter.update({ where: { id: letterId }, data: { premiumStatus: "PAYMENT_PENDING" } });
    return payment;
  }));
}

async function readPayment(id: string) {
  return withPrisma((prisma) => prisma.payment.findUniqueOrThrow({ where: { id } }));
}

async function applyOrder(payment: Payment, order: OrderResponse) {
  const { financialPayments, configuration } = mercadoPago();
  const transaction = validateOrderIdentity(order, payment, configuration.collectorId);
  const referenceId = transaction?.reference_id;
  // Orders expose the underlying financial payment ID as reference_id.
  // Read-only financial reconciliation supplies live_mode, currency, fees and cumulative refunds.
  const financial = referenceId && /^\d+$/.test(referenceId) ? await financialPayments.get({ id: referenceId }) : null;
  const snapshot = validatePaymentSnapshot(order, financial, payment, configuration.collectorId);
  const result = await withPrisma((prisma) => prisma.$transaction(async (tx) => {
    await lockLetter(tx, payment.letterId);
    const current = await tx.payment.findUniqueOrThrow({ where: { id: payment.id } });
    if (!mayApplySnapshot(current, snapshot)) return current;
    const updated = await tx.payment.update({ where: { id: payment.id }, data: {
      ...snapshot,
      // Retain known values when an asynchronous response does not return them yet.
      providerPaymentId: snapshot.providerPaymentId ?? current.providerPaymentId,
      providerReferenceId: snapshot.providerReferenceId ?? current.providerReferenceId,
      expiresAt: snapshot.expiresAt ?? current.expiresAt,
      approvedAt: snapshot.approvedAt ?? current.approvedAt,
      feeCents: snapshot.feeCents ?? current.feeCents,
      qrCode: isActivePayment(snapshot.status) ? snapshot.qrCode ?? current.qrCode : null,
      qrCodeBase64: isActivePayment(snapshot.status) ? snapshot.qrCodeBase64 ?? current.qrCodeBase64 : null,
      activeLetterId: isActivePayment(snapshot.status) ? current.activeLetterId : null,
      lastSyncedAt: new Date(),
      lastErrorCode: null,
    } });
    await refreshPremiumStatus(tx, payment.letterId);
    if (current.status !== updated.status) paymentLog("status_changed", payment.id, updated.status);
    return updated;
  }));
  return result;
}

async function createProviderOrder(payment: Payment) {
  const now = new Date();
  const acquired = await withPrisma((prisma) => prisma.payment.updateMany({
    where: { id: payment.id, providerOrderId: null, status: "CREATING", OR: [{ creationClaimedAt: null }, { creationClaimedAt: { lt: new Date(now.getTime() - LEASE_MS) } }] },
    data: { creationClaimedAt: now },
  }));
  if (!acquired.count) return readPayment(payment.id);
  try {
    const { orders } = mercadoPago();
    const order = await orders.create({ body: pixOrderBody(payment.externalReference, payment.payerEmail), requestOptions: { idempotencyKey: payment.idempotencyKey } });
    // Persist identity before reconciliation: a transient financial lookup must never issue another Pix.
    if (!order.id || !/^ORD[A-Z0-9]{20,60}$/i.test(order.id)) throw new PaymentError("O Pix está sendo preparado. Tente novamente em instantes.", 502, "ORDER_ID_MISSING");
    const identified = await withPrisma((prisma) => prisma.payment.update({ where: { id: payment.id }, data: { providerOrderId: order.id, expiresAt: new Date(now.getTime() + 30 * 60_000) } }));
    paymentLog("order_created", payment.id);
    return await applyOrder(identified, order);
  } catch (error) {
    // An ambiguous timeout stays on the SAME persisted idempotency key for safe recovery.
    const code = safePaymentErrorCode(error);
    await withPrisma((prisma) => prisma.$transaction(async (tx) => {
      await lockLetter(tx, payment.letterId);
      const current = await tx.payment.findUniqueOrThrow({ where: { id: payment.id } });
      const rejectedBeforeCreation = !current.providerOrderId && error instanceof MercadoPagoError && [400, 422].includes(error.status);
      await tx.payment.update({ where: { id: payment.id }, data: {
        lastErrorCode: code,
        ...(rejectedBeforeCreation ? { status: "REJECTED", activeLetterId: null } : {}),
      } });
      if (rejectedBeforeCreation) await refreshPremiumStatus(tx, payment.letterId);
    }));
    paymentLog("creation_retry_required", payment.id, code);
    throw error instanceof PaymentError ? error : new PaymentError("Não foi possível preparar o Pix agora. Sua edição está salva; tente novamente em instantes.");
  }
}

export async function syncPayment(payment: Payment, options: { force?: boolean; expire?: boolean } = {}) {
  if (!payment.providerOrderId) return createProviderOrder(payment);
  const now = new Date();
  const acquired = await withPrisma((prisma) => prisma.payment.updateMany({
    where: {
      id: payment.id,
      AND: [
        { OR: [{ syncClaimedAt: null }, { syncClaimedAt: { lt: new Date(now.getTime() - LEASE_MS) } }] },
        ...(options.force ? [] : [{ OR: [{ lastSyncedAt: null }, { lastSyncedAt: { lt: new Date(now.getTime() - SYNC_INTERVAL_MS) } }] }]),
      ],
    },
    data: { syncClaimedAt: now },
  }));
  if (!acquired.count) {
    if (options.force) throw new PaymentError("Conciliação já em andamento.", 503, "SYNC_BUSY");
    return readPayment(payment.id);
  }
  try {
    const { orders } = mercadoPago();
    let order = await orders.get({ id: payment.providerOrderId });
    let updated = await applyOrder(payment, order);
    if (options.expire && isActivePayment(updated.status) && updated.expiresAt && updated.expiresAt <= now) {
      try {
        // Only a provider-confirmed cancellation/expiry permits another charge attempt.
        await orders.cancel({ id: payment.providerOrderId, requestOptions: { idempotencyKey: payment.id } });
      } catch {
        // Payment could have been accredited during cancellation; re-read before deciding.
      }
      order = await orders.get({ id: payment.providerOrderId });
      updated = await applyOrder(updated, order);
      if (updated.status === "CANCELLED") {
        await withPrisma((prisma) => prisma.payment.updateMany({ where: { id: updated.id, status: "CANCELLED" }, data: { status: "EXPIRED" } }));
        updated = await readPayment(updated.id);
      }
    }
    return updated;
  } catch (error) {
    paymentLog("sync_retry_required", payment.id, safePaymentErrorCode(error));
    throw error instanceof PaymentError ? error : new PaymentError("Ainda não conseguimos atualizar o pagamento. Vamos tentar novamente em instantes.");
  } finally {
    await withPrisma((prisma) => prisma.payment.updateMany({ where: { id: payment.id, syncClaimedAt: now }, data: { syncClaimedAt: null } }));
  }
}

export async function authorizedPaymentState(request: Request, letterId: string) {
  return withPrisma(async (prisma) => {
    const letter = await prisma.letter.findUnique({ where: { id: letterId } });
    if (!letter) throw new PaymentError("Cartinha não encontrada.", 404, "LETTER_NOT_FOUND");
    requireLetterOwner(request, letter);
    const payment = await prisma.payment.findFirst({ where: { letterId }, orderBy: { createdAt: "desc" } });
    return { letter, payment };
  });
}

export function publicPaymentState(premiumStatus: string, payment: Payment | null) {
  const isExpired = payment?.expiresAt && payment.expiresAt <= new Date();
  return {
    premiumStatus,
    payment: payment ? {
      id: payment.id,
      status: payment.status,
      amountCents: payment.amountCents,
      qrCode: !isExpired && isActivePayment(payment.status) ? payment.qrCode : null,
      qrCodeBase64: !isExpired && isActivePayment(payment.status) ? payment.qrCodeBase64 : null,
      expiresAt: payment.expiresAt?.toISOString() ?? null,
    } : null,
    pollAfterMs: PAYMENT_POLL_INTERVAL_MS,
  };
}

export async function getPixState(request: Request, letterId: string) {
  const state = await authorizedPaymentState(request, letterId);
  if (state.payment && (isActivePayment(state.payment.status) || grantsPremium(state.payment))) {
    await syncPayment(state.payment, { expire: true });
  }
  const updated = await authorizedPaymentState(request, letterId);
  return publicPaymentState(updated.letter.premiumStatus, updated.payment);
}

export async function createPix(request: Request, letterId: string, payerEmail: string) {
  const previous = await authorizedPaymentState(request, letterId);
  if (previous.letter.premiumStatus === "PREMIUM") return publicPaymentState("PREMIUM", previous.payment);
  if (previous.payment && isActivePayment(previous.payment.status)) {
    const refreshed = await syncPayment(previous.payment, { expire: true });
    if (isActivePayment(refreshed.status) || grantsPremium(refreshed)) {
      const current = await authorizedPaymentState(request, letterId);
      return publicPaymentState(current.letter.premiumStatus, current.payment);
    }
  }
  const reserved = await reservePayment(request, letterId, payerEmail);
  if (reserved) await syncPayment(reserved);
  const current = await authorizedPaymentState(request, letterId);
  return publicPaymentState(current.letter.premiumStatus, current.payment);
}

export async function reconcileWebhook(orderId: string) {
  let payment = await withPrisma((prisma) => prisma.payment.findUnique({ where: { providerOrderId: orderId } }));
  if (!payment) {
    // Webhook may arrive between provider creation and storing the provider ID.
    const { orders, configuration } = mercadoPago();
    const order = await orders.get({ id: orderId });
    if (!order.external_reference?.startsWith("mc_")) return;
    payment = await withPrisma((prisma) => prisma.payment.findUnique({ where: { externalReference: order.external_reference } }));
    if (!payment) return;
    validateOrderIdentity(order, payment, configuration.collectorId);
    payment = await withPrisma((prisma) => prisma.payment.update({ where: { id: payment!.id }, data: { providerOrderId: orderId } }));
  }
  await syncPayment(payment, { force: true });
}
