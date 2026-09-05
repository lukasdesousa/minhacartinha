import { FREE_GALLERY_LIMIT } from "@/lib/premium";

export class PremiumRequiredError extends Error {
  readonly status = 402;
  constructor() {
    super("Desbloqueie todos os recursos Premium desta cartinha por apenas R$ 7,90.");
  }
}

export function needsPremium(input: { quizEnabled: boolean; galleryCount: number }) {
  return input.quizEnabled || input.galleryCount > FREE_GALLERY_LIMIT;
}

export function assertPublishEntitlement(
  input: { quizEnabled: boolean; galleryCount: number },
  premiumStatus: string,
) {
  if (needsPremium(input) && premiumStatus !== "PREMIUM") throw new PremiumRequiredError();
}
