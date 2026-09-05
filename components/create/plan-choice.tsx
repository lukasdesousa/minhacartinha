import { Brand } from "@/components/ui/brand";
import { CheckIcon, HeartIcon, SparklesIcon } from "@/components/ui/icons";
import type { CreationPlan } from "@/lib/premium";
import { PREMIUM_PRICE_LABEL } from "@/lib/premium";

export function PlanChoice({ onChoose, hasDraft = false }: {
  onChoose: (plan: CreationPlan) => void;
  hasDraft?: boolean;
}) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#f7f2f0] px-4 py-6 text-[#321c23] sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -left-40 top-10 -z-10 size-[420px] rounded-full bg-[#f0dfe4] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-48 bottom-0 -z-10 size-[460px] rounded-full bg-[#e9e2ef] blur-3xl" aria-hidden="true" />
      <header className="mx-auto max-w-5xl"><Brand href="/" /></header>
      <main className="mx-auto max-w-5xl pb-12 pt-12 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e3d2d7] bg-white/70 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#985168]">
            <HeartIcon className="size-3.5 fill-current" aria-hidden="true" />
            Sua história começa aqui
          </span>
          <h1 className="mt-6 font-serif text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-[#481d2b] sm:text-6xl">
            Como você quer criar sua cartinha?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#806871]">
            Escolha o formato agora e escreva com calma. No Premium, o pagamento Pix aparece somente na revisão final, antes da publicação.
          </p>
          {hasDraft ? <p className="mt-3 text-xs font-semibold text-[#8d6171]">Seu conteúdo atual será preservado ao trocar de opção.</p> : null}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-7">
          <article className="flex flex-col rounded-[2rem] border border-[#e2d8da] bg-white/90 p-6 shadow-[0_18px_50px_rgba(66,28,40,0.07)] sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8c737c]">Grátis</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#4d2230]">Uma surpresa completa</h2>
            <p className="mt-3 text-sm leading-6 text-[#856e76]">Tudo o que você precisa para criar, publicar e compartilhar sua cartinha.</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-[#684b55]">
              {["Mensagem personalizada, nomes e data", "Até 2 fotos no carrossel", "Link exclusivo, QR Code da cartinha e compartilhamento"].map((item) => <li key={item} className="flex gap-3"><CheckIcon className="mt-0.5 size-4 shrink-0 text-[#68805e]" aria-hidden="true" />{item}</li>)}
            </ul>
            <button type="button" onClick={() => onChoose("FREE")} className="mt-8 min-h-12 rounded-full border border-[#ccb9bf] bg-white px-5 text-sm font-bold text-[#713b4d] transition hover:bg-[#fbf2f5] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#963b57]">
              Criar cartinha grátis
            </button>
          </article>

          <article className="relative flex flex-col overflow-hidden rounded-[2rem] border border-[#9d536a] bg-[linear-gradient(145deg,#582032,#842f4b)] p-6 text-white shadow-[0_24px_65px_rgba(76,26,43,0.2)] sm:p-8">
            <SparklesIcon className="absolute right-6 top-6 size-6 text-white/25" aria-hidden="true" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f2bdcb]">Premium</p>
            <div className="mt-3 flex items-end gap-2"><h2 className="font-serif text-4xl font-semibold">{PREMIUM_PRICE_LABEL}</h2><span className="pb-1 text-xs text-white/65">por cartinha</span></div>
            <p className="mt-1 text-xs font-semibold text-white/72">Compra única. Sem assinatura.</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-white/86">
              {["Tudo do plano Grátis", "Quiz do casal completo", "Até 6 fotos no carrossel", "Todos os recursos Premium da cartinha"].map((item) => <li key={item} className="flex gap-3"><CheckIcon className="mt-0.5 size-4 shrink-0 text-[#f2c2cf]" aria-hidden="true" />{item}</li>)}
            </ul>
            <button type="button" onClick={() => onChoose("PREMIUM")} className="mt-8 min-h-12 rounded-full bg-white px-5 text-sm font-bold text-[#76243d] shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white">
              Criar cartinha Premium
            </button>
            <p className="mt-3 text-center text-[10px] leading-5 text-white/58">O Pix será gerado somente na etapa final.</p>
          </article>
        </div>
      </main>
    </div>
  );
}
