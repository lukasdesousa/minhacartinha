export const allocationBasisLabels = {
  GROSS_AFTER_REFUNDS: "Receita bruta aprovada, menos reembolsos e estornos, sem deduzir taxas",
  NET_AFTER_FEES: "Receita aprovada, menos reembolsos, estornos e taxas do vendedor informadas pelo Mercado Pago",
} as const;

export type AllocationBasis = keyof typeof allocationBasisLabels;

export type CausePayment = {
  status: string;
  amountCents: number;
  refundedAmountCents: number;
  feeCents: number | null;
  liveMode: boolean;
  approvedAt: Date | null;
  allocationBasis: AllocationBasis;
  allocationRateBps: number;
};

function assertCents(value: number) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("Invalid financial amount.");
  }
}

/**
 * All accounting is in integer BRL cents. Each payment keeps its original
 * allocation basis and rate; changing configuration never rewrites history.
 * Round each payment's earmark to the nearest cent, half up (790 * 15% = 119).
 * This is an operational allocation, not a claim of a completed donation.
 */
export function calculateCauseSummary(payments: CausePayment[], donatedCents: number) {
  assertCents(donatedCents);
  let premiumRevenueCents = 0;
  let consideredCents = 0;
  let allocatedCents = 0;
  let awaitingFeesCount = 0;
  const bases: Record<AllocationBasis, number> = { GROSS_AFTER_REFUNDS: 0, NET_AFTER_FEES: 0 };

  for (const payment of payments) {
    // Only real, currently approved payments represent revenue. A full refund
    // or chargeback removes the original allocation even after a prior approval.
    if (!payment.liveMode || !payment.approvedAt || payment.status !== "APPROVED") continue;

    assertCents(payment.amountCents);
    assertCents(payment.refundedAmountCents);
    if (!Number.isSafeInteger(payment.allocationRateBps) || payment.allocationRateBps !== 1500) {
      throw new Error("The initiative requires a 15% allocation.");
    }
    if (!Object.hasOwn(allocationBasisLabels, payment.allocationBasis)) {
      throw new Error("Invalid allocation basis.");
    }
    const revenue = Math.max(0, payment.amountCents - payment.refundedAmountCents);
    premiumRevenueCents += revenue;
    let basisCents = revenue;
    if (payment.allocationBasis === "NET_AFTER_FEES") {
      if (payment.feeCents === null) {
        if (revenue > 0) awaitingFeesCount += 1;
        continue;
      }
      assertCents(payment.feeCents);
      basisCents = Math.max(0, revenue - payment.feeCents);
    }

    const numerator = basisCents * payment.allocationRateBps;
    assertCents(numerator + 5000);
    consideredCents += basisCents;
    bases[payment.allocationBasis] += basisCents;
    allocatedCents += Math.floor((numerator + 5000) / 10_000);
  }

  [premiumRevenueCents, consideredCents, allocatedCents].forEach(assertCents);
  return {
    premiumRevenueCents,
    consideredCents,
    allocatedCents,
    donatedCents,
    // A refund after a donation must not invent a negative cash reserve or erase
    // a real donation. Expose the resulting excess separately for reconciliation.
    reservedCents: Math.max(0, allocatedCents - donatedCents),
    donatedAboveAllocationCents: Math.max(0, donatedCents - allocatedCents),
    awaitingFeesCount,
    bases,
  };
}

export function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
