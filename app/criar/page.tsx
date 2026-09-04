import type { Metadata } from "next";
import { CreatorWorkspace } from "@/components/create/creator-workspace";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = createPageMetadata({
  title: "Criar Cartinha de Amor Grátis",
  description:
    "Crie grátis sua cartinha de amor online. Personalize texto, fotos, música e a data do relacionamento para compartilhar por link e QR Code.",
  path: "/criar",
});

export default function CreateLetterPage() {
  return <CreatorWorkspace />;
}
