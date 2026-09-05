import { SectionHeading } from "@/components/home/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { CheckIcon, SparklesIcon } from "@/components/ui/icons";
import { PREMIUM_PRICE_LABEL } from "@/lib/premium";

const freeFeatures = [
  "Mensagem, nomes e data especial",
  "Até 2 fotos no carrossel",
  "Link exclusivo, QR Code e compartilhamento",
];

const premiumFeatures = [
  "Tudo o que a cartinha grátis oferece",
  "Quiz do casal com as perguntas de vocês",
  "Mais de 2 fotos: até 6 no carrossel",
  "Todos os recursos Premium desta cartinha",
  "15% destinados a causa animal (ONGs parceiras)",
];

export function Plans() {
  return (
    <section id="gratis-e-premium" className="bg-[#fcfaf8] px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Do seu jeito"
          title="Uma cartinha, muitas formas de amar."
          description="Comece grátis. Se quiser incluir um quiz ou mais fotos, uma única compra libera o Premium para aquela cartinha."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <article className="flex flex-col rounded-[2rem] border border-[#e9dce0] bg-white p-7 sm:p-9">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#875c6a]">Grátis</h3>
            <p className="mt-4 font-serif text-5xl font-semibold tracking-tight text-[#4f2633]">R$ 0</p>
            <p className="mt-3 text-sm leading-6 text-[#79616a]">O essencial para uma surpresa cheia de carinho.</p>
            <ul className="mb-8 mt-7 space-y-4">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-6 text-[#674b55]">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-[#92705e]" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <ButtonLink href="/criar" variant="secondary" className="mt-auto w-full justify-center">Criar cartinha grátis</ButtonLink>
          </article>
          <article className="relative flex flex-col rounded-[2rem] border border-[#d9b9c4] bg-[linear-gradient(145deg,#fff9f7,#f5e8ed)] p-7 shadow-[0_12px_40px_rgba(91,41,58,0.05)] sm:p-9">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8e3c58]">
              <SparklesIcon className="size-4" aria-hidden="true" /> Premium
            </h3>
            <p className="mt-4 font-serif text-5xl font-semibold tracking-tight text-[#4f2633]">{PREMIUM_PRICE_LABEL}</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#79505f]">Compra única por cartinha. Sem assinatura.</p>
            <ul className="mb-8 mt-7 space-y-4">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-6 text-[#674b55]">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-[#a04e69]" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <ButtonLink href="/criar" className="mt-auto w-full justify-center">Criar minha cartinha</ButtonLink>
            <p className="mt-3 text-center text-xs leading-5 text-[#80646e]">Desbloqueie quando quiser, pelo Pix dentro do site.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
