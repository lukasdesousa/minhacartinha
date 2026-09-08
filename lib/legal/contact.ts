import "server-only";

import { LEGAL_CONTACT_PLACEHOLDER } from "@/lib/legal/config";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

export function getLegalContactEmail() {
  const configured = process.env.LEGAL_CONTACT_EMAIL?.trim() || "";
  return emailPattern.test(configured) ? configured : null;
}

export function getLegalContactLabel() {
  return getLegalContactEmail() ?? LEGAL_CONTACT_PLACEHOLDER;
}
