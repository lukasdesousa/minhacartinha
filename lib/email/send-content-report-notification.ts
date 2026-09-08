import "server-only";

import { Resend } from "resend";
import { CONTENT_REPORT_REASONS, type ContentReportReasonValue } from "@/lib/legal/content-report";
import { getLegalContactEmail } from "@/lib/legal/contact";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

function sender() {
  const configured = process.env.RESEND_FROM_EMAIL?.trim();
  if (configured) return configured;
  const domain = process.env.RESEND_DOMAIN?.trim().toLowerCase();
  return domain && /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/u.test(domain)
    ? `Minha Cartinha <cartinhas@${domain}>`
    : null;
}

export async function sendContentReportNotification(input: {
  id: string;
  letterReference: string;
  reason: ContentReportReasonValue;
  description: string;
  contactEmail: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = sender();
  const to = getLegalContactEmail();
  if (!apiKey || !from || !to) return null;

  const reasonLabel = CONTENT_REPORT_REASONS[input.reason];
  const text = `Nova solicitação de análise de conteúdo\n\nProtocolo interno: ${input.id}\nCartinha: ${input.letterReference}\nMotivo: ${reasonLabel}\nContato: ${input.contactEmail}\n\nDescrição:\n${input.description}`;
  const { data, error } = await new Resend(apiKey).emails.send({
    from,
    to: [to],
    replyTo: input.contactEmail,
    subject: `Solicitação de análise de conteúdo — ${reasonLabel}`,
    text,
    html: `<h1>Nova solicitação de análise de conteúdo</h1><p><strong>Protocolo interno:</strong> ${escapeHtml(input.id)}</p><p><strong>Cartinha:</strong> ${escapeHtml(input.letterReference)}</p><p><strong>Motivo:</strong> ${escapeHtml(reasonLabel)}</p><p><strong>Contato:</strong> ${escapeHtml(input.contactEmail)}</p><h2>Descrição</h2><p>${escapeHtml(input.description).replace(/\n/g, "<br>")}</p>`,
  }, { idempotencyKey: `content-report/${input.id}` });
  if (error || !data?.id) throw new Error("O Resend não confirmou a notificação.");
  return data.id;
}
