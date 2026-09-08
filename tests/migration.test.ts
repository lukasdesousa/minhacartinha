import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

type PaymentFixture = {
  id: string;
  letterId: string;
  activeLetterId: string | null;
  externalReference: string;
  idempotencyKey: string;
  providerOrderId: string;
  providerPaymentId: string;
  providerReferenceId: string;
  amountCents: number;
  refundedAmountCents: number;
  feeCents: number | null;
};

test("migrations preserve old letters and enforce financial and donation constraints in memory", async () => {
  // PGlite without a data directory is an isolated in-memory PostgreSQL.
  // This test never reads DATABASE_URL or connects to an external database.
  const db = new PGlite();
  const migrationsUrl = new URL("../prisma/migrations/", import.meta.url);
  let paymentSequence = 0;
  let donationSequence = 0;

  async function createLetter(id: string, status = "DRAFT") {
    await db.query('INSERT INTO letters (id, slug, "recipientName", "senderName", title, message, signature, "openingText", "closingText", status, "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())', [id, id, "Fixture recipient", "Fixture sender", "Fixture title", "Fixture message", "Fixture signature", "Fixture opening", "Fixture closing", status]);
  }

  async function createPayment(overrides: Partial<PaymentFixture> = {}) {
    const sequence = ++paymentSequence;
    const fixture: PaymentFixture = {
      id: `payment-${sequence}`, letterId: "new-letter", activeLetterId: null,
      externalReference: `external-${sequence}`, idempotencyKey: `idempotency-${sequence}`,
      providerOrderId: `order-${sequence}`, providerPaymentId: `provider-payment-${sequence}`,
      providerReferenceId: `provider-reference-${sequence}`, amountCents: 790,
      refundedAmountCents: 0, feeCents: null, ...overrides,
    };
    await db.query('INSERT INTO payments (id, "letterId", "activeLetterId", "externalReference", "idempotencyKey", "providerOrderId", "providerPaymentId", "providerReferenceId", "amountCents", "refundedAmountCents", "feeCents", "liveMode", "payerEmail", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,false,\'fixture@example.test\',NOW())', [fixture.id, fixture.letterId, fixture.activeLetterId, fixture.externalReference, fixture.idempotencyKey, fixture.providerOrderId, fixture.providerPaymentId, fixture.providerReferenceId, fixture.amountCents, fixture.refundedAmountCents, fixture.feeCents]);
    return fixture;
  }

  async function createDonation({ amountCents = 119, receiptUrl = null, reviewed = false, published = false }: { amountCents?: number; receiptUrl?: string | null; reviewed?: boolean; published?: boolean } = {}) {
    const id = `donation-${++donationSequence}`;
    await db.query('INSERT INTO donations (id, "institutionId", "amountCents", "donatedAt", description, "receiptUrl", "receiptReviewedAt", "publishedAt", "updatedAt") VALUES ($1,\'fixture-institution\',$2,NOW(),\'Isolated fixture\',$3,$4,$5,NOW())', [id, amountCents, receiptUrl, reviewed ? new Date() : null, published ? new Date() : null]);
    return id;
  }

  try {
    const migrationNames = (await readdir(migrationsUrl, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
    assert.ok(migrationNames.includes("20260905120000_premium_pix_transparency"));
    for (const name of migrationNames) {
      if (name === "20260905120000_premium_pix_transparency") await createLetter("legacy-letter", "PUBLISHED");
      await db.exec(await readFile(new URL(`${name}/migration.sql`, migrationsUrl), "utf8"));
    }

    const legacy = await db.query('SELECT status, "premiumStatus", "premiumRulesVersion", "quizEnabled", "vouchersEnabled", "loveWheelEnabled", "ownerTokenHash", "showFavoritePlace", "expiresAt" IS NOT NULL AS "hasExpiration", "termsAcceptedAt", "termsVersion", "privacyVersion" FROM letters WHERE id=\'legacy-letter\'');
    assert.deepEqual(legacy.rows, [{ status: "PUBLISHED", premiumStatus: "FREE", premiumRulesVersion: 0, quizEnabled: false, vouchersEnabled: false, loveWheelEnabled: false, ownerTokenHash: null, showFavoritePlace: true, hasExpiration: true, termsAcceptedAt: null, termsVersion: null, privacyVersion: null }]);
    await createLetter("new-letter");
    const created = await db.query('SELECT "premiumStatus", "premiumRulesVersion" FROM letters WHERE id=\'new-letter\'');
    assert.deepEqual(created.rows, [{ premiumStatus: "FREE", premiumRulesVersion: 1 }]);

    const activePayment = await createPayment({ activeLetterId: "new-letter" });
    for (const field of ["activeLetterId", "externalReference", "idempotencyKey", "providerOrderId", "providerPaymentId", "providerReferenceId"] as const) {
      await assert.rejects(createPayment({ [field]: activePayment[field] }), { code: "23505", constraint: `payments_${field}_key` }, `Duplicate ${field} must be rejected`);
    }
    // Multiple completed/inactive attempts may coexist because the active key is nullable.
    await createPayment();
    await createPayment();
    await assert.rejects(createPayment({ activeLetterId: "legacy-letter" }), { code: "23514", constraint: "payments_active_letter_valid" });
    for (const amountCents of [0, -790]) await assert.rejects(createPayment({ amountCents }), { code: "23514", constraint: "payments_amount_positive" });
    for (const refundedAmountCents of [-1, 791]) await assert.rejects(createPayment({ refundedAmountCents }), { code: "23514", constraint: "payments_refunds_valid" });
    await assert.rejects(createPayment({ feeCents: -1 }), { code: "23514", constraint: "payments_fees_valid" });
    await createPayment({ refundedAmountCents: 790 });
    const snapshot = await db.query('SELECT "allocationBasis", "allocationRateBps" FROM payments WHERE id=$1', [activePayment.id]);
    assert.deepEqual(snapshot.rows, [{ allocationBasis: "GROSS_AFTER_REFUNDS", allocationRateBps: 1500 }]);
    await db.query('UPDATE payments SET "activeLetterId"=NULL WHERE "letterId"=\'new-letter\'');
    await db.query('DELETE FROM letters WHERE id=\'new-letter\'');
    const preservedPayments = await db.query('SELECT "letterId" FROM payments WHERE id=$1', [activePayment.id]);
    assert.deepEqual(preservedPayments.rows, [{ letterId: null }]);

    await db.query('INSERT INTO love_vouchers (id,"letterId",title,position,"totalUses","updatedAt") VALUES (\'voucher-one\',\'legacy-letter\',\'Café na cama\',0,1,NOW())');
    const redemptions = await Promise.all([
      db.query('UPDATE love_vouchers SET "usedCount"="usedCount"+1,"updatedAt"=NOW() WHERE id=\'voucher-one\' AND ("totalUses" IS NULL OR "usedCount" < "totalUses") RETURNING "usedCount"'),
      db.query('UPDATE love_vouchers SET "usedCount"="usedCount"+1,"updatedAt"=NOW() WHERE id=\'voucher-one\' AND ("totalUses" IS NULL OR "usedCount" < "totalUses") RETURNING "usedCount"'),
    ]);
    assert.equal(redemptions.reduce((total, result) => total + result.rows.length, 0), 1);
    await assert.rejects(db.query('INSERT INTO love_vouchers (id,"letterId",title,position,"totalUses","updatedAt") VALUES (\'invalid-voucher\',\'legacy-letter\',\'Inválido\',1,4,NOW())'), { code: "23514", constraint: "love_vouchers_total_uses_valid" });
    await db.query('INSERT INTO love_wheels (id,"letterId","updatedAt") VALUES (\'wheel-one\',\'legacy-letter\',NOW())');
    assert.deepEqual((await db.query('SELECT title FROM love_wheels WHERE id=\'wheel-one\'')).rows, [{ title: "Roleta do Amor" }]);
    await db.query('INSERT INTO love_wheel_options (id,"wheelId",title,position) VALUES (\'wheel-option-one\',\'wheel-one\',\'Cinema\',0)');
    await assert.rejects(db.query('INSERT INTO love_wheel_options (id,"wheelId",title,position) VALUES (\'wheel-option-two\',\'wheel-one\',\'Piquenique\',0)'), { code: "23505", constraint: "love_wheel_options_wheelId_position_key" });

    await db.query('INSERT INTO donation_institutions (id,name,"updatedAt") VALUES (\'fixture-institution\',\'Isolated fixture\',NOW())');
    await createDonation(); // Draft records do not require a receipt yet.
    for (const amountCents of [0, -119]) await assert.rejects(createDonation({ amountCents }), { code: "23514", constraint: "donations_amount_positive" });
    await assert.rejects(createDonation({ published: true }), { code: "23514", constraint: "donations_public_receipt_required" });
    await assert.rejects(createDonation({ published: true, receiptUrl: "https://example.test/redacted.pdf" }), { code: "23514", constraint: "donations_public_receipt_required" });
    await assert.rejects(createDonation({ published: true, reviewed: true }), { code: "23514", constraint: "donations_public_receipt_required" });
    await assert.rejects(createDonation({ published: true, reviewed: true, receiptUrl: "http://example.test/redacted.pdf" }), { code: "23514", constraint: "donations_public_receipt_required" });
    await createDonation({ published: true, reviewed: true, receiptUrl: "https://example.test/redacted.pdf" });
    await db.query('INSERT INTO content_reports (id,"letterReference",reason,description,"contactEmail","updatedAt") VALUES (\'report-one\',\'/c/fixture\',\'PERSONAL_DATA\',\'Exposição indevida em fixture.\',\'fixture@example.test\',NOW())');
    assert.deepEqual((await db.query('SELECT status FROM content_reports WHERE id=\'report-one\'')).rows, [{ status: "PENDING" }]);
  } finally {
    await db.close();
  }
});
