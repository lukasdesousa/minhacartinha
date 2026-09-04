"use client";

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";
import { getTheme } from "@/components/create/types";
import { RelationshipCounter } from "@/components/letter/relationship-counter";
import { SpotifyEmbed } from "@/components/letter/spotify-embed";
import type { PublicLetterData } from "@/lib/letters/contracts";
import { Brand } from "@/components/ui/brand";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  MapPinIcon,
  MusicIcon,
  SparklesIcon,
} from "@/components/ui/icons";

type PublishedLetterProps = {
  letter: PublicLetterData;
};

export function PublishedLetter({ letter }: PublishedLetterProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const theme = getTheme(letter.themeId);
  const safeSlideIndex = Math.min(activeSlide, Math.max(letter.gallery.length - 1, 0));
  const activePhoto = letter.gallery[safeSlideIndex];
  const themeStyle = {
    "--letter-accent": theme.colors.accent,
    "--letter-dark": theme.colors.dark,
    "--letter-paper": theme.colors.paper,
    "--letter-wash": theme.colors.wash,
    "--letter-muted": theme.colors.muted,
  } as CSSProperties;

  function moveSlide(direction: number) {
    if (!letter.gallery.length) return;
    setActiveSlide(
      (current) =>
        (Math.min(current, letter.gallery.length - 1) + direction + letter.gallery.length) %
        letter.gallery.length,
    );
  }

  return (
    <main className="min-h-screen bg-[var(--letter-paper)] text-[#4d2935]" style={themeStyle}>
      <section
        className="relative isolate flex min-h-[82svh] flex-col overflow-hidden text-white"
        style={{
          backgroundImage: letter.heroImage
            ? `linear-gradient(to top, rgba(39, 12, 22, 0.88), rgba(39, 12, 22, 0.08) 70%), url(${JSON.stringify(letter.heroImage)})`
            : "radial-gradient(circle at 70% 25%, color-mix(in srgb, var(--letter-wash) 85%, white), transparent 24%), linear-gradient(145deg, var(--letter-muted), var(--letter-dark))",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <span className="absolute -left-24 top-24 size-80 rounded-full border border-white/10" />
          <span className="absolute -right-24 top-1/3 size-72 rounded-full border border-white/10" />
          {!letter.heroImage ? (
            <HeartIcon className="absolute left-1/2 top-[35%] size-24 -translate-x-1/2 text-white/12" />
          ) : null}
        </div>

        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
          <Brand inverted href="/" />
          <Link
            href="/criar"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 sm:text-sm"
          >
            Criar a minha
          </Link>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pb-20 pt-12 text-center sm:px-8 sm:pb-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.22em] backdrop-blur sm:text-[10px]">
            <SparklesIcon className="size-3.5" aria-hidden="true" />
            {letter.openingText}
          </span>
          <h1 className="mt-7 font-serif text-[4rem] font-semibold leading-[0.88] tracking-[-0.055em] drop-shadow-sm sm:text-7xl lg:text-8xl">
            {letter.senderName}{" "}
            <span className="font-normal italic text-white/75">&amp;</span>{" "}
            {letter.recipientName}
          </h1>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
            Uma história escrita com amor
          </p>
          <div className="absolute bottom-6 flex flex-col items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
            <span>Continue para sentir</span>
            <span className="h-8 w-px bg-white/30" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="paper-texture px-5 py-24 text-center sm:px-8 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <HeartIcon className="mx-auto size-6 fill-[var(--letter-wash)] text-[var(--letter-accent)]" aria-hidden="true" />
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--letter-muted)]">
            Uma carta para {letter.recipientName}
          </p>
          <h2 className="mt-4 font-serif text-[3.2rem] font-semibold leading-[0.95] tracking-[-0.045em] text-[var(--letter-dark)] sm:text-6xl lg:text-7xl">
            {letter.title}
          </h2>
          <div className="mx-auto my-9 h-px w-16 bg-[var(--letter-wash)]" />
          <p className="whitespace-pre-line font-serif text-xl leading-9 text-[#684650] sm:text-2xl sm:leading-10">
            {letter.message}
          </p>
          <p className="mt-10 font-serif text-2xl font-semibold italic text-[var(--letter-accent)] sm:text-3xl">
            {letter.signature}
          </p>
        </div>
      </section>

      {letter.showRelationshipTime && letter.relationshipStartedAt ? (
        <section className="relative isolate overflow-hidden bg-[var(--letter-wash)] px-5 py-20 sm:px-8 sm:py-28">
          <div
            className="pointer-events-none absolute -left-40 -top-44 -z-10 size-[28rem] rounded-full bg-white/35 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-48 -right-36 -z-10 size-[30rem] rounded-full bg-[var(--letter-accent)]/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-white/60 text-[var(--letter-accent)] shadow-[0_12px_30px_rgba(62,25,37,0.08)]">
                <HeartIcon className="size-5 fill-current" aria-hidden="true" />
              </span>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--letter-muted)]">
                Cada minuto ao seu lado
              </p>
              <h2 className="mt-3 font-serif text-5xl font-semibold leading-none tracking-[-0.04em] text-[var(--letter-dark)] sm:text-6xl">
                Nosso amor acontece há
              </h2>
            </div>
            <div className="mt-10 sm:mt-12">
              <RelationshipCounter startedAt={letter.relationshipStartedAt} />
            </div>
          </div>
        </section>
      ) : null}

      {activePhoto ? (
        <section className="overflow-hidden bg-[var(--letter-wash)] px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--letter-muted)]">Nossos momentos</p>
              <h2 className="mt-4 font-serif text-5xl font-semibold leading-none tracking-[-0.04em] text-[var(--letter-dark)] sm:text-6xl">
                Memórias que moram em nós
              </h2>
            </div>

            <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-[2rem] bg-[var(--letter-dark)] shadow-[0_30px_70px_rgba(50,18,29,0.2)] sm:rounded-[2.7rem]">
              <div
                className="aspect-[4/3] bg-cover bg-center sm:aspect-[16/10]"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(40, 13, 23, 0.68), transparent 55%), url(${JSON.stringify(activePhoto.src)})`,
                }}
                role="img"
                aria-label={`Foto: ${activePhoto.caption}`}
              />
              <p className="absolute bottom-7 left-7 right-24 font-serif text-2xl font-semibold italic text-white sm:bottom-10 sm:left-10 sm:text-4xl">
                {activePhoto.caption}
              </p>
              {letter.gallery.length > 1 ? (
                <div className="absolute bottom-6 right-6 flex gap-2 sm:bottom-9 sm:right-9">
                  <button
                    type="button"
                    onClick={() => moveSlide(-1)}
                    className="grid size-11 place-items-center rounded-full bg-white/90 text-[var(--letter-dark)] backdrop-blur transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeftIcon className="size-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(1)}
                    className="grid size-11 place-items-center rounded-full bg-white/90 text-[var(--letter-dark)] backdrop-blur transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label="Próxima foto"
                  >
                    <ChevronRightIcon className="size-5" aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>

            {letter.gallery.length > 1 ? (
              <div className="mt-6 flex justify-center gap-2" aria-label={`Foto ${safeSlideIndex + 1} de ${letter.gallery.length}`}>
                {letter.gallery.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--letter-accent)] ${
                      index === safeSlideIndex ? "w-8 bg-[var(--letter-accent)]" : "w-2 bg-[var(--letter-muted)]/35"
                    }`}
                    aria-label={`Ir para foto ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {letter.favoritePlace.name || letter.favoritePlace.image ? (
        <section className="px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <span className="grid size-12 place-items-center rounded-full bg-[var(--letter-wash)] text-[var(--letter-accent)]">
                <MapPinIcon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--letter-muted)]">Um pedaço do nosso mundo</p>
              <h2 className="mt-4 font-serif text-5xl font-semibold leading-none tracking-[-0.04em] text-[var(--letter-dark)] sm:text-6xl">
                {letter.favoritePlace.name || "Nosso lugar favorito"}
              </h2>
              <p className="mt-6 max-w-lg font-serif text-xl italic leading-8 text-[#74515c] sm:text-2xl">
                “{letter.favoritePlace.caption || "Um lugar que se tornou especial porque estávamos juntos."}”
              </p>
            </div>
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_25px_65px_rgba(52,20,31,0.16)] sm:rounded-[2.7rem]"
              style={{
                background: letter.favoritePlace.image
                  ? `linear-gradient(to top, rgba(43, 14, 24, 0.35), transparent 60%), url(${JSON.stringify(letter.favoritePlace.image)}) center / cover`
                  : "radial-gradient(circle at 68% 25%, rgba(255,255,255,0.4), transparent 25%), linear-gradient(145deg, var(--letter-muted), var(--letter-dark))",
              }}
              role={letter.favoritePlace.image ? "img" : undefined}
              aria-label={letter.favoritePlace.image ? "Imagem do lugar favorito do casal" : undefined}
            >
              <HeartIcon className="absolute bottom-6 right-6 size-9 text-white/55" aria-hidden="true" />
            </div>
          </div>
        </section>
      ) : null}

      {letter.showMusic && (letter.song.spotifyUrl || letter.song.title) ? (
        <section className="bg-[#f8f3f1] px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-full bg-[#191414] text-[#1ed760] shadow-lg">
                <MusicIcon className="size-4.5" aria-hidden="true" />
              </span>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--letter-muted)]">
                A trilha da nossa história
              </p>
              <h2 className="mt-2 font-serif text-4xl font-semibold text-[var(--letter-dark)] sm:text-5xl">
                Aperte o play e lembre da gente
              </h2>
            </div>

            {letter.song.spotifyUrl ? (
              <div className="overflow-hidden rounded-[1.4rem] bg-[#191414] p-2.5 shadow-[0_20px_50px_rgba(31,20,24,0.16)]">
                <SpotifyEmbed url={letter.song.spotifyUrl} />
              </div>
            ) : (
              <div className="flex items-center gap-4 rounded-3xl border border-[#e6dadd] bg-white p-5 shadow-[0_12px_35px_rgba(57,24,35,0.06)] sm:p-6">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[var(--letter-accent)] text-white shadow-lg">
                  <MusicIcon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-serif text-2xl font-semibold text-[var(--letter-dark)]">
                    {letter.song.title}
                  </p>
                  {letter.song.artist ? (
                    <p className="mt-1 truncate text-xs text-[#876d75]">{letter.song.artist}</p>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="relative isolate overflow-hidden bg-[var(--letter-dark)] px-5 py-24 text-center text-white sm:px-8 sm:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_82%_75%,rgba(255,255,255,0.06),transparent_24%)]" aria-hidden="true" />
        <SparklesIcon className="mx-auto size-6 text-white/40" aria-hidden="true" />
        <blockquote className="mx-auto mt-7 max-w-4xl font-serif text-[3.2rem] font-medium italic leading-[0.98] tracking-[-0.04em] text-white/95 sm:text-6xl lg:text-7xl">
          “{letter.closingText}”
        </blockquote>
        <p className="mt-9 text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
          Para {letter.recipientName}, com amor de {letter.senderName}
        </p>
      </section>

      <footer className="flex flex-col items-center justify-between gap-5 border-t border-[#e9dde0] bg-white px-5 py-8 text-center sm:flex-row sm:px-8 lg:px-10">
        <Brand href="/" />
        <p className="text-xs text-[#907981]">Uma história criada com carinho em Minha Cartinha.</p>
      </footer>
    </main>
  );
}
