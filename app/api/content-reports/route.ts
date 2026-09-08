import { ContentReportReason } from "@/generated/prisma/client";
import { sendContentReportNotification } from "@/lib/email/send-content-report-notification";
import { ContentReportValidationError, parseContentReport } from "@/lib/legal/content-report";
import { withPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const MAX_BODY_BYTES = 16_384;

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      throw new ContentReportValidationError("Envie os dados no formato correto.", 415);
    }
    if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
      throw new ContentReportValidationError("A solicitação ultrapassou o limite permitido.", 413);
    }
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      throw new ContentReportValidationError("A solicitação ultrapassou o limite permitido.", 413);
    }
    const input = parseContentReport(JSON.parse(raw));

    const recentCount = await withPrisma((prisma) => prisma.contentReport.count({
      where: { contactEmail: input.contactEmail, createdAt: { gte: new Date(Date.now() - 15 * 60_000) } },
    }));
    if (recentCount >= 3) {
      throw new ContentReportValidationError("Muitas solicitações foram enviadas em pouco tempo. Aguarde alguns minutos.", 429);
    }

    const report = await withPrisma((prisma) => prisma.contentReport.create({
      data: { ...input, reason: input.reason as ContentReportReason },
      select: { id: true, letterReference: true, reason: true, description: true, contactEmail: true },
    }));

    try {
      const messageId = await sendContentReportNotification({ ...report, reason: input.reason });
      if (messageId) {
        await withPrisma((prisma) => prisma.contentReport.update({
          where: { id: report.id },
          data: { notificationMessageId: messageId, notificationSentAt: new Date() },
        }));
      }
    } catch {
      console.error(`[content-report] Solicitação ${report.id} salva, mas a notificação não foi enviada.`);
    }

    return Response.json({ received: true }, { status: 201, headers });
  } catch (error) {
    if (error instanceof ContentReportValidationError) {
      return Response.json({ error: error.message }, { status: error.status, headers });
    }
    if (error instanceof SyntaxError) return Response.json({ error: "Os dados da solicitação são inválidos." }, { status: 400, headers });
    console.error("[content-report] Não foi possível registrar a solicitação.");
    return Response.json({ error: "Não foi possível registrar sua solicitação agora. Tente novamente." }, { status: 503, headers });
  }
}
