import { cache } from "react";
import { LetterStatus } from "@/generated/prisma/client";
import { withPrisma } from "@/lib/prisma";

export const getPublishedLetterBySlug = cache(async (slug: string) => {
  return withPrisma((prisma) =>
    prisma.letter.findFirst({
      where: {
        slug,
        status: LetterStatus.PUBLISHED,
      },
      select: {
        slug: true,
        recipientName: true,
        senderName: true,
        title: true,
        message: true,
        signature: true,
        relationshipStartedAt: true,
        openingText: true,
        closingText: true,
        favoritePlaceName: true,
        favoritePlaceCaption: true,
        songTitle: true,
        songArtist: true,
        spotifyUrl: true,
        theme: true,
        showRelationshipTime: true,
        showMusic: true,
        premiumStatus: true,
        premiumRulesVersion: true,
        quizEnabled: true,
        quiz: true,
        images: {
          select: {
            id: true,
            role: true,
            position: true,
            caption: true,
            secureUrl: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    }),
  );
});
