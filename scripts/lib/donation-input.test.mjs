import assert from "node:assert/strict";
import test from "node:test";
import { validateDonationInput } from "./donation-input.mjs";

const now = new Date("2026-09-05T15:00:00Z");
// Isolated fixtures only. Tests do not connect to a database or publish records.
const input = {
  institution: { id: "fixture-institution", name: "Test fixture" },
  donation: { id: "fixture-donation", amountCents: 119, donatedAt: "2026-09-01", description: "Isolated test fixture" },
};

test("donations default to drafts and institutions can be registered alone", () => {
  const result = validateDonationInput(input, false, now);
  assert.equal(result.donation.publishedAt, null);
  assert.equal(result.donation.receiptReviewedAt, null);
  assert.equal(validateDonationInput({ institution: input.institution }, false, now).donation, null);
});

test("publishing requires a proof and an explicit privacy review", () => {
  assert.throws(() => validateDonationInput(input, true, now));
  const withProof = { ...input, donation: { ...input.donation, receiptUrl: "https://example.org/redacted.pdf" } };
  assert.throws(() => validateDonationInput(withProof, true, now));
  const result = validateDonationInput({ ...withProof, donation: { ...withProof.donation, receiptPrivacyReviewed: true } }, true, now);
  assert.equal(result.donation.publishedAt, now);
  assert.equal(result.donation.receiptReviewedAt, now);
});

test("invalid money, future dates, unknown fields and unsafe proof URLs are rejected", () => {
  for (const change of [
    { amountCents: 1.19 }, { amountCents: -119 }, { donatedAt: "2026-09-06" },
    { donatedAt: "2026-02-30" }, { price: 0.01 },
    { receiptUrl: "https://example.org/file?token=secret" },
    { receiptUrl: "http://example.org/file" }, { receiptUrl: "https://localhost/file" },
  ]) assert.throws(() => validateDonationInput({ ...input, donation: { ...input.donation, ...change } }, false, now));
});
