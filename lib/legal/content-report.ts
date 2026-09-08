export const CONTENT_REPORT_REASONS = {
  UNAUTHORIZED_IMAGE: "Uso não autorizado da minha imagem",
  PERSONAL_DATA: "Exposição de dados pessoais",
  HARASSMENT: "Assédio",
  NON_CONSENSUAL_INTIMATE_CONTENT: "Conteúdo íntimo sem consentimento",
  COPYRIGHT: "Violação de direitos autorais",
  OTHER: "Outro",
} as const;

export type ContentReportReasonValue = keyof typeof CONTENT_REPORT_REASONS;

export class ContentReportValidationError extends Error {
  constructor(message: string, readonly status = 422) { super(message); }
}

function normalizedText(value: unknown, label: string, min: number, max: number) {
  if (typeof value !== "string") throw new ContentReportValidationError(`${label} é inválido.`);
  const text = value.trim();
  if (text.length < min) throw new ContentReportValidationError(`${label} precisa ter pelo menos ${min} caracteres.`);
  if (text.length > max) throw new ContentReportValidationError(`${label} pode ter no máximo ${max} caracteres.`);
  return text;
}

export function parseContentReport(value: unknown, now = Date.now()) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ContentReportValidationError("Os dados da solicitação são inválidos.", 400);
  }
  const input = value as Record<string, unknown>;
  if (typeof input.website === "string" && input.website.trim()) {
    throw new ContentReportValidationError("Não foi possível validar este envio.", 400);
  }

  const startedAt = typeof input.startedAt === "number" ? input.startedAt : Number.NaN;
  if (!Number.isFinite(startedAt) || now - startedAt < 2_000 || now - startedAt > 86_400_000) {
    throw new ContentReportValidationError("Atualize a página e tente enviar novamente.", 400);
  }

  const reason = input.reason;
  if (typeof reason !== "string" || !(reason in CONTENT_REPORT_REASONS)) {
    throw new ContentReportValidationError("Selecione um motivo válido.");
  }

  const contactEmail = normalizedText(input.contactEmail, "O e-mail", 5, 254).toLowerCase();
  if (contactEmail.includes("\r") || contactEmail.includes("\n") || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(contactEmail)) {
    throw new ContentReportValidationError("Informe um e-mail válido.");
  }

  return {
    letterReference: normalizedText(input.letterReference, "A URL ou identificação da cartinha", 6, 500),
    reason: reason as ContentReportReasonValue,
    description: normalizedText(input.description, "A descrição", 20, 2000),
    contactEmail,
  };
}
