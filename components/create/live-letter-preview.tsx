"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { LetterDraft } from "@/components/create/types";
import { getTheme } from "@/components/create/types";
import { RelationshipCounter } from "@/components/letter/relationship-counter";
import { SpotifyEmbed } from "@/components/letter/spotify-embed";
import { CoupleQuiz } from "@/components/letter/couple-quiz";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  MapPinIcon,
  MusicIcon,
  SparklesIcon,
} from "@/components/ui/icons";
import { getSpotifyEmbedUrl } from "@/lib/spotify";

const placeholderSlides = [
  {
    id: "first-memory",
    caption: "Nosso começo",
    background: "linear-gradient(145deg, #d5becf 0%, #7f5b70 100%)",
  },
  {
    id: "favorite-day",
    caption: "Um dia inesquecível",
    background: "linear-gradient(145deg, #e2c4a5 0%, #a66b6d 100%)",
  },
  {
    id: "only-us",
    caption: "Só nós dois",
    background: "linear-gradient(145deg, #c9c6d9 0%, #746c8c 100%)",
  },
];

type LiveLetterPreviewProps = {
  draft: LetterDraft;
  mode?: "embedded" | "modal";
};

export function LiveLetterPreview({ draft, mode = "embedded" }: LiveLetterPreviewProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const theme = getTheme(draft.themeId);
  const slides = draft.gallery.length
    ? draft.gallery.map((photo) => ({
        id: photo.id,
        caption: photo.caption,
        background: `linear-gradient(to top, rgba(40, 15, 24, 0.5), transparent 58%), url(${JSON.stringify(photo.src)}) center / cover`,
      }))
    : placeholderSlides;
  const safeSlideIndex = Math.min(activeSlide, slides.length - 1);
  const currentSlide = slides[safeSlideIndex];
  const recipient = draft.recipientName.trim() || "Meu amor";
  const sender = draft.senderName.trim() || "Alguém que te ama";
  const spotifyEmbedUrl = getSpotifyEmbedUrl(draft.song.spotifyUrl);
  const themeStyle = {
    "--letter-accent": theme.colors.accent,
    "--letter-dark": theme.colors.dark,
    "--letter-paper": theme.colors.paper,
    "--letter-wash": theme.colors.wash,
    "--letter-muted": theme.colors.muted,
  } as CSSProperties;

  function moveSlide(direction: number) {
    setActiveSlide((current) => (Math.min(current, slides.length - 1) + direction + slides.length) % slides.length);
  }

  return (
    <div
      className={`relative mx-auto w-full overflow-hidden rounded-[2.6rem] border-[7px] border-[#3f1825] bg-[var(--letter-paper)] shadow-[0_30px_75px_rgba(55,19,31,0.24)] ${
        mode === "modal" ? "max-w-[430px]" : "max-w-[410px]"
      }`}
      style={themeStyle}
    >
      <div className="pointer-events-none absolute left-1/2 top-2.5 z-20 h-4 w-20 -translate-x-1/2 rounded-full bg-[#3f1825]" aria-hidden="true" />
      <article
        className={`preview-scrollbar overflow-y-auto overscroll-contain bg-[var(--letter-paper)] ${
          mode === "modal" ? "max-h-[82vh]" : "h-[680px] max-h-[calc(100vh-205px)] min-h-[560px]"
        }`}
        aria-label={`Prévia da cartinha para ${recipient}`}
      >
        <section
          className="relative flex min-h-[360px] flex-col justify-end overflow-hidden px-7 pb-9 pt-14 text-center text-white"
          style={{
            backgroundImage: draft.heroImage
              ? `linear-gradient(to top, rgba(45, 13, 25, 0.82), rgba(45, 13, 25, 0.04) 68%), url(${JSON.stringify(draft.heroImage)})`
              : `radial-gradient(circle at 70% 18%, color-mix(in srgb, var(--letter-wash) 88%, white), transparent 26%), linear-gradient(145deg, var(--letter-muted), var(--letter-dark))`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          {!draft.heroImage ? (
            <div className="absolute inset-0" aria-hidden="true">
              <span className="absolute -left-12 top-12 size-44 rounded-full border border-white/15" />
              <span className="absolute -right-8 top-24 size-36 rounded-full border border-white/10" />
              <HeartIcon className="absolute left-1/2 top-[34%] size-14 -translate-x-1/2 text-white/18" />
            </div>
          ) : null}
          <div className="relative">
            <span className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] backdrop-blur">
              <SparklesIcon className="size-3" aria-hidden="true" />
              {draft.openingText || "A nossa história favorita"}
            </span>
            <h2 className="mt-4 font-serif text-[2.8rem] font-semibold leading-none tracking-[-0.045em] drop-shadow-sm">
              {sender} <span className="font-normal italic text-white/80">&amp;</span> {recipient}
            </h2>
          </div>
        </section>

        <section className="paper-texture px-7 py-12 text-center">
          <HeartIcon className="mx-auto size-5 fill-[var(--letter-wash)] text-[var(--letter-accent)]" aria-hidden="true" />
          <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.22em] text-[var(--letter-muted)]">Uma carta para você</p>
          <h3 className="mt-3 font-serif text-[2.15rem] font-semibold leading-none tracking-[-0.035em] text-[var(--letter-dark)]">
            {draft.title || "Para o amor da minha vida"}
          </h3>
          <div className="mx-auto my-6 h-px w-12 bg-[var(--letter-wash)]" />
          <p className="whitespace-pre-line font-serif text-lg leading-7 text-[#68434f]">
            {draft.message || "As palavras mais bonitas da nossa história vão aparecer aqui."}
          </p>
          <p className="mt-7 font-serif text-xl font-semibold italic text-[var(--letter-accent)]">
            {draft.signature || "Com amor, sempre"}
          </p>
        </section>

        <section className="bg-[var(--letter-wash)] px-6 py-10">
          <div className="text-center">
            <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-[var(--letter-muted)]">Nossos momentos</p>
            <h3 className="mt-2 font-serif text-3xl font-semibold text-[var(--letter-dark)]">Memórias que moram em nós</h3>
          </div>
          <div className="relative mt-6 overflow-hidden rounded-[1.6rem] bg-[var(--letter-dark)] shadow-[0_15px_32px_rgba(55,23,34,0.16)]">
            <div
              className="aspect-[4/3] bg-cover bg-center transition-[background] duration-500"
              style={{ background: currentSlide.background }}
              role="img"
              aria-label={draft.gallery.length ? `Foto: ${currentSlide.caption}` : `Espaço reservado para ${currentSlide.caption.toLowerCase()}`}
            >
              {!draft.gallery.length ? (
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_68%_25%,rgba(255,255,255,0.38),transparent_25%)]" aria-hidden="true" />
              ) : null}
            </div>
            <p className="absolute bottom-4 left-5 right-16 font-serif text-lg font-semibold italic text-white drop-shadow">
              {currentSlide.caption || `Momento ${safeSlideIndex + 1}`}
            </p>
            <div className="absolute bottom-3.5 right-3.5 flex gap-1.5">
              <button
                type="button"
                onClick={() => moveSlide(-1)}
                className="grid size-8 place-items-center rounded-full bg-white/88 text-[var(--letter-dark)] backdrop-blur transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Foto anterior"
              >
                <ChevronLeftIcon className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => moveSlide(1)}
                className="grid size-8 place-items-center rounded-full bg-white/88 text-[var(--letter-dark)] backdrop-blur transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Próxima foto"
              >
                <ChevronRightIcon className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-1.5" aria-label={`Foto ${safeSlideIndex + 1} de ${slides.length}`}>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-1.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--letter-accent)] ${
                  index === safeSlideIndex ? "w-6 bg-[var(--letter-accent)]" : "w-1.5 bg-[var(--letter-muted)]/35"
                }`}
                aria-label={`Ir para foto ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="px-6 py-11">
          <div
            className="relative flex min-h-64 flex-col justify-end overflow-hidden rounded-[1.8rem] p-6 text-white shadow-[0_15px_35px_rgba(55,23,34,0.12)]"
            style={{
              background: draft.favoritePlace.image
                ? `linear-gradient(to top, rgba(43, 14, 24, 0.8), rgba(43, 14, 24, 0.06) 68%), url(${JSON.stringify(draft.favoritePlace.image)}) center / cover`
                : `radial-gradient(circle at 70% 25%, rgba(255,255,255,0.35), transparent 28%), linear-gradient(145deg, var(--letter-muted), var(--letter-dark))`,
            }}
            role={draft.favoritePlace.image ? "img" : undefined}
            aria-label={draft.favoritePlace.image ? "Imagem do lugar favorito do casal" : undefined}
          >
            <div className="relative">
              <MapPinIcon className="size-5" aria-hidden="true" />
              <h3 className="mt-3 font-serif text-3xl font-semibold leading-none">
                {draft.favoritePlace.name || "Nosso lugar favorito"}
              </h3>
              <p className="mt-2 text-[11px] leading-5 text-white/75">
                {draft.favoritePlace.caption || "Um lugar que se tornou nosso."}
              </p>
            </div>
          </div>
        </section>

        {draft.showRelationshipTime && draft.relationshipStartedAt ? (
          <section className="bg-[var(--letter-wash)] px-5 py-10">
            <HeartIcon
              className="mx-auto size-4 fill-[var(--letter-accent)]/15 text-[var(--letter-accent)]"
              aria-hidden="true"
            />
            <p className="mb-4 mt-2 text-center text-[7px] font-bold uppercase tracking-[0.2em] text-[var(--letter-muted)]">
              Nosso amor acontece há
            </p>
            <RelationshipCounter startedAt={draft.relationshipStartedAt} compact />
          </section>
        ) : null}

        {draft.showMusic && spotifyEmbedUrl ? (
          <section className="mx-5 my-9 overflow-hidden rounded-[1.35rem] bg-[#191414] p-2.5 shadow-[0_14px_32px_rgba(30,18,23,0.14)]">
            <div className="mb-2 flex items-center gap-2 px-2 pt-1 text-white/65">
              <MusicIcon className="size-3.5 text-[#1ed760]" aria-hidden="true" />
              <p className="text-[7px] font-bold uppercase tracking-[0.18em]">A trilha da nossa história</p>
            </div>
            <SpotifyEmbed url={draft.song.spotifyUrl} title="Prévia da nossa música" />
          </section>
        ) : null}

        {draft.quizEnabled && draft.quiz.length > 0 ? <CoupleQuiz key={JSON.stringify(draft.quiz)} questions={draft.quiz} /> : null}

        <section className="bg-[var(--letter-dark)] px-7 py-12 text-center text-white">
          <SparklesIcon className="mx-auto size-5 text-white/45" aria-hidden="true" />
          <p className="mt-5 font-serif text-[2rem] font-medium italic leading-none text-white/95">
            “{draft.closingText || "Eu escolheria você em todas as vidas."}”
          </p>
          <div className="mx-auto my-6 h-px w-10 bg-white/20" />
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">
            Para {recipient}, com amor de {sender}
          </p>
        </section>
      </article>
    </div>
  );
}
