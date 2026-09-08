import type { Metadata } from "next";
import Link from "next/link";
import { ContentReportForm } from "@/components/legal/content-report-form";
import { Brand } from "@/components/ui/brand";
import { getLegalContactLabel } from "@/lib/legal/contact";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Denunciar conteúdo",
    description: "Solicite a análise de uma cartinha que possa violar seus direitos.",
    path: "/denunciar",
  }),
  robots: { index: false, follow: true },
};

export default function ReportContentPage() {
  const contact = getLegalContactLabel();
  return (
    <div className="min-h-screen bg-[#fcfaf8] text-[#4f3942]">
      <header className="border-b border-[#eadfe1] bg-white/80">
        <nav aria-label="Navegação principal" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Brand href="/" />
          <Link href="/" className="text-sm font-semibold text-[#805464] underline-offset-4 hover:underline">Voltar ao início</Link>
        </nav>
      </header>
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b4b63]">Direitos e segurança</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-none tracking-[-0.04em] text-[#4d2030]">Denunciar conteúdo</h1>
          <p className="mt-6 text-sm leading-7 text-[#735d66]">Use este canal se uma cartinha expõe seus dados, usa sua imagem sem autorização, contém assédio, conteúdo íntimo sem consentimento, viola direitos autorais ou causa outra violação de direitos.</p>
          <p className="mt-4 text-sm leading-7 text-[#735d66]">A solicitação será analisada com base nas informações enviadas. Poderemos pedir comprovação adicional. O envio não produz remoção automática.</p>
          <div className="mt-7 rounded-2xl border border-[#ead8dd] bg-[#fff7f9] p-4 text-xs leading-6 text-[#775e67]">
            <p><strong className="text-[#593743]">Risco imediato?</strong> Em situação de emergência ou crime em andamento, procure as autoridades competentes.</p>
            <p className="mt-2">Contato alternativo: <strong>{contact}</strong></p>
          </div>
        </div>
        <ContentReportForm />
      </main>
    </div>
  );
}
