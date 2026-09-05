import Link from "next/link";
import { ArrowIcon, HeartIcon } from "@/components/ui/icons";

export function AnimalCause() {
  return (
    <section aria-labelledby="animal-cause-title" className="border-y border-[#e5ded5] bg-[#f2f2eb] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/80 text-[#7a8063]" aria-hidden="true">
          <HeartIcon className="size-6" />
        </span>
        <div className="flex-1">
          <h2 id="animal-cause-title" className="font-serif text-3xl font-semibold tracking-tight text-[#4e5546]">Cartinhas que espalham amor ainda mais longe.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#666e5c]">15% dos ganhos do Minha Cartinha são destinados a instituições que ajudam animais de rua.</p>
          <Link href="/transparencia" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#596145] underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#596145]">
            Conheça nossa transparência <ArrowIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
