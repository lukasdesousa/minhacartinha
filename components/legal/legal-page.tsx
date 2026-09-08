import Link from "next/link";
import { Brand } from "@/components/ui/brand";

export function LegalPage({ eyebrow, title, intro, version, children }: {
  eyebrow: string;
  title: string;
  intro: string;
  version: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcfaf8] text-[#4f3942]">
      <header className="border-b border-[#eadfe1] bg-white/80 backdrop-blur">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">Pular para o conteúdo</a>
        <nav aria-label="Navegação principal" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Brand href="/" />
          <Link href="/" className="text-sm font-semibold text-[#805464] underline-offset-4 hover:underline">Voltar ao início</Link>
        </nav>
      </header>
      <main id="conteudo" className="mx-auto max-w-4xl px-5 pb-20 sm:px-8 sm:pb-28">
        <header className="border-b border-[#eadfe1] py-14 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b4b63]">{eyebrow}</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-none tracking-[-0.04em] text-[#4d2030] sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#735d66]">{intro}</p>
          <p className="mt-5 text-xs font-semibold text-[#907982]">Versão {version}</p>
        </header>
        <article className="space-y-10 py-12 sm:py-16">{children}</article>
      </main>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-24">
      <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-[#552638]">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-[#6f5962] [&_a]:font-semibold [&_a]:text-[#7d3049] [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-[#553945] [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">{children}</div>
    </section>
  );
}
