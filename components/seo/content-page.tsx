import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";
import {
  CalendarIcon,
  CheckIcon,
  HeartIcon,
  LinkIcon,
  MusicIcon,
  PhotoIcon,
  SparklesIcon,
} from "@/components/ui/icons";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedLink = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
};

export function SeoHeader() {
  return (
    <header className="border-b border-[#eadfe1] bg-[#fcfaf8]/95">
      <a
        href="#conteudo"
        className="sr-only left-5 top-4 z-[60] rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6e2b40] shadow-lg focus:not-sr-only focus:absolute"
      >
        Pular para o conteúdo
      </a>
      <nav
        className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10"
        aria-label="Navegação principal"
      >
        <Brand href="/" />
        <div className="flex items-center gap-5">
          <Link
            href="/guias"
            className="hidden rounded text-sm font-semibold text-[#745761] underline-offset-4 hover:text-[#8e2f4b] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d415b] sm:inline"
          >
            Guias
          </Link>
          <ButtonLink href="/criar" className="min-h-11 px-4 sm:px-5">
            <span className="sm:hidden">Criar</span>
            <span className="hidden sm:inline">Criar cartinha grátis</span>
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Navegação estrutural" className="text-xs font-semibold text-[#8a7079]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link
                href={item.href}
                className="rounded underline-offset-4 hover:text-[#8e2f4b] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9d415b]"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-[#6a4b55]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

type PageHeroProps = {
  breadcrumbs: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  children?: ReactNode;
  primaryCta?: string;
};

export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  description,
  meta,
  children,
  primaryCta,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#eadfe1] bg-[#fcfaf8] py-12 sm:py-16 lg:py-20">
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-28 top-16 size-72 rounded-full bg-[#f4dce3]/65 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-[#e6e0f2]/70 blur-3xl" aria-hidden="true" />
      <div className={`relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:px-10 ${children ? "lg:grid-cols-[1fr_0.78fr] lg:gap-16" : ""}`}>
        <div className={children ? "" : "max-w-4xl"}>
          <Breadcrumbs items={breadcrumbs} />
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#e6d2d7] bg-white/70 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8f5263] sm:text-xs">
            <SparklesIcon className="size-3.5" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[#451c28] sm:text-6xl lg:text-[4.4rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#745b63] sm:text-lg sm:leading-8">
            {description}
          </p>
          {meta ? <p className="mt-5 text-xs font-semibold text-[#927780]">{meta}</p> : null}
          {primaryCta ? (
            <div className="mt-8">
              <ButtonLink href="/criar" className="min-h-14 px-7 text-base">
                {primaryCta}
              </ButtonLink>
            </div>
          ) : null}
        </div>
        {children ? <div>{children}</div> : null}
      </div>
    </section>
  );
}

export function ContentSection({
  id,
  eyebrow,
  title,
  intro,
  children,
  tinted = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  tinted?: boolean;
}) {
  return (
    <section id={id} className={`px-5 py-16 sm:px-8 sm:py-20 ${tinted ? "bg-[#f8f2f0]" : "bg-[#fcfaf8]"}`}>
      <div className="mx-auto max-w-5xl">
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#98526a]">{eyebrow}</p> : null}
        <h2 className="mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#4d2130] sm:text-5xl">
          {title}
        </h2>
        {intro ? <p className="mt-5 max-w-3xl text-base leading-8 text-[#755d66]">{intro}</p> : null}
        <div className="mt-9">{children}</div>
      </div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-3xl space-y-5 text-[0.98rem] leading-8 text-[#654c55] sm:text-base">{children}</div>;
}

export function InfoGrid({ children, columns = 3 }: { children: ReactNode; columns?: 2 | 3 }) {
  return <div className={`grid gap-4 ${columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>{children}</div>;
}

export function InfoCard({
  number,
  title,
  children,
  icon,
}: {
  number?: string;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <article className="rounded-[1.6rem] border border-[#e8dadd] bg-white p-6 shadow-[0_12px_38px_rgba(77,33,48,0.045)] sm:p-7">
      {number || icon ? (
        <span className="grid size-10 place-items-center rounded-full bg-[#f6e7eb] text-sm font-bold text-[#93425a]">
          {icon ?? number}
        </span>
      ) : null}
      <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight text-[#542536]">{title}</h3>
      <div className="mt-3 text-sm leading-7 text-[#745c65]">{children}</div>
    </article>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-2xl border border-[#eadde0] bg-white px-4 py-4 text-sm leading-6 text-[#664b55]">
          <CheckIcon className="mt-1 size-4 shrink-0 text-[#9a4660]" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ExampleBlock({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="paper-texture rounded-[1.8rem] border border-[#e5d6da] bg-[#fffdfb] p-6 shadow-[0_16px_45px_rgba(75,28,43,0.06)] sm:p-9">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b5a6d]">{label}</p>
      <h3 className="mt-3 font-serif text-2xl font-semibold text-[#542536] sm:text-3xl">{title}</h3>
      <div className="mt-5 border-l-2 border-[#d9a9b7] pl-5 font-serif text-xl italic leading-9 text-[#68404d]">
        {children}
      </div>
    </article>
  );
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="rounded-[1.6rem] border border-[#ddcbd1] bg-[linear-gradient(145deg,#fff9f7,#f4e9ef)] p-6 sm:p-8">
      <p className="flex items-center gap-2 font-serif text-2xl font-semibold text-[#572536]">
        <HeartIcon className="size-5 fill-[#eccbd4] text-[#a34e67]" aria-hidden="true" />
        {title}
      </p>
      <div className="mt-3 text-sm leading-7 text-[#704f5b]">{children}</div>
    </aside>
  );
}

export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <ContentSection eyebrow="Perguntas frequentes" title="Dúvidas que costumam aparecer" tinted>
      <div className="divide-y divide-[#e6d7db] rounded-[1.8rem] border border-[#e6d7db] bg-white px-5 sm:px-8">
        {items.map((item, index) => (
          <details key={item.question} className="group py-5 sm:py-6" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-serif text-xl font-semibold text-[#542536] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d415b] sm:text-2xl">
              {item.question}
              <span className="mt-1 text-[#a05269] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="max-w-3xl pb-1 pt-4 text-sm leading-7 text-[#705862] sm:text-base sm:leading-8">{item.answer}</p>
          </details>
        ))}
      </div>
    </ContentSection>
  );
}

export function RelatedGuides({ links }: { links: RelatedLink[] }) {
  return (
    <section className="bg-[#fcfaf8] px-5 py-16 sm:px-8 sm:py-20" aria-labelledby="continue-title">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#98526a]">Continue planejando</p>
        <h2 id="continue-title" className="mt-3 font-serif text-3xl font-semibold tracking-[-0.035em] text-[#4d2130] sm:text-4xl">Leituras que combinam com esta ideia</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-[1.5rem] border border-[#e7d9dd] bg-white p-6 transition hover:-translate-y-1 hover:border-[#cfa8b4] hover:shadow-[0_15px_40px_rgba(72,29,43,0.07)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d415b]"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a05a6f]">{link.eyebrow}</span>
              <span className="mt-3 block font-serif text-2xl font-semibold leading-tight text-[#542536]">{link.title}</span>
              <span className="mt-3 block text-sm leading-6 text-[#765e67]">{link.description}</span>
              <span className="mt-5 inline-block text-sm font-bold text-[#8e2f4b] group-hover:underline">Ler guia →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalSeoCta({ title, description }: { title: string; description: string }) {
  return (
    <section className="bg-[#5d2235] px-5 py-16 text-center text-white sm:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <HeartIcon className="mx-auto size-7 fill-[#dca9b8] text-[#f1d5dd]" aria-hidden="true" />
        <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#ead7dd] sm:text-base">{description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/criar" variant="light" className="min-h-14 px-7 text-base">Criar minha cartinha</ButtonLink>
          <ButtonLink href="/exemplo" variant="secondary" className="min-h-14 border-white/25 bg-white/10 px-7 text-base text-white hover:bg-white/15">Ver uma cartinha pronta</ButtonLink>
        </div>
      </div>
    </section>
  );
}

function QrVisual() {
  return (
    <svg viewBox="0 0 72 72" className="size-20 text-[#542536]" role="img" aria-label="Ilustração de um QR Code">
      <rect width="72" height="72" rx="8" fill="white" />
      <g fill="currentColor">
        <path d="M8 8h20v20H8V8Zm5 5v10h10V13H13ZM44 8h20v20H44V8Zm5 5v10h10V13H49ZM8 44h20v20H8V44Zm5 5v10h10V49H13Z" />
        <path d="M34 8h5v8h-5zM31 20h8v5h-8zM34 31h7v7h-7zM45 34h7v7h-7zM56 32h8v6h-8zM31 43h6v9h-6zM40 47h7v6h-7zM51 44h5v10h-5zM59 43h5v6h-5zM34 58h8v6h-8zM47 57h6v7h-6zM58 55h6v9h-6z" />
      </g>
    </svg>
  );
}

export function DigitalGiftMockup() {
  return (
    <div className="relative mx-auto max-w-[430px]" aria-label="Prévia ilustrativa de uma cartinha digital com foto, música e QR Code">
      <div className="absolute -inset-5 rounded-[3rem] bg-[linear-gradient(145deg,#efd4dc,#ded9ed,#f5e1d4)] opacity-75 blur-2xl" aria-hidden="true" />
      <div className="relative rotate-[1.5deg] rounded-[2.4rem] border-[7px] border-[#512232] bg-white p-2 shadow-[0_30px_75px_rgba(67,27,40,0.22)]">
        <div className="overflow-hidden rounded-[1.75rem] bg-[#fffaf8]">
          <div className="relative h-44">
            <Image
              src="/demo/clara-e-gabriel/capa.webp"
              alt="Casal caminhando à beira-mar, exemplo de foto em uma cartinha digital"
              fill
              sizes="(max-width: 640px) 82vw, 380px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3d1825]/70 via-transparent to-transparent" />
            <p className="absolute inset-x-5 bottom-4 text-center font-serif text-3xl font-semibold text-white">Clara &amp; Gabriel</p>
          </div>
          <div className="paper-texture px-5 py-6 text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a06475]">Nossa história</p>
            <p className="mt-3 font-serif text-lg italic leading-7 text-[#643747]">“Com você, até os dias comuns viraram memória boa.”</p>
            <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#f4e8eb] px-4 py-2 text-[10px] font-bold text-[#704252]">
              <MusicIcon className="size-3.5" aria-hidden="true" /> Nossa música
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-8 -left-2 rounded-2xl border border-white bg-white/95 p-2 shadow-[0_14px_35px_rgba(71,34,46,0.15)] sm:-left-10">
        <QrVisual />
      </div>
      <div className="absolute -right-2 top-16 space-y-2 sm:-right-8">
        {[{ label: "Fotos", Icon: PhotoIcon }, { label: "Música", Icon: MusicIcon }, { label: "Link", Icon: LinkIcon }, { label: "Data", Icon: CalendarIcon }].map(({ label, Icon }) => (
          <span key={label} className="flex items-center gap-2 rounded-full border border-white bg-white/95 px-3 py-2 text-[10px] font-bold text-[#704252] shadow-[0_10px_25px_rgba(71,34,46,0.11)]">
            <Icon className="size-3.5 text-[#9a4660]" aria-hidden="true" /> {label}
          </span>
        ))}
      </div>
    </div>
  );
}
