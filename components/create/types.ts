export const letterThemes = [
  {
    id: "vinho",
    name: "Romance",
    description: "Vinho e rosa queimado",
    colors: {
      accent: "#963b57",
      dark: "#4c1b2a",
      paper: "#fffaf8",
      wash: "#f2dfe4",
      muted: "#a86d7e",
    },
  },
  {
    id: "lavanda",
    name: "Lavanda",
    description: "Suave e contemporâneo",
    colors: {
      accent: "#76628f",
      dark: "#382e49",
      paper: "#fcfaff",
      wash: "#e9e4f1",
      muted: "#8e7da2",
    },
  },
  {
    id: "entardecer",
    name: "Entardecer",
    description: "Terracota e champagne",
    colors: {
      accent: "#a65a48",
      dark: "#522d2b",
      paper: "#fffaf5",
      wash: "#f1dfd2",
      muted: "#ad7969",
    },
  },
] as const;

export type ThemeId = (typeof letterThemes)[number]["id"];

export type GalleryPhoto = {
  id: string;
  src: string;
  caption: string;
};

export type LetterDraft = {
  recipientName: string;
  senderName: string;
  title: string;
  message: string;
  signature: string;
  relationshipStartedAt: string;
  openingText: string;
  closingText: string;
  heroImage: string;
  gallery: GalleryPhoto[];
  favoritePlace: {
    name: string;
    caption: string;
    image: string;
  };
  song: {
    spotifyUrl: string;
  };
  themeId: ThemeId;
  showRelationshipTime: boolean;
  showMusic: boolean;
};

export const initialLetterDraft: LetterDraft = {
  recipientName: "Gabriel",
  senderName: "Clara",
  title: "Para o amor da minha vida",
  message:
    "Em todos os meus dias favoritos, existe um pedacinho de você.\n\nObrigada por fazer do amor um lugar tão bonito para morar. Que a nossa história continue sendo meu capítulo preferido.",
  signature: "Com amor, sempre",
  relationshipStartedAt: "2024-06-12T20:00",
  openingText: "A nossa história favorita",
  closingText: "Eu escolheria você em todas as vidas.",
  heroImage: "",
  gallery: [],
  favoritePlace: {
    name: "Nosso lugar favorito",
    caption: "Onde o tempo desacelera e tudo fica mais bonito com você.",
    image: "",
  },
  song: {
    spotifyUrl: "",
  },
  themeId: "vinho",
  showRelationshipTime: true,
  showMusic: true,
};

export function getTheme(themeId: ThemeId) {
  return letterThemes.find((theme) => theme.id === themeId) ?? letterThemes[0];
}
