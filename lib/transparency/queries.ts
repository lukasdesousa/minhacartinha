import { withPrisma } from "@/lib/prisma";
import { allocationBasisLabels, calculateCauseSummary, type AllocationBasis } from "@/lib/transparency/accounting";
import { publicHttpsUrl } from "@/lib/transparency/receipts";

export async function getTransparencyReport() {
  const configuredBasis = process.env.ANIMAL_CAUSE_ALLOCATION_BASIS ?? "GROSS_AFTER_REFUNDS";
  const currentBasis: AllocationBasis | null = Object.hasOwn(allocationBasisLabels, configuredBasis) ? configuredBasis as AllocationBasis : null;

  try {
    if (!currentBasis) throw new Error("Invalid allocation configuration.");
    const now = new Date();
    const report = await withPrisma((prisma) => prisma.$transaction(async (tx) => {
      const [payments, donations] = await Promise.all([
        tx.payment.findMany({
          where: { liveMode: true, status: "APPROVED", approvedAt: { not: null } },
          select: {
            status: true, amountCents: true, refundedAmountCents: true, feeCents: true,
            liveMode: true, approvedAt: true, allocationBasis: true, allocationRateBps: true,
          },
        }),
        tx.donation.findMany({
          where: { publishedAt: { lte: now }, receiptReviewedAt: { lte: now }, donatedAt: { lte: now }, receiptUrl: { not: null } },
          orderBy: { donatedAt: "desc" },
          select: {
            id: true, amountCents: true, donatedAt: true, description: true,
            receiptUrl: true, note: true,
            institution: { select: { id: true, name: true, websiteUrl: true } },
          },
        }),
      ]);
      const verifiedDonations = donations.flatMap((donation) => {
        const receiptUrl = publicHttpsUrl(donation.receiptUrl);
        if (!receiptUrl) return [];
        return [{ ...donation, receiptUrl, institution: { ...donation.institution, websiteUrl: publicHttpsUrl(donation.institution.websiteUrl) } }];
      });
      const donatedCents = verifiedDonations.reduce((sum, donation) => sum + donation.amountCents, 0);
      return { summary: calculateCauseSummary(payments, donatedCents), donations: verifiedDonations };
    }, { isolationLevel: "RepeatableRead" }));
    return { available: true as const, currentBasis, updatedAt: now, ...report };
  } catch {
    // Do not print financial records, connection strings or personal data.
    console.error("[transparency] report_unavailable");
    return { available: false as const, currentBasis };
  }
}
