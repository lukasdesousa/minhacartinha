export const FREE_LETTER_LIFETIME_DAYS = 2;
export const FREE_LETTER_LIFETIME_MS = FREE_LETTER_LIFETIME_DAYS * 24 * 60 * 60 * 1_000;

export function getLetterExpirationAt(premiumStatus: string, publishedAt: Date) {
  return premiumStatus === "PREMIUM"
    ? null
    : new Date(publishedAt.getTime() + FREE_LETTER_LIFETIME_MS);
}

export function isPublishedLetterAvailable(
  premiumStatus: string,
  expiresAt: Date | null,
  now = new Date(),
) {
  return premiumStatus === "PREMIUM" || Boolean(expiresAt && expiresAt > now);
}
