import type { Metadata } from "next";
import { CreatorWorkspace } from "@/components/create/creator-workspace";

export const metadata: Metadata = {
  title: "Criar minha cartinha | Minha Cartinha",
  description:
    "Personalize sua mensagem, adicione momentos especiais e veja sua cartinha ganhar vida em tempo real.",
};

export default function CreateLetterPage() {
  return <CreatorWorkspace />;
}
