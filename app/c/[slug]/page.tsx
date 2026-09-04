import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LetterImageRole, LetterTheme } from "@/generated/prisma/client";
import { PublishedLetter } from "@/components/letter/published-letter";
import type { PublicLetterData } from "@/lib/letters/contracts";
import { getPublishedLetterBySlug } from "@/lib/letters/queries";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Uma cartinha especial | Minha Cartinha",
  description: "Uma surpresa feita com carinho está esperando para ser aberta.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  referrer: "no-referrer",
};

function publicTheme(theme: LetterTheme): PublicLetterData["themeId"] {
  if (theme === LetterTheme.LAVENDER) return "lavanda";
  if (theme === LetterTheme.SUNSET) return "entardecer";
  return "vinho";
}

export default async function PublicLetterPage({ params }: PageProps<"/c/[slug]">) {
  const { slug } = await params;
  if (!slug || slug.length > 100) notFound();

  const letter = await getPublishedLetterBySlug(slug);
  if (!letter) notFound();

  const heroImage = letter.images.find((image) => image.role === LetterImageRole.HERO);
  const favoritePlaceImage = letter.images.find(
    (image) => image.role === LetterImageRole.FAVORITE_PLACE,
  );
  const gallery = letter.images.filter((image) => image.role === LetterImageRole.GALLERY);

  const publicLetter: PublicLetterData = {
    slug: letter.slug,
    recipientName: letter.recipientName,
    senderName: letter.senderName,
    title: letter.title,
    message: letter.message,
    signature: letter.signature,
    relationshipStartedAt: letter.relationshipStartedAt?.toISOString() ?? "",
    openingText: letter.openingText,
    closingText: letter.closingText,
    heroImage: heroImage?.secureUrl ?? "",
    gallery: gallery.map((image) => ({
      id: image.id,
      src: image.secureUrl,
      caption: image.caption ?? `Momento ${image.position + 1}`,
    })),
    favoritePlace: {
      name: letter.favoritePlaceName ?? "",
      caption: letter.favoritePlaceCaption ?? "",
      image: favoritePlaceImage?.secureUrl ?? "",
    },
    song: {
      title: letter.songTitle ?? "",
      artist: letter.songArtist ?? "",
      spotifyUrl: letter.spotifyUrl ?? "",
    },
    themeId: publicTheme(letter.theme),
    showRelationshipTime: letter.showRelationshipTime,
    showMusic: letter.showMusic,
  };

  return <PublishedLetter letter={publicLetter} />;
}
