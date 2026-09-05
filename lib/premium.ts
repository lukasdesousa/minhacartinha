// Shared display constants. The server always defines the amount independently of request bodies.
export const PREMIUM_PRICE_CENTS = 790;
export const PREMIUM_PRICE_LABEL = "R$ 7,90";
export const FREE_GALLERY_LIMIT = 2;
export const MAX_GALLERY_PHOTOS = 6;
export type PremiumStatus = "FREE" | "PAYMENT_PENDING" | "PREMIUM";
export type CreationPlan = "FREE" | "PREMIUM";
