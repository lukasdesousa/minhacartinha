function object(value, field, keys) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${field}: objeto obrigatório.`);
  if (Object.keys(value).some((key) => !keys.includes(key))) throw new Error(`${field}: contém campos desconhecidos.`);
  return value;
}

function text(value, field, maxLength, optional = false) {
  if (optional && (value === null || value === undefined || value === "")) return null;
  if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) throw new Error(`${field}: texto inválido.`);
  return value.trim();
}

function id(value, field) {
  const result = text(value, field, 100);
  if (!/^[a-zA-Z0-9_-]{3,100}$/.test(result)) throw new Error(`${field}: use 3 a 100 letras, números, _ ou -.`);
  return result;
}

function publicUrl(value, field, maxLength) {
  const candidate = text(value, field, maxLength, true);
  if (!candidate) return null;
  let url;
  try { url = new URL(candidate); } catch { throw new Error(`${field}: URL inválida.`); }
  const host = url.hostname.toLowerCase();
  if (
    url.protocol !== "https:" || url.username || url.password ||
    host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") ||
    host.includes(":") || /^\d+(\.\d+){3}$/.test(host) || !host.includes(".") || url.search || url.hash
  ) throw new Error(`${field}: use um endereço HTTPS público, permanente, sem credenciais ou parâmetros.`);
  return url.toString();
}

export function validateDonationInput(input, publish = false, now = new Date()) {
  object(input, "Registro", ["institution", "donation"]);
  const sourceInstitution = object(input.institution, "institution", ["id", "name", "websiteUrl"]);
  const institution = {
    id: id(sourceInstitution.id, "institution.id"),
    name: text(sourceInstitution.name, "institution.name", 160),
    websiteUrl: publicUrl(sourceInstitution.websiteUrl, "institution.websiteUrl", 600),
  };
  if (input.donation === undefined) {
    if (publish) throw new Error("Uma doação é obrigatória para publicar.");
    return { institution, donation: null };
  }

  const source = object(input.donation, "donation", ["id", "amountCents", "donatedAt", "description", "receiptUrl", "note", "receiptPrivacyReviewed"]);
  if (!Number.isSafeInteger(source.amountCents) || source.amountCents <= 0 || source.amountCents > 2_147_483_647) throw new Error("donation.amountCents: informe um inteiro positivo em centavos.");
  if (typeof source.donatedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(source.donatedAt)) throw new Error("donation.donatedAt: use AAAA-MM-DD.");
  const donatedAt = new Date(`${source.donatedAt}T03:00:00.000Z`);
  if (Number.isNaN(donatedAt.getTime()) || donatedAt.toISOString().slice(0, 10) !== source.donatedAt) throw new Error("donation.donatedAt: data inválida.");
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Fortaleza", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  if (source.donatedAt > today) throw new Error("A doação não pode estar no futuro.");
  if (source.receiptPrivacyReviewed !== undefined && typeof source.receiptPrivacyReviewed !== "boolean") throw new Error("receiptPrivacyReviewed deve ser true ou false.");
  const receiptUrl = publicUrl(source.receiptUrl, "donation.receiptUrl", 1000);
  if (publish && (!receiptUrl || source.receiptPrivacyReviewed !== true)) throw new Error("Publicar exige um comprovante real e receiptPrivacyReviewed: true após revisão e ocultação dos dados pessoais.");

  return {
    institution,
    donation: {
      id: id(source.id, "donation.id"),
      amountCents: source.amountCents,
      donatedAt,
      description: text(source.description, "donation.description", 1000),
      receiptUrl,
      note: text(source.note, "donation.note", 1000, true),
      receiptReviewedAt: publish ? now : null,
      publishedAt: publish ? now : null,
    },
  };
}
