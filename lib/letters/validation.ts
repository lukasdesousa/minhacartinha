import { getCanonicalSpotifyUrl } from "@/lib/spotify";
import { parseQuiz, type QuizQuestion } from "@/lib/letters/quiz";
import { MAX_GALLERY_PHOTOS } from "@/lib/premium";

const MAX_IMAGE_BYTES = 400_000;
const MAX_TOTAL_IMAGE_BYTES = 3_200_000;
const acceptedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

type ImageRole = "HERO" | "GALLERY" | "FAVORITE_PLACE";

export type ValidatedLetterImage = {
  role: ImageRole;
  position: number;
  caption: string | null;
  mimeType: string;
  bytes: Uint8Array<ArrayBuffer>;
  size: number;
};

export type ValidatedLetterInput = {
  quizEnabled: boolean;
  quiz: QuizQuestion[];
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  title: string;
  message: string;
  signature: string;
  relationshipStartedAt: Date | null;
  openingText: string;
  closingText: string;
  favoritePlaceName: string | null;
  favoritePlaceCaption: string | null;
  songTitle: string | null;
  songArtist: string | null;
  spotifyUrl: string | null;
  themeId: "vinho" | "lavanda" | "entardecer";
  showRelationshipTime: boolean;
  showMusic: boolean;
  images: ValidatedLetterImage[];
};

export class LetterValidationError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredText(
  record: Record<string, unknown>,
  key: string,
  label: string,
  maxLength: number,
) {
  const value = record[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new LetterValidationError(`${label} é obrigatório.`);
  }
  if (value.length > maxLength) {
    throw new LetterValidationError(`${label} ultrapassa ${maxLength} caracteres.`);
  }
  return value.trim();
}

function optionalText(value: unknown, label: string, maxLength: number) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") {
    throw new LetterValidationError(`${label} é inválido.`);
  }
  if (value.length > maxLength) {
    throw new LetterValidationError(`${label} ultrapassa ${maxLength} caracteres.`);
  }
  return value.trim() || null;
}

function booleanValue(record: Record<string, unknown>, key: string, label: string) {
  const value = record[key];
  if (typeof value !== "boolean") {
    throw new LetterValidationError(`${label} é inválido.`);
  }
  return value;
}

function recipientEmailValue(value: unknown) {
  if (typeof value !== "string") {
    throw new LetterValidationError("Informe o e-mail que receberá a cartinha.");
  }

  const email = value.trim().toLowerCase();
  if (
    !email ||
    email.length > 254 ||
    email.includes("\r") ||
    email.includes("\n") ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email)
  ) {
    throw new LetterValidationError("Informe um endereço de e-mail válido.");
  }

  return email;
}

function relationshipStartedAtValue(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || value.length > 40) {
    throw new LetterValidationError("A data de início do namoro é inválida.");
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new LetterValidationError("A data de início do namoro é inválida.");
  }
  if (date.getTime() > Date.now() + 5 * 60_000) {
    throw new LetterValidationError("A data de início do namoro precisa estar no passado.");
  }
  return date;
}

function spotifyUrlValue(value: unknown) {
  const url = optionalText(value, "O link do Spotify", 300);
  if (!url) return null;

  const canonicalUrl = getCanonicalSpotifyUrl(url);
  if (!canonicalUrl) {
    throw new LetterValidationError("Cole um link válido de uma música do Spotify.");
  }
  return canonicalUrl;
}

function hasValidImageSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }
  if (mimeType === "image/webp") {
    return (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    );
  }
  return false;
}

function decodeImage(
  value: unknown,
  role: ImageRole,
  position: number,
  caption: string | null,
): ValidatedLetterImage | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") {
    throw new LetterValidationError("Uma das imagens é inválida.");
  }

  const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || !acceptedMimeTypes.has(match[1])) {
    throw new LetterValidationError("Use apenas imagens JPG, PNG ou WebP.");
  }

  const decodedBytes = Buffer.from(match[2], "base64");
  if (!decodedBytes.length || decodedBytes.byteLength > MAX_IMAGE_BYTES) {
    throw new LetterValidationError("Uma imagem ficou grande demais após a otimização.");
  }
  if (!hasValidImageSignature(decodedBytes, match[1])) {
    throw new LetterValidationError("Uma das imagens possui conteúdo inválido.");
  }

  const bytes = Uint8Array.from(decodedBytes);

  return {
    role,
    position,
    caption,
    mimeType: match[1],
    bytes,
    size: bytes.byteLength,
  };
}

export function parseLetterPayload(value: unknown): ValidatedLetterInput {
  if (!isRecord(value)) {
    throw new LetterValidationError("Os dados da cartinha são inválidos.");
  }

  const favoritePlace = value.favoritePlace;
  const song = value.song;
  const gallery = value.gallery;

  if (!isRecord(favoritePlace) || !isRecord(song) || !Array.isArray(gallery)) {
    throw new LetterValidationError("Alguns detalhes da cartinha são inválidos.");
  }
  if (typeof value.website === "string" && value.website.trim()) {
    throw new LetterValidationError("Não foi possível validar este envio.");
  }
  if (gallery.length > MAX_GALLERY_PHOTOS) {
    throw new LetterValidationError(`Adicione no máximo ${MAX_GALLERY_PHOTOS} fotos ao carrossel.`);
  }

  const themeId = value.themeId;
  if (themeId !== "vinho" && themeId !== "lavanda" && themeId !== "entardecer") {
    throw new LetterValidationError("O tema escolhido é inválido.");
  }

  const images: ValidatedLetterImage[] = [];
  const heroImage = decodeImage(value.heroImage, "HERO", 0, null);
  if (heroImage) images.push(heroImage);

  gallery.forEach((item, index) => {
    if (!isRecord(item)) {
      throw new LetterValidationError("Uma foto do carrossel é inválida.");
    }
    const caption = optionalText(item.caption, "A legenda", 60);
    const image = decodeImage(item.src, "GALLERY", index, caption);
    if (!image) {
      throw new LetterValidationError("Uma foto do carrossel está vazia.");
    }
    images.push(image);
  });

  const favoritePlaceCaption = optionalText(
    favoritePlace.caption,
    "A descrição do lugar favorito",
    180,
  );
  const favoritePlaceImage = decodeImage(
    favoritePlace.image,
    "FAVORITE_PLACE",
    0,
    favoritePlaceCaption,
  );
  if (favoritePlaceImage) images.push(favoritePlaceImage);

  const totalImageBytes = images.reduce((total, image) => total + image.size, 0);
  if (totalImageBytes > MAX_TOTAL_IMAGE_BYTES) {
    throw new LetterValidationError("O conjunto de imagens ficou grande demais.");
  }

  if (value.quizEnabled !== undefined && typeof value.quizEnabled !== "boolean") {
    throw new LetterValidationError("A configuração do Quiz é inválida.");
  }
  const quizEnabled = value.quizEnabled === true;
  let quiz: QuizQuestion[];
  try {
    quiz = parseQuiz(value.quiz ?? [], quizEnabled);
  } catch (error) {
    throw new LetterValidationError(error instanceof Error ? error.message : "O Quiz é inválido.");
  }

  return {
    quizEnabled,
    quiz,
    recipientName: requiredText(value, "recipientName", "O nome de quem recebe", 40),
    recipientEmail: recipientEmailValue(value.recipientEmail),
    senderName: requiredText(value, "senderName", "Seu nome", 40),
    title: requiredText(value, "title", "O título", 70),
    message: requiredText(value, "message", "A mensagem", 900),
    signature: requiredText(value, "signature", "A assinatura", 60),
    relationshipStartedAt: relationshipStartedAtValue(value.relationshipStartedAt),
    openingText: requiredText(value, "openingText", "A frase de abertura", 70),
    closingText: requiredText(value, "closingText", "A frase final", 100),
    favoritePlaceName: optionalText(favoritePlace.name, "O lugar favorito", 60),
    favoritePlaceCaption,
    songTitle: optionalText(song.title, "O nome da música", 60),
    songArtist: optionalText(song.artist, "O artista", 70),
    spotifyUrl: spotifyUrlValue(song.spotifyUrl),
    themeId,
    showRelationshipTime: booleanValue(
      value,
      "showRelationshipTime",
      "A exibição do tempo de namoro",
    ),
    showMusic: booleanValue(value, "showMusic", "A exibição da música"),
    images,
  };
}
