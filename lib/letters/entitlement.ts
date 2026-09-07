import { FREE_GALLERY_LIMIT } from "@/lib/premium";

export class PremiumRequiredError extends Error {
  readonly status = 402;
  constructor() {
    super("Desbloqueie todos os recursos Premium desta cartinha por apenas R$ 7,90.");
  }
}

export type PremiumFeatures = {
  quizEnabled: boolean;
  galleryCount: number;
  vouchersEnabled?: boolean;
  loveWheelEnabled?: boolean;
};

export function needsPremium(input: PremiumFeatures) {
  return input.quizEnabled || input.galleryCount > FREE_GALLERY_LIMIT || input.vouchersEnabled === true || input.loveWheelEnabled === true;
}

export function assertPublishEntitlement(
  input: PremiumFeatures,
  premiumStatus: string,
) {
  if (needsPremium(input) && premiumStatus !== "PREMIUM") throw new PremiumRequiredError();
}
