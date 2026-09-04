import { HeartIcon, QuoteIcon, SparklesIcon } from "@/components/ui/icons";

export function EmotionalSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#4c1929] py-24 text-white sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_30%,rgba(183,93,119,0.34),transparent_27%),radial-gradient(circle_at_85%_70%,rgba(116,93,153,0.27),transparent_26%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-5 -z-10 rounded-[2rem] border border-white/[0.06] sm:inset-8"
        aria-hidden="true"
      />
      <SparklesIcon
        className="absolute left-[8%] top-[18%] size-7 text-[#dca6b5]/50 sm:size-10"
        aria-hidden="true"
      />
      <HeartIcon
        className="absolute bottom-[16%] right-[9%] size-8 rotate-12 text-[#dca6b5]/30 sm:size-12"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-5xl px-6 text-center sm:px-10">
        <QuoteIcon className="mx-auto size-10 text-[#c97991]/45 sm:size-12" aria-hidden="true" />
        <blockquote className="mt-6 font-serif text-[3rem] font-medium leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
          Algumas palavras merecem ser{" "}
          <em className="font-normal text-[#f0c6d1]">guardadas para sempre.</em>
        </blockquote>
        <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
          Não espere uma data perfeita. Às vezes, o gesto mais bonito é dizer o que sente simplesmente porque sente.
        </p>
      </div>
    </section>
  );
}
