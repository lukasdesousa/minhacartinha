import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { InvalidWebhookSignatureError, MercadoPagoConfig, Order } from "mercadopago";
import type { OrderResponse } from "mercadopago/dist/clients/order/commonTypes";
import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { getPaymentConfig, PaymentError, PREMIUM_PRICE_CENTS } from "../lib/payments/config";
import { pixOrderBody } from "../lib/payments/mercado-pago";
import { grantsPremium, isActivePayment, mayApplySnapshot, moneyToCents, orderStatus, validatePaymentSnapshot } from "../lib/payments/policy";
import { verifyOrderWebhook } from "../lib/payments/webhook";

const orderId = "ORD01JQ4S4KY8HWQ6NA5PXB65B3D3";
const transactionId = "PAY01JQ4S4KY8HWQ6NA5PXB65B3D3";
const referenceId = "123456789";
const collectorId = "7654321";
const reference = "mc_8797be24-2e34-4d10-9f54-8d04d7576ba4";
const expected = { externalReference: reference, providerOrderId: orderId, providerPaymentId: transactionId, providerReferenceId: referenceId, amountCents: 790, liveMode: true };
const apiResponse: OrderResponse["api_response"] = { status: 200, headers: ["test", []] };

function fixture(status = "processed", detail = "accredited") {
  const order: OrderResponse = {
    api_response: apiResponse,
    id: orderId,
    user_id: collectorId,
    external_reference: reference,
    type: "online",
    processing_mode: "automatic",
    country_code: "BRA",
    currency: "BRL",
    total_amount: "7.90",
    total_paid_amount: status === "processed" ? "7.90" : "0.00",
    status,
    status_detail: detail,
    last_updated_date: "2026-09-05T12:00:00.000Z",
    transactions: { payments: [{
      id: transactionId,
      reference_id: referenceId,
      status,
      status_detail: detail,
      amount: "7.90",
      refunded_amount: "0.00",
      date_of_expiration: "2026-09-05T12:30:00.000Z",
      payment_method: { id: "pix", type: "bank_transfer", qr_code: "TEST_FIXTURE_ONLY_OFFICIAL_RESPONSE", qr_code_base64: "VEVTVF9GSVhUVVJFX09OTFk=" },
    }] },
  };
  const financial: PaymentResponse = {
    api_response: apiResponse,
    id: Number(referenceId),
    external_reference: reference,
    collector_id: Number(collectorId),
    live_mode: true,
    currency_id: "BRL",
    transaction_amount: 7.90,
    transaction_amount_refunded: 0,
    payment_method_id: "pix",
    payment_type_id: "bank_transfer",
    status: status === "processed" ? "approved" : "pending",
    date_approved: status === "processed" ? "2026-09-05T12:00:00.000Z" : undefined,
    fee_details: [{ amount: 0.08, type: "mercadopago_fee", fee_payer: "collector" }],
  };
  return { order, financial };
}

test("centavos são inteiros exatos; preço único vem do servidor", () => {
  assert.equal(PREMIUM_PRICE_CENTS, 790);
  assert.equal(moneyToCents("7.90"), 790);
  assert.equal(moneyToCents(7.9), 790);
  assert.equal(moneyToCents("0.01"), 1);
  for (const invalid of ["7.901", "-7.90", "7,90", "NaN", null, "1e3", Infinity]) assert.throws(() => moneyToCents(invalid));
  const body = pixOrderBody(reference, "test@example.test");
  assert.equal(body.total_amount, "7.90");
  assert.equal(body.transactions.payments[0].amount, "7.90");
  assert.equal(body.transactions.payments[0].payment_method.id, "pix");
  assert.equal(body.transactions.payments[0].expiration_time, "PT30M");
  assert.equal(body.external_reference, reference);
});

test("SDK oficial cria Order Pix com idempotência persistida e mantém QR recebido", async (context) => {
  const { order } = fixture("action_required", "waiting_transfer");
  let calls = 0;
  const idempotencyKey = "9097be24-2e34-4d10-9f54-8d04d7576ba4";
  context.mock.method(globalThis, "fetch", async (input: string | URL | Request, init?: RequestInit) => {
    calls++;
    assert.equal(String(input), "https://api.mercadopago.com/v1/orders");
    assert.equal(init?.method, "POST");
    assert.equal(new Headers(init?.headers).get("x-idempotency-key"), idempotencyKey);
    assert.equal(JSON.parse(String(init?.body)).total_amount, "7.90");
    return new Response(JSON.stringify(order), { status: 201, headers: { "content-type": "application/json" } });
  });
  const sdk = new Order(new MercadoPagoConfig({ accessToken: "UNIT_TEST_TOKEN_NEVER_SENT", options: { maxRetries: 0 } }));
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await sdk.create({ body: pixOrderBody(reference, "test@example.test"), requestOptions: { idempotencyKey } });
    assert.equal(result.id, orderId);
    assert.equal(result.transactions?.payments?.[0].payment_method?.qr_code, order.transactions?.payments?.[0].payment_method?.qr_code);
    assert.equal(result.transactions?.payments?.[0].payment_method?.qr_code_base64, order.transactions?.payments?.[0].payment_method?.qr_code_base64);
  }
  assert.equal(calls, 2, "ambiguous retries use the same provider key, never a newly generated one");
});

test("pagamento pendente mostra Pix oficial e não concede Premium", () => {
  const { order, financial } = fixture("action_required", "waiting_transfer");
  const state = validatePaymentSnapshot(order, financial, expected, collectorId);
  assert.equal(state.status, "PENDING");
  assert.equal(grantsPremium(state), false);
  assert.equal(state.qrCode, "TEST_FIXTURE_ONLY_OFFICIAL_RESPONSE");
  assert.equal(state.qrCodeBase64, "VEVTVF9GSVhUVVJFX09OTFk=");
  assert.equal(state.expiresAt?.toISOString(), "2026-09-05T12:30:00.000Z");
});

test("criação assíncrona sem transação ainda não concede Premium", () => {
  const { order } = fixture("processing", "in_process");
  order.transactions = {};
  const state = validatePaymentSnapshot(order, null, { ...expected, providerPaymentId: null, providerReferenceId: null }, collectorId);
  assert.equal(state.status, "CREATING");
  assert.equal(state.qrCode, null);
  assert.equal(grantsPremium(state), false);
});

test("aprovação só é aceita com ordem e registro financeiro concordantes", () => {
  const { order, financial } = fixture();
  const state = validatePaymentSnapshot(order, financial, expected, collectorId);
  assert.equal(state.status, "APPROVED");
  assert.equal(state.feeCents, 8);
  assert.equal(state.refundedAmountCents, 0);
  assert.equal(grantsPremium(state), true);
  assert.throws(() => validatePaymentSnapshot(order, null, expected, collectorId));
  financial.status = "pending";
  assert.throws(() => validatePaymentSnapshot(order, financial, expected, collectorId));
});

test("taxas líquidas incluem apenas custo do vendedor; ausência fica pendente", () => {
  const { order, financial } = fixture();
  financial.fee_details!.push({ amount: 0.30, fee_payer: "payer", type: "financing_fee" });
  assert.equal(validatePaymentSnapshot(order, financial, expected, collectorId).feeCents, 8);
  financial.fee_details = undefined;
  assert.equal(validatePaymentSnapshot(order, financial, expected, collectorId).feeCents, null);
});

test("preço adulterado, vínculo, identidade, modo, moeda e meio incorretos são recusados", () => {
  const orderMutations: Array<(order: OrderResponse) => void> = [
    (order) => { order.id = "ORD01JQ4S4KY8HWQ6NA5PXB65B3D4"; },
    (order) => { order.external_reference = "another-letter"; },
    (order) => { order.total_amount = "0.01"; },
    (order) => { order.total_paid_amount = "0.01"; },
    (order) => { order.processing_mode = "manual"; },
    (order) => { order.type = "qr"; },
    (order) => { order.user_id = "777"; },
    (order) => { order.currency = "ARS"; },
    (order) => { order.transactions!.payments![0].amount = "0.01"; },
    (order) => { order.transactions!.payments![0].id = "PAY01JQ4S4KY8HWQ6NA5PXB65B3D4"; },
    (order) => { order.transactions!.payments![0].reference_id = "999"; },
    (order) => { order.transactions!.payments![0].payment_method!.id = "visa"; },
    (order) => { order.transactions!.payments!.push({ ...order.transactions!.payments![0] }); },
  ];
  for (const mutate of orderMutations) {
    const { order, financial } = fixture();
    mutate(order);
    assert.throws(() => validatePaymentSnapshot(order, financial, expected, collectorId), PaymentError);
  }
  const financialMutations: Array<(financial: PaymentResponse) => void> = [
    (financial) => { financial.id = 999; },
    (financial) => { financial.external_reference = "another-letter"; },
    (financial) => { financial.transaction_amount = 0.01; },
    (financial) => { financial.live_mode = false; },
    (financial) => { financial.collector_id = 123; },
    (financial) => { financial.currency_id = "ARS"; },
    (financial) => { financial.payment_method_id = "visa"; },
    (financial) => { financial.payment_type_id = "credit_card"; },
    (financial) => { financial.date_approved = undefined; },
  ];
  for (const mutate of financialMutations) {
    const { order, financial } = fixture();
    mutate(financial);
    assert.throws(() => validatePaymentSnapshot(order, financial, expected, collectorId), PaymentError);
  }
});

test("estados rejeitado/cancelado/expirado não concedem acesso", () => {
  for (const [providerStatus, localStatus] of [["failed", "REJECTED"], ["canceled", "CANCELLED"], ["expired", "EXPIRED"]]) {
    const { order, financial } = fixture(providerStatus, providerStatus);
    if (providerStatus === "failed") financial.status = "rejected";
    if (providerStatus === "canceled") financial.status = "cancelled";
    const state = validatePaymentSnapshot(order, financial, expected, collectorId);
    assert.equal(state.status, localStatus);
    assert.equal(grantsPremium(state), false);
    assert.equal(isActivePayment(state.status), false);
  }
  assert.equal(orderStatus("processed", "unknown"), "PENDING");
});

test("reembolso parcial subtrai receita e revoga Premium sem apagar dados", () => {
  const { order, financial } = fixture("processed", "partially_refunded");
  order.transactions!.payments![0].refunded_amount = "2.00";
  financial.transaction_amount_refunded = 2;
  const state = validatePaymentSnapshot(order, financial, expected, collectorId);
  assert.equal(state.status, "APPROVED");
  assert.equal(state.refundedAmountCents, 200);
  assert.equal(grantsPremium(state), false);
  financial.transaction_amount_refunded = 0;
  assert.throws(() => validatePaymentSnapshot(order, financial, expected, collectorId));
});

test("reembolso total e chargeback excluem valor integral", () => {
  for (const [providerStatus, localStatus] of [["refunded", "REFUNDED"], ["charged_back", "CHARGED_BACK"]]) {
    const { order, financial } = fixture(providerStatus, providerStatus);
    financial.status = providerStatus;
    if (providerStatus === "refunded") {
      financial.transaction_amount_refunded = 7.90;
      order.transactions!.payments![0].refunded_amount = "7.90";
    }
    const state = validatePaymentSnapshot(order, financial, expected, collectorId);
    assert.equal(state.status, localStatus);
    assert.equal(state.refundedAmountCents, 790);
    assert.equal(grantsPremium(state), false);
  }
});

test("webhook repetido preserva mesmo estado e nunca regride aprovação/estorno", () => {
  const { order, financial } = fixture();
  const first = validatePaymentSnapshot(order, financial, expected, collectorId);
  const repeated = validatePaymentSnapshot(order, financial, expected, collectorId);
  assert.deepEqual(first, repeated);
  assert.equal(mayApplySnapshot(first, repeated), true);
  assert.equal(mayApplySnapshot(first, { status: "PENDING", providerUpdatedAt: new Date("2026-09-05T13:00:00Z") }), false);
  assert.equal(mayApplySnapshot({ status: "EXPIRED", providerUpdatedAt: null }, { status: "PENDING", providerUpdatedAt: null }), false);
  assert.equal(mayApplySnapshot({ status: "REJECTED", providerUpdatedAt: null }, { status: "CREATING", providerUpdatedAt: null }), false);
  assert.equal(mayApplySnapshot({ status: "REFUNDED", providerUpdatedAt: first.providerUpdatedAt }, repeated), false);
  assert.equal(mayApplySnapshot({ ...first, refundedAmountCents: 200 }, repeated), false);
  assert.equal(mayApplySnapshot(first, { status: "APPROVED", providerUpdatedAt: new Date("2026-09-04T00:00:00Z") }), false);
});

function signedRequest(secret: string, signedId = orderId, suppliedId = orderId) {
  const requestId = "webhook-fixture-request";
  const ts = "1788609600000";
  const signature = createHmac("sha256", secret).update(`id:${signedId};request-id:${requestId};ts:${ts};`).digest("hex");
  return new Request(`https://example.test/api/webhooks/mercado-pago?data.id=${suppliedId}&type=order`, { method: "POST", headers: { "x-request-id": requestId, "x-signature": `ts=${ts},v1=${signature}` } });
}

test("assinatura validada com SDK oficial; falsificação e troca de ID rejeitadas", () => {
  const secret = "test-webhook-secret-never-a-production-secret";
  assert.equal(verifyOrderWebhook(signedRequest(secret), secret), orderId);
  assert.equal(verifyOrderWebhook(signedRequest(secret, orderId.toLowerCase()), secret), orderId);
  assert.equal(verifyOrderWebhook(signedRequest(secret), secret), orderId, "delivery repeated is safe to re-fetch");
  assert.throws(() => verifyOrderWebhook(signedRequest(secret), "different-secret"), InvalidWebhookSignatureError);
  assert.throws(() => verifyOrderWebhook(signedRequest(secret, orderId, "ORD01JQ4S4KY8HWQ6NA5PXB65B3D4"), secret), InvalidWebhookSignatureError);
  assert.throws(() => verifyOrderWebhook(new Request("https://example.test/api/webhooks/mercado-pago"), secret), PaymentError);
});

test("configuração financeira exige token, vendedor, webhook e modo explícito", () => {
  const variableNames = ["MERCADO_PAGO_ACCESS_TOKEN", "MERCADO_PAGO_WEBHOOK_SECRET", "MERCADO_PAGO_COLLECTOR_ID", "MERCADO_PAGO_LIVE_MODE", "ANIMAL_CAUSE_ALLOCATION_BASIS"] as const;
  const previous = Object.fromEntries(variableNames.map((key) => [key, process.env[key]]));
  try {
    process.env.MERCADO_PAGO_ACCESS_TOKEN = "UNIT_TEST_TOKEN";
    process.env.MERCADO_PAGO_WEBHOOK_SECRET = "UNIT_TEST_SECRET";
    process.env.MERCADO_PAGO_COLLECTOR_ID = collectorId;
    process.env.MERCADO_PAGO_LIVE_MODE = "false";
    delete process.env.ANIMAL_CAUSE_ALLOCATION_BASIS;
    assert.equal(getPaymentConfig().allocationBasis, "GROSS_AFTER_REFUNDS");
    assert.equal(getPaymentConfig().liveMode, false);
    process.env.ANIMAL_CAUSE_ALLOCATION_BASIS = "NET_AFTER_FEES";
    assert.equal(getPaymentConfig().allocationBasis, "NET_AFTER_FEES");
    for (const variable of variableNames.slice(0, 4)) {
      const value = process.env[variable];
      delete process.env[variable];
      assert.throws(() => getPaymentConfig(), PaymentError);
      process.env[variable] = value;
    }
    process.env.ANIMAL_CAUSE_ALLOCATION_BASIS = "invented";
    assert.throws(() => getPaymentConfig(), PaymentError);
  } finally {
    for (const variable of variableNames) {
      if (previous[variable] === undefined) delete process.env[variable];
      else process.env[variable] = previous[variable];
    }
  }
});
