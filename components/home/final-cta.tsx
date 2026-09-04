import { ButtonLink } from "@/components/ui/button-link";
import { HeartIcon, SparklesIcon } from "@/components/ui/icons";

export function FinalCta() {
  return (
    <section id="criar" className="relative overflow-hidden bg-[#fffaf8] py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#f0dce2_0%,rgba(240,220,226,0)_68%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f4e1e6] text-[#913a54] shadow-[0_10px_28px_rgba(86,35,50,0.08)]">
          <HeartIcon className="size-6 fill-[#e9bdc8]" aria-hidden="true" />
        </span>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-[#9b4a61]">
          Uma surpresa começa aqui
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl font-serif text-[3rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[#481e2a] sm:text-6xl lg:text-7xl">
          Faça alguém se sentir ainda mais amado hoje.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#79616a]">
          Transforme tudo o que você sente em um presente único, delicado e impossível de esquecer.
        </p>
        <ButtonLink href="/criar" className="mt-9 min-h-14 px-8 text-base">
          Criar minha cartinha
        </ButtonLink>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#a0828a]">
          <SparklesIcon className="size-3.5" aria-hidden="true" />
          Leva só alguns minutos para começar
        </p>
      </div>
    </section>
  );
}
