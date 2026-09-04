const PUBLIC_LETTER_PREFIX = "/c";

function configuredBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim();
  if (configuredUrl) return configuredUrl;

  const resendDomain = process.env.RESEND_DOMAIN?.trim().toLowerCase();
  return resendDomain ? `https://${resendDomain}` : "";
}

function normalizeBaseUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("A URL pública precisa usar HTTP ou HTTPS.");
  }
  return url.origin;
}

export function getPublicLetterPath(publicId: string) {
  return `${PUBLIC_LETTER_PREFIX}/${encodeURIComponent(publicId)}`;
}

export function getPublicLetterUrl(publicId: string, requestUrl?: string) {
  const baseUrl = configuredBaseUrl() || (requestUrl ? new URL(requestUrl).origin : "");
  if (!baseUrl) {
    throw new Error("Defina NEXT_PUBLIC_APP_URL para gerar o link público da cartinha.");
  }
  return `${normalizeBaseUrl(baseUrl)}${getPublicLetterPath(publicId)}`;
}
