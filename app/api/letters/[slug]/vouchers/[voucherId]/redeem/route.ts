import { Prisma } from "@/generated/prisma/client";
import { withPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VoucherRow = { id: string; title: string; description: string | null; totalUses: number | null; usedCount: number };
const safeId = /^[A-Za-z0-9_-]{1,100}$/;
const headers = { "Cache-Control": "no-store" };

export async function POST(_request: Request, context: RouteContext<"/api/letters/[slug]/vouchers/[voucherId]/redeem">) {
  const { slug, voucherId } = await context.params;
  if (!safeId.test(slug) || !safeId.test(voucherId)) return Response.json({ error: "Vale inválido." }, { status: 400, headers });
  try {
    const result = await withPrisma(async (prisma) => {
      const rows = await prisma.$queryRaw<VoucherRow[]>(Prisma.sql`
        UPDATE "love_vouchers" AS voucher
        SET "usedCount" = voucher."usedCount" + 1, "updatedAt" = CURRENT_TIMESTAMP
        FROM "letters" AS letter
        WHERE voucher."id" = ${voucherId}
          AND voucher."letterId" = letter."id"
          AND letter."slug" = ${slug}
          AND letter."status" = 'PUBLISHED'::"LetterStatus"
          AND letter."premiumStatus" = 'PREMIUM'::"PremiumStatus"
          AND letter."vouchersEnabled" = true
          AND (voucher."totalUses" IS NULL OR voucher."usedCount" < voucher."totalUses")
        RETURNING voucher."id", voucher."title", voucher."description", voucher."totalUses", voucher."usedCount"
      `);
      if (rows[0]) return { voucher: rows[0], status: 200 };
      const exists = await prisma.$queryRaw<Array<{ exists: boolean }>>(Prisma.sql`
        SELECT EXISTS(
          SELECT 1 FROM "love_vouchers" voucher
          JOIN "letters" letter ON letter."id" = voucher."letterId"
          WHERE voucher."id" = ${voucherId} AND letter."slug" = ${slug}
            AND letter."status" = 'PUBLISHED'::"LetterStatus"
            AND letter."premiumStatus" = 'PREMIUM'::"PremiumStatus"
            AND letter."vouchersEnabled" = true
        ) AS "exists"
      `);
      return { voucher: null, status: exists[0]?.exists ? 409 : 404 };
    });
    if (!result.voucher) return Response.json({ error: result.status === 409 ? "Este vale já foi totalmente resgatado." : "Vale não encontrado." }, { status: result.status, headers });
    return Response.json({ voucher: { ...result.voucher, description: result.voucher.description ?? "" } }, { headers });
  } catch {
    console.error("[voucher.redeem] Não foi possível resgatar o vale.");
    return Response.json({ error: "Não foi possível resgatar o vale agora." }, { status: 500, headers });
  }
}
