import type { QuizQuestion } from "@/lib/letters/quiz";

export type CreateLetterResponse = {
  id: string;
  slug: string;
  path: string;
  publicUrl: string;
  qrCodeDataUrl: string;
  emailStatus: "sent" | "failed" | "pending";
  emailMessage: string;
};

export type ApiErrorResponse = {
  error: string;
};

export type PublicGalleryPhoto = {
  id: string;
  src: string;
  caption: string;
};

export type PublicLoveVoucher = {
  id: string;
  title: string;
  description: string;
  totalUses: number | null;
  usedCount: number;
};

export type PublicLoveWheelOption = {
  id: string;
  title: string;
  description: string;
};

export type PublicLetterData = {
  quizEnabled: boolean;
  quiz: QuizQuestion[];
  vouchersEnabled: boolean;
  vouchers: PublicLoveVoucher[];
  loveWheelEnabled: boolean;
  loveWheelTitle: string;
  loveWheelOptions: PublicLoveWheelOption[];
  slug: string;
  recipientName: string;
  senderName: string;
  title: string;
  message: string;
  signature: string;
  relationshipStartedAt: string;
  openingText: string;
  closingText: string;
  heroImage: string;
  gallery: PublicGalleryPhoto[];
  favoritePlace: {
    name: string;
    caption: string;
    image: string;
  };
  showFavoritePlace: boolean;
  song: {
    title: string;
    artist: string;
    spotifyUrl: string;
  };
  themeId: "vinho" | "lavanda" | "entardecer";
  showRelationshipTime: boolean;
  showMusic: boolean;
};
