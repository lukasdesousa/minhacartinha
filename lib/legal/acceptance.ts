import { LEGAL_VERSIONS } from "@/lib/legal/config";

export class LegalAcceptanceError extends Error {
  readonly status = 422;
}

export type LegalAcceptance = {
  termsVersion: typeof LEGAL_VERSIONS.terms;
  privacyVersion: typeof LEGAL_VERSIONS.privacy;
};

export function parseLegalAcceptance(value: unknown): LegalAcceptance {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new LegalAcceptanceError(
      "Confirme os Termos de Uso, a Política de Privacidade e o direito de usar os conteúdos enviados.",
    );
  }

  const acceptance = value as Record<string, unknown>;
  if (
    acceptance.accepted !== true ||
    acceptance.termsVersion !== LEGAL_VERSIONS.terms ||
    acceptance.privacyVersion !== LEGAL_VERSIONS.privacy
  ) {
    throw new LegalAcceptanceError(
      "Revise e aceite as versões atuais dos Termos de Uso e da Política de Privacidade antes de publicar.",
    );
  }

  return {
    termsVersion: LEGAL_VERSIONS.terms,
    privacyVersion: LEGAL_VERSIONS.privacy,
  };
}
