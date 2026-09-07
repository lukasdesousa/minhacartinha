import { Prisma } from "@/generated/prisma/client";
import { secureRandomIndex } from "@/lib/letters/romantic-features";
import { withPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WheelRow = { id: string; usageLimit: number | null; spinsUsed: number };
type OptionRow = { id: string; title: string; description: string | null; position: number };
const safeSlug = /^[A-Za-z0-9_-]{1,100}$/;
const headers = { "Cache-Control": "no-store" };

class SpinError extends Error { constructor(message: string, readonly status: number) { super(message); } }

export async function POST(_request: Request, context: RouteContext<"/api/letters/[slug]/wheel/spin">) {
  const { slug } = await context.params;
  if (!safeSlug.test(slug)) return Response.json({ error: "Roleta inválida." }, { status: 400, headers });
  try {
    const result = await withPrisma((prisma) => prisma.$transaction(async (tx) => {
      const wheels = await tx.$queryRaw<WheelRow[]>(Prisma.sql`
        SELECT wheel."id", wheel."usageLimit", wheel."spinsUsed"
        FROM "love_wheels" wheel
        JOIN "letters" letter ON letter."id" = wheel."letterId"
        WHERE letter."slug" = ${slug}
          AND letter."status" = 'PUBLISHED'::"LetterStatus"
          AND letter."premiumStatus" = 'PREMIUM'::"PremiumStatus"
          AND letter."loveWheelEnabled" = true
        FOR UPDATE OF wheel
      `);
      const wheel = wheels[0];
      if (!wheel) throw new SpinError("Roleta não encontrada.", 404);
      if (wheel.usageLimit !== null && wheel.spinsUsed >= wheel.usageLimit) throw new SpinError("A Roleta do Amor chegou ao limite de giros.", 409);
      const options = await tx.$queryRaw<OptionRow[]>(Prisma.sql`SELECT "id", "title", "description", "position" FROM "love_wheel_options" WHERE "wheelId" = ${wheel.id} ORDER BY "position" ASC`);
      if (options.length < 2) throw new SpinError("A Roleta do Amor não possui opções suficientes.", 409);
      const index = secureRandomIndex(options.length);
      await tx.$executeRaw(Prisma.sql`UPDATE "love_wheels" SET "spinsUsed" = "spinsUsed" + 1, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = ${wheel.id}`);
      return { index, option: { id: options[index].id, title: options[index].title, description: options[index].description ?? "" } };
    }));
    return Response.json(result, { headers });
  } catch (error) {
    if (error instanceof SpinError) return Response.json({ error: error.message }, { status: error.status, headers });
    console.error("[wheel.spin] Não foi possível girar a roleta.");
    return Response.json({ error: "Não foi possível girar a roleta agora." }, { status: 500, headers });
  }
}
