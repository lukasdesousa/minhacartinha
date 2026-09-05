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

export type PublicLetterData = {
  quizEnabled: boolean;
  quiz: QuizQuestion[];
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
  song: {
    title: string;
    artist: string;
    spotifyUrl: string;
  };
  themeId: "vinho" | "lavanda" | "entardecer";
  showRelationshipTime: boolean;
  showMusic: boolean;
};
