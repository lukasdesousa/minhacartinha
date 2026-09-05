import { LetterPreview } from "@/components/home/letter-preview";
import { ButtonLink } from "@/components/ui/button-link";
import { HeartIcon, SparklesIcon } from "@/components/ui/icons";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pb-24 pt-32 sm:pb-32 sm:pt-40 lg:min-h-[850px] lg:pb-36 lg:pt-44"
    >
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-36 top-40 size-80 rounded-full bg-[#f4dce3]/60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-24 size-96 rounded-full bg-[#e6e0f2]/70 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-20 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-10 xl:gap-20">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-[#e6d2d7] bg-white/65 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8f5263] backdrop-blur sm:text-xs">
            <SparklesIcon className="size-3.5" aria-hidden="true" />
            Sua cartinha de amor online, grátis
          </div>

          <h1 className="reveal reveal-delay-1 mt-7 font-serif text-[3.35rem] font-semibold leading-[0.94] tracking-[-0.052em] text-[#451c28] sm:text-[4.6rem] lg:text-[5.1rem]">
            Transforme seus sentimentos em uma cartinha de amor{" "}
            <span className="font-normal italic text-[#9c405a]">inesquecível.</span>
          </h1>

          <p className="reveal reveal-delay-2 mx-auto mt-7 max-w-xl text-base leading-7 text-[#745b63] sm:text-lg sm:leading-8 lg:mx-0">
            Crie grátis uma página personalizada com sua mensagem, até 2 fotos, música e a história de vocês. Depois, compartilhe a surpresa por link ou QR Code.
          </p>

          <div className="reveal reveal-delay-3 mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
            <ButtonLink href="/criar" className="min-h-14 px-7 text-base">
              Criar minha cartinha grátis
            </ButtonLink>
            <ButtonLink href="#preview" variant="secondary" className="min-h-14 px-7 text-base">
              Ver uma cartinha
            </ButtonLink>
          </div>

          <div className="reveal reveal-delay-3 mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-[#8a7178] lg:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <HeartIcon className="size-3.5 fill-[#efd0d8] text-[#ad5c72]" aria-hidden="true" />
              Criação gratuita
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-[#c69aa6]" aria-hidden="true" />
              Linda em qualquer tela
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-[#c69aa6]" aria-hidden="true" />
              Fácil de compartilhar
            </span>
          </div>
        </div>

        <div className="reveal reveal-delay-2 lg:pl-5">
          <LetterPreview />
        </div>
      </div>
    </section>
  );
}
