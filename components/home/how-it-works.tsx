import { SectionHeading } from "@/components/home/section-heading";
import { HeartIcon, LinkIcon, PenIcon } from "@/components/ui/icons";

const steps = [
  {
    number: "01",
    title: "Personalize",
    description: "Escolha cada detalhe e dê à cartinha a personalidade de vocês.",
    icon: PenIcon,
  },
  {
    number: "02",
    title: "Conte sua história",
    description: "Escreva sua mensagem e reúna os momentos que fazem o amor de vocês único.",
    icon: HeartIcon,
  },
  {
    number: "03",
    title: "Compartilhe",
    description: "Envie por link, QR Code ou e-mail e transforme um dia comum em uma lembrança inesquecível.",
    icon: LinkIcon,
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Simples e especial"
          title="Crie sua cartinha online em três passos"
          description="A criação é gratuita: você cuida das palavras e a gente transforma tudo em uma experiência linda para guardar e compartilhar."
        />

        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-20">
          <div
            className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-[linear-gradient(90deg,transparent,#dec6cd_15%,#dec6cd_85%,transparent)] md:block"
            aria-hidden="true"
          />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.number} className="relative flex gap-5 md:block md:text-center">
                <div className="relative z-10 mx-auto grid size-14 shrink-0 place-items-center rounded-full border border-[#eadcdf] bg-[#fffafa] text-[#983d57] shadow-[0_8px_24px_rgba(96,43,58,0.08)] md:mb-7">
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-[#5e2133] text-[8px] font-bold tracking-wide text-white">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-semibold tracking-[-0.025em] text-[#542434]">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#806871]">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
