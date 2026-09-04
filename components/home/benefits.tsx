import { SectionHeading } from "@/components/home/section-heading";
import { CheckIcon, HeartIcon, LinkIcon, MobileIcon, PhotoIcon } from "@/components/ui/icons";

const benefits = [
  {
    title: "Sua mensagem, sua essência",
    description: "Palavras, cores e detalhes que combinam com a história de vocês.",
    icon: HeartIcon,
  },
  {
    title: "Momentos especiais reunidos",
    description: "Transforme memórias queridas em uma experiência cheia de significado.",
    icon: PhotoIcon,
  },
  {
    title: "Um link para emocionar",
    description: "Compartilhe a surpresa de um jeito simples, íntimo e memorável.",
    icon: LinkIcon,
  },
  {
    title: "Perfeita no celular",
    description: "Cada detalhe pensado para ficar lindo na tela que estiver nas mãos de quem você ama.",
    icon: MobileIcon,
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="relative overflow-hidden bg-[#f8f2f0] py-24 sm:py-32">
      <div
        className="pointer-events-none absolute -left-52 top-1/4 size-[420px] rounded-full bg-[#eadfec]/70 blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-20 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-10">
        <div className="relative mx-auto w-full max-w-[480px] lg:mx-0">
          <div
            className="absolute inset-x-8 bottom-1 top-10 rotate-[-5deg] rounded-[2.5rem] bg-[#d9cadf]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-12 bottom-0 top-4 rotate-[5deg] rounded-[2.5rem] bg-[#e7cbd1]"
            aria-hidden="true"
          />

          <div className="relative mx-auto w-[78%] overflow-hidden rounded-[2.7rem] border-[7px] border-[#522232] bg-[#fffaf8] shadow-[0_30px_70px_rgba(66,27,40,0.2)] sm:w-[70%]">
            <div className="relative h-[490px] overflow-hidden bg-[linear-gradient(160deg,#fffaf8_10%,#f3e8eb_100%)] px-6 pb-7 pt-10 sm:h-[540px] sm:px-8">
              <div
                className="absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-full bg-[#522232]"
                aria-hidden="true"
              />
              <div className="text-center">
                <p className="text-[8px] font-bold uppercase tracking-[0.24em] text-[#aa7382]">
                  Para o amor da minha vida
                </p>
                <h3 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#61273a] sm:text-[2.7rem]">
                  Nós dois
                </h3>
                <p className="mt-2 font-serif text-lg italic text-[#9b5a6d]">
                  desde o nosso primeiro sorriso
                </p>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="relative h-36 overflow-hidden rounded-b-2xl rounded-t-[4rem] bg-[linear-gradient(145deg,#cdb6c9,#80586a)]">
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_55%_30%,rgba(255,255,255,0.5),transparent_25%),linear-gradient(to_top,rgba(60,29,42,0.4),transparent_60%)]" />
                  <span className="absolute bottom-3 left-3 text-[8px] font-semibold uppercase tracking-wider text-white/85">
                    Nosso começo
                  </span>
                </div>
                <div className="relative mt-6 h-36 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#ddc3a7,#a26568)]">
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_65%_25%,rgba(255,245,220,0.65),transparent_22%),linear-gradient(to_top,rgba(73,31,39,0.42),transparent_60%)]" />
                  <span className="absolute bottom-3 left-3 text-[8px] font-semibold uppercase tracking-wider text-white/85">
                    Meu lugar favorito
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white/70 p-4 text-center shadow-[0_10px_30px_rgba(71,34,46,0.06)]">
                <HeartIcon className="mx-auto size-4 fill-[#edcbd3] text-[#a54c66]" aria-hidden="true" />
                <p className="mt-2 font-serif text-lg italic leading-snug text-[#6f3b4a]">
                  “Eu escolheria você em todas as vidas.”
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-1 top-20 flex items-center gap-2 rounded-2xl border border-white bg-white/90 px-3.5 py-3 text-xs font-semibold text-[#67404c] shadow-[0_14px_35px_rgba(71,34,46,0.12)] backdrop-blur sm:right-2">
            <span className="grid size-7 place-items-center rounded-full bg-[#ebf0e8] text-[#59714f]">
              <CheckIcon className="size-3.5" aria-hidden="true" />
            </span>
            Pronta para compartilhar
          </div>
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="Cada detalhe importa"
            title="Muito mais que uma mensagem"
            description="Uma pequena experiência criada para tocar o coração, surpreender e ficar na memória."
          />

          <ul className="mt-10 divide-y divide-[#dfd1d4]">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <li key={benefit.title} className="group flex gap-4 py-5 first:pt-0 sm:gap-5 sm:py-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-[#93425a] shadow-[0_7px_20px_rgba(72,31,44,0.07)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#522434] sm:text-2xl">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#7c646d]">{benefit.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
