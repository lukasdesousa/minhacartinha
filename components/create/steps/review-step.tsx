"use client";

import Link from "next/link";
import { useState } from "react";
import type { LetterDraft } from "@/components/create/types";
import type { CreateLetterResponse } from "@/lib/letters/contracts";
import { createLetterSlug } from "@/lib/letters/slug";
import { getSpotifyTrackId } from "@/lib/spotify";
import { ArrowIcon, CheckIcon, EyeIcon, LinkIcon, LockIcon, PhotoIcon, SparklesIcon } from "@/components/ui/icons";

type ReviewStepProps = {
  draft: LetterDraft;
  onPreview: () => void;
  onPublish: () => Promise<void>;
  isPublishing: boolean;
  publishError: string;
  publishedLetter: CreateLetterResponse | null;
};

export function ReviewStep({
  draft,
  onPreview,
  onPublish,
  isPublishing,
  publishError,
  publishedLetter,
}: ReviewStepProps) {
  const [copied, setCopied] = useState(false);
  const checks = [
    { label: "Mensagem escrita", complete: Boolean(draft.message.trim()) },
    { label: "Foto principal", complete: Boolean(draft.heroImage) },
    { label: "Carrossel de momentos", complete: draft.gallery.length > 0 },
    { label: "Lugar favorito", complete: Boolean(draft.favoritePlace.name.trim()) },
    { label: "Tempo de namoro", complete: Boolean(draft.relationshipStartedAt) },
    { label: "Música no Spotify", complete: Boolean(getSpotifyTrackId(draft.song.spotifyUrl)) },
  ];
  const completed = checks.filter((item) => item.complete).length;
  const canPublish = Boolean(
    draft.recipientName.trim() &&
      draft.senderName.trim() &&
      draft.title.trim() &&
      draft.message.trim() &&
      draft.signature.trim() &&
      draft.openingText.trim() &&
      draft.closingText.trim() &&
      (!draft.song.spotifyUrl.trim() || getSpotifyTrackId(draft.song.spotifyUrl)),
  );

  async function copyPublishedLink() {
    if (!publishedLetter) return;
    await navigator.clipboard.writeText(`${window.location.origin}${publishedLetter.path}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-7">
      <div className="overflow-hidden rounded-3xl bg-[linear-gradient(145deg,#552032,#812d48)] p-6 text-white shadow-[0_20px_45px_rgba(70,25,40,0.16)] sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-[#f2c5d1]">
            <SparklesIcon className="size-5" aria-hidden="true" />
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/75">
            {completed} de {checks.length} detalhes
          </span>
        </div>
        <h3 className="mt-7 max-w-lg font-serif text-4xl font-semibold leading-none tracking-[-0.04em] sm:text-5xl">
          Sua cartinha já tem coração.
        </h3>
        <p className="mt-4 max-w-lg text-sm leading-6 text-white/68">
          Revise os detalhes, abra a experiência completa e veja como ela chegará para {draft.recipientName || "quem você ama"}.
        </p>
        <button
          type="button"
          onClick={onPreview}
          className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#70243d] shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <EyeIcon className="size-4" aria-hidden="true" />
          Abrir prévia final
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-[#e4d9db] bg-[#fffdfc] p-5 sm:p-6">
          <h3 className="font-serif text-2xl font-semibold text-[#4d2230]">Checklist da experiência</h3>
          <ul className="mt-4 space-y-3">
            {checks.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-sm text-[#6f515b]">
                <span className={`grid size-7 place-items-center rounded-full ${item.complete ? "bg-[#e8f0e6] text-[#54724d]" : "bg-[#f3e8eb] text-[#a05b6f]"}`}>
                  {item.complete ? <CheckIcon className="size-3.5" aria-hidden="true" /> : <PhotoIcon className="size-3.5" aria-hidden="true" />}
                </span>
                {item.label}
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-[#a18a91]">
                  {item.complete ? "Pronto" : "Opcional"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-[#e4d9db] bg-[#faf4f5] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[#7d3b51]">
            <LockIcon className="size-4" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]">Endereço da cartinha</span>
          </div>
          <p className="mt-5 break-all rounded-xl border border-[#e2d4d8] bg-white px-3 py-3 text-xs font-semibold text-[#774356]">
            minhacartinha.com/para/{createLetterSlug(draft.recipientName)}-...
          </p>
          <p className="mt-4 text-xs leading-5 text-[#8d747c]">
            Ao publicar, criaremos um endereço exclusivo para você compartilhar com segurança e sem precisar de cadastro.
          </p>
        </div>
      </div>

      {publishedLetter ? (
        <div className="rounded-3xl border border-[#cfdfca] bg-[#f3f8f1] p-5 sm:p-6" aria-live="polite">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#dcebd7] text-[#4d7348]">
                <CheckIcon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-[#39523a]">Sua cartinha está no ar</h3>
                <p className="mt-1 text-xs leading-5 text-[#647a63]">O conteúdo e as imagens foram salvos e o link já pode ser compartilhado.</p>
              </div>
            </div>
            <Link
              href={publishedLetter.path}
              className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#4f744a] px-5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#405f3c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f744a]"
            >
              Abrir cartinha
              <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-[#d7e4d3] bg-white/80 p-3 sm:flex-row sm:items-center">
            <code className="min-w-0 flex-1 truncate text-xs font-semibold text-[#4e694d]">{publishedLetter.path}</code>
            <button
              type="button"
              onClick={() => void copyPublishedLink()}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-[#cfddcb] px-3 text-[11px] font-bold text-[#4e694d] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f744a]"
            >
              <LinkIcon className="size-3.5" aria-hidden="true" />
              {copied ? "Link copiado" : "Copiar link"}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-[#e4d5d9] bg-[#fff9fa] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md">
              <h3 className="font-serif text-2xl font-semibold text-[#522434]">Pronta para emocionar?</h3>
              <p className="mt-1 text-xs leading-5 text-[#8b7079]">Ao publicar, a cartinha será salva no Neon, as imagens irão para o Cloudinary e um link público será criado.</p>
            </div>
            <button
              type="button"
              onClick={() => void onPublish()}
              disabled={!canPublish || isPublishing}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#8e2f4b] px-6 text-sm font-bold text-white shadow-[0_10px_25px_rgba(105,31,52,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#76243d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
            >
              {isPublishing ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" />
                  Publicando...
                </>
              ) : (
                <>
                  Publicar e criar link
                  <ArrowIcon className="size-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
          {!canPublish ? <p className="mt-4 text-xs font-semibold text-[#a44a60]">Preencha os campos principais da história antes de publicar.</p> : null}
          {publishError ? <p className="mt-4 text-xs font-semibold text-[#a6374d]" role="alert">{publishError}</p> : null}
        </div>
      )}
    </div>
  );
}
