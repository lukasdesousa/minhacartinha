import { HeartIcon, SparklesIcon } from "@/components/ui/icons";

export function LetterPreview() {
  return (
    <div id="preview" className="relative mx-auto w-full max-w-[590px] scroll-mt-24 lg:mx-0">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-[linear-gradient(145deg,#f5dbe1_0%,#e8e0f1_52%,#f7e8d9_100%)] opacity-75 blur-2xl sm:-inset-10" />
      <div className="soft-pulse absolute -right-1 -top-8 z-20 grid size-14 place-items-center rounded-2xl border border-white/80 bg-white/85 text-[#9c3f59] shadow-[0_12px_35px_rgba(75,27,40,0.12)] backdrop-blur sm:-right-5 sm:size-16">
        <HeartIcon className="size-6 fill-[#f3d9e0]" aria-hidden="true" />
      </div>

      <div className="preview-float relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/75 p-2.5 shadow-[0_28px_80px_rgba(76,32,45,0.16)] backdrop-blur-sm sm:rounded-[2rem] sm:p-3">
        <div className="overflow-hidden rounded-[1.15rem] border border-[#eadfe1] bg-[#f8f1ee] sm:rounded-[1.5rem]">
          <div className="flex h-10 items-center justify-between border-b border-[#eadfe1] bg-white/70 px-3.5 sm:h-12 sm:px-5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2 rounded-full bg-[#d99baa]" />
              <span className="size-2 rounded-full bg-[#e3c49e]" />
              <span className="size-2 rounded-full bg-[#bfc5df]" />
            </div>
            <div className="rounded-full bg-[#f5ebed] px-3 py-1 text-[8px] font-medium tracking-wide text-[#99727d] sm:px-5 sm:text-[9px]">
              minhacartinha.com.br/c/8f3a2c7e...
            </div>
            <SparklesIcon className="size-3.5 text-[#b16a7e]" aria-hidden="true" />
          </div>

          <article className="paper-texture relative min-h-[380px] overflow-hidden bg-[#fffdfb] px-5 py-8 text-center sm:min-h-[460px] sm:px-12 sm:py-11">
            <svg
              className="absolute -left-5 -top-5 size-28 text-[#d7a9b5]/30 sm:size-36"
              viewBox="0 0 140 140"
              fill="none"
              aria-hidden="true"
            >
              <path d="M13 126c12-29 30-49 55-61 19-10 34-29 41-53M47 90c-10-8-22-9-34-3M72 62c-4-13 0-25 11-36M87 45c12-2 21 1 28 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M39 96c-4-14-15-20-27-16 2 12 12 19 27 16ZM77 58c-9-9-9-21-2-30 10 7 11 18 2 30ZM91 44c4-11 13-16 23-13 0 10-8 16-23 13Z" fill="currentColor" />
            </svg>
            <svg
              className="absolute -bottom-8 -right-7 size-32 rotate-180 text-[#c9bfdc]/25 sm:size-40"
              viewBox="0 0 140 140"
              fill="none"
              aria-hidden="true"
            >
              <path d="M13 126c12-29 30-49 55-61 19-10 34-29 41-53M47 90c-10-8-22-9-34-3M72 62c-4-13 0-25 11-36M87 45c12-2 21 1 28 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M39 96c-4-14-15-20-27-16 2 12 12 19 27 16ZM77 58c-9-9-9-21-2-30 10 7 11 18 2 30ZM91 44c4-11 13-16 23-13 0 10-8 16-23 13Z" fill="currentColor" />
            </svg>

            <div className="relative mx-auto flex max-w-sm flex-col items-center">
              <span className="mb-4 grid size-9 place-items-center rounded-full bg-[#f8e8eb] text-[#963c57] sm:mb-6 sm:size-11">
                <HeartIcon className="size-4 fill-[#eabfc9] sm:size-5" aria-hidden="true" />
              </span>
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.26em] text-[#a0707d] sm:text-[10px]">
                Nossa história
              </p>
              <h2 className="font-serif text-[2.25rem] font-semibold leading-none tracking-[-0.04em] text-[#5c2435] sm:text-[3.4rem]">
                Clara <span className="font-normal italic text-[#b0697d]">&amp;</span> Gabriel
              </h2>
              <div className="my-4 h-px w-12 bg-[#ddb9c2] sm:my-6" />
              <p className="font-serif text-lg italic leading-relaxed text-[#704451] sm:text-[1.35rem]">
                “Em todos os meus dias favoritos, existe um pedacinho de você.”
              </p>
              <p className="mt-4 max-w-[280px] text-[10px] leading-relaxed text-[#8a6b74] sm:mt-6 sm:text-xs sm:leading-6">
                Obrigada por fazer do amor um lugar tão bonito para morar. Que a nossa história continue sendo meu capítulo preferido.
              </p>
              <p className="mt-5 font-serif text-base font-semibold italic text-[#713044] sm:mt-7 sm:text-lg">
                Com amor, Clara
              </p>
              <time className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#b18893] sm:text-[9px]">
                12 de junho de 2026
              </time>
            </div>
          </article>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-2 z-20 flex items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-2 text-[10px] font-semibold text-[#734454] shadow-[0_10px_30px_rgba(75,27,40,0.11)] backdrop-blur sm:-left-7 sm:px-4 sm:py-2.5 sm:text-xs">
        <span className="grid size-5 place-items-center rounded-full bg-[#f7e6ea] text-[#9a3b56]">
          <HeartIcon className="size-2.5 fill-[#d994a6]" aria-hidden="true" />
        </span>
        Uma surpresa só de vocês dois
      </div>
    </div>
  );
}
