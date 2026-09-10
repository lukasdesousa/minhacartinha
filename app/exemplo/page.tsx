import type { Metadata } from "next";
import { PublishedLetter } from "@/components/letter/published-letter";
import { demoPremiumLetter } from "@/lib/letters/demo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Cartinha premium de Clara e Gabriel",
  description: "Conheça uma cartinha premium completa com fotos, contador, quiz, vales e roleta do amor.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PremiumLetterExamplePage() {
  return <PublishedLetter letter={demoPremiumLetter} demo />;
}
