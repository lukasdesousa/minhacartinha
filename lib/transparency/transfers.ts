export type TransferStatus = "COMPLETED" | "IN_PROGRESS";

export type TransferAsset = {
  src: string;
  alt: string;
  downloadName: string;
};

export type DonationTransfer = {
  id: string;
  month: string;
  year: number;
  status: TransferStatus;
  /** Closed periods keep the amount actually transferred, in BRL cents. */
  amountCents?: number;
  /** ISO timestamp of the PIX transfer when it is available. */
  transferredAt?: string;
  recipient?: string;
  recipientUrl?: string;
  recipientImage?: TransferAsset;
  pixProof?: TransferAsset;
  description?: string;
};

/**
 * Publicly documented transfers. Add one object per period here when its
 * transfer and supporting files are ready to be shown. Values are cents so
 * currency never depends on floating-point arithmetic.
 */
export const documentedTransfers: DonationTransfer[] = [
  {
    id: "september-2026-causa-pet",
    month: "Setembro",
    year: 2026,
    status: "COMPLETED",
    amountCents: 476,
    transferredAt: "2026-10-03T14:00:34-03:00",
    recipient: "Causa Pet",
    recipientUrl: "https://www.instagram.com/causapet/",
    description: "Repasse referente ao período de setembro de 2026.",
    recipientImage: {
      src: "/img/donations/september2026/ong.jpg",
      alt: "Perfil do Instituto Causa Pet | Lar Temporário",
      downloadName: "causa-pet-perfil-setembro-2026.jpg",
    },
    pixProof: {
      src: "/img/donations/september2026/comprovante.jpg",
      alt: "Comprovante PIX da doação para a Causa Pet",
      downloadName: "doacao-setembro-2026-comprovante-pix.jpg",
    },
  },
];

export function periodKey(month: number, year: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function transferPeriodLabel(transfer: Pick<DonationTransfer, "month" | "year">) {
  return `${transfer.month} de ${transfer.year}`;
}
