import type { Metadata } from "next";
import Link from "next/link";
import {
  PageHero,
  SeoHeader,
  type BreadcrumbItem,
} from "@/components/seo/content-page";
import { StructuredData } from "@/components/seo/structured-data";
import { createStructuredPage } from "@/lib/seo-content";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

const title = "Guias para criar cartinhas e surpresas românticas";
const description = "Guias práticos para escrever uma carta de amor, planejar uma surpresa romântica e comemorar o aniversário de namoro com significado.";
const path = "/guias";
const breadcrumbs: BreadcrumbItem[] = [
  { label: "Início", href: "/" },
  { label: "Guias" },
];

export const metadata: Metadata = createPageMetadata({ title, description, path });

const structuredData = createStructuredPage({ path, title, description, breadcrumbs });

const guides = [
  {
    href: "/guias/como-escrever-uma-carta-de-amor",
    category: "Escrita",
    title: "Como escrever uma carta de amor",
    description: "Organize sentimentos, memórias e planos em um texto que tenha a sua voz — com roteiro e exemplos fictícios comentados.",
    time: "12 min de leitura",
  },
  {
    href: "/guias/ideias-de-surpresa-romantica",
    category: "Inspiração",
    title: "Ideias de surpresa romântica",
    description: "Escolha uma ideia pelo perfil da pessoa, pelo tempo disponível e pelo orçamento, sem cair em gestos genéricos.",
    time: "11 min de leitura",
  },
  {
    href: "/guias/aniversario-de-namoro",
    category: "Datas especiais",
    title: "Como comemorar o aniversário de namoro",
    description: "Um plano completo para transformar a história do casal em uma comemoração simples, pessoal e bem pensada.",
    time: "10 min de leitura",
  },
];

export default function GuiasPage() {
  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      <StructuredData data={structuredData} />
      <SeoHeader />
      <main id="conteudo">
        <PageHero
          breadcrumbs={breadcrumbs}
          eyebrow="Biblioteca de ideias"
          title="Guias para transformar sentimento em gesto"
          description="Conteúdo prático para quem quer escrever com sinceridade, planejar uma surpresa e criar um presente que tenha detalhes da própria história."
        />
        <section className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {guides.map((guide, index) => (
              <article key={guide.href} className="group flex flex-col rounded-[1.8rem] border border-[#e6d8dc] bg-white p-6 shadow-[0_14px_40px_rgba(72,29,43,0.045)] sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#9c5369]">{guide.category}</span>
                  <span className="grid size-9 place-items-center rounded-full bg-[#f5e7eb] text-xs font-bold text-[#8e3d57]">0{index + 1}</span>
                </div>
                <h2 className="mt-7 font-serif text-3xl font-semibold leading-tight tracking-[-0.025em] text-[#522434]">{guide.title}</h2>
                <p className="mt-4 flex-1 text-sm leading-7 text-[#745c65]">{guide.description}</p>
                <p className="mt-6 text-xs font-semibold text-[#9a7e87]">{guide.time}</p>
                <Link href={guide.href} className="mt-5 inline-flex min-h-11 items-center font-bold text-[#8e2f4b] underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d415b]">
                  Ler guia completo →
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section className="border-y border-[#e4d6da] bg-[#f8f2f0] px-5 py-14 text-center sm:px-8">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#98526a]">Quer colocar a ideia em prática?</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#4d2130] sm:text-4xl">Crie uma experiência digital com a história de vocês</h2>
            <p className="mt-4 text-sm leading-7 text-[#755d66]">Veja como reunir cartinha, fotos, música e QR Code em um presente feito para abrir no celular.</p>
            <Link href="/presente-digital" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#8e2f4b] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(102,29,51,0.18)] hover:bg-[#76243d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d415b]">Conhecer o presente digital →</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
