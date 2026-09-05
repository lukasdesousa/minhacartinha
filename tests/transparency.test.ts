import assert from "node:assert/strict";
import test from "node:test";
import { calculateCauseSummary, type CausePayment } from "../lib/transparency/accounting";
import { publicHttpsUrl } from "../lib/transparency/receipts";

const payment: CausePayment = {
  status: "APPROVED", amountCents: 790, refundedAmountCents: 0, feeCents: null,
  liveMode: true, approvedAt: new Date("2026-09-01T12:00:00Z"),
  allocationBasis: "GROSS_AFTER_REFUNDS", allocationRateBps: 1500,
};

test("empty database gives real zero totals and no recorded donation", () => {
  const summary = calculateCauseSummary([], 0);
  assert.equal(summary.allocatedCents, 0);
  assert.equal(summary.donatedCents, 0);
  assert.equal(summary.reservedCents, 0);
});

test("gross basis uses confirmed real revenue and integer cent rounding", () => {
  const summary = calculateCauseSummary([payment, payment], 0);
  assert.equal(summary.premiumRevenueCents, 1580);
  assert.equal(summary.consideredCents, 1580);
  assert.equal(summary.allocatedCents, 238);
  assert.equal(summary.reservedCents, 238);
});

test("non-approved statuses and sandbox transactions cannot inflate allocations", () => {
  const excluded = ["CREATING", "PENDING", "REJECTED", "CANCELLED", "EXPIRED", "REFUNDED", "CHARGED_BACK"].map((status) => ({ ...payment, status }));
  excluded.push({ ...payment, liveMode: false });
  assert.equal(calculateCauseSummary(excluded, 0).consideredCents, 0);
  assert.equal(calculateCauseSummary([{ ...payment, approvedAt: null }], 0).allocatedCents, 0);
});

test("partial refunds reduce revenue and allocation; over-refund never goes negative", () => {
  assert.equal(calculateCauseSummary([{ ...payment, refundedAmountCents: 290 }], 0).allocatedCents, 75);
  assert.equal(calculateCauseSummary([{ ...payment, refundedAmountCents: 900 }], 0).consideredCents, 0);
});

test("net basis awaits known fees and existing gross snapshots retain their policy", () => {
  const summary = calculateCauseSummary([
    payment,
    { ...payment, allocationBasis: "NET_AFTER_FEES" },
    { ...payment, allocationBasis: "NET_AFTER_FEES", feeCents: 90 },
  ], 0);
  assert.equal(summary.premiumRevenueCents, 2370);
  assert.equal(summary.consideredCents, 1490);
  assert.equal(summary.allocatedCents, 224);
  assert.equal(summary.awaitingFeesCount, 1);
  assert.deepEqual(summary.bases, { GROSS_AFTER_REFUNDS: 790, NET_AFTER_FEES: 700 });
});

test("actual donations remain visible after a later refund reduces the reserve", () => {
  const summary = calculateCauseSummary([{ ...payment, status: "REFUNDED", refundedAmountCents: 790 }], 119);
  assert.equal(summary.allocatedCents, 0);
  assert.equal(summary.donatedCents, 119);
  assert.equal(summary.reservedCents, 0);
  assert.equal(summary.donatedAboveAllocationCents, 119);
});

test("invalid money or allocation rate fails closed", () => {
  assert.throws(() => calculateCauseSummary([{ ...payment, amountCents: 7.9 }], 0));
  assert.throws(() => calculateCauseSummary([{ ...payment, allocationRateBps: 2000 }], 0));
  assert.throws(() => calculateCauseSummary([payment], -10));
});

test("public proof links reject credentials, private hosts, tokens and script URLs", () => {
  for (const url of ["javascript:alert(1)", "http://example.org/file.pdf", "https://localhost/file", "https://127.0.0.1/file", "https://user:pass@example.org/file", "https://example.org/file?token=secret", "https://example.org/file#private", "https://[::1]/file"]) {
    assert.equal(publicHttpsUrl(url), null);
  }
  assert.equal(publicHttpsUrl("https://example.org/redacted-receipt.pdf"), "https://example.org/redacted-receipt.pdf");
});
