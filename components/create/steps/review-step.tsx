"use client";

import type { LetterDraft } from "@/components/create/types";
import type { CreateLetterResponse } from "@/lib/letters/contracts";
import { PublishedSuccess } from "@/components/create/published-success";
import { PremiumBadge } from "@/components/create/premium-badge";
import { PREMIUM_PRICE_LABEL } from "@/lib/premium";
import { getQuizError } from "@/lib/letters/quiz";
import { getSpotifyTrackId } from "@/lib/spotify";
import { ArrowIcon, CheckIcon, EyeIcon, LockIcon, PhotoIcon, SparklesIcon } from "@/components/ui/icons";

type ReviewStepProps = {
  draft: LetterDraft;
  onPreview: () => void;
  onPublish: () => Promise<void>;
  isPublishing: boolean;
  publishError: string;
  publishedLetter: CreateLetterResponse | null;
  premiumPaid: boolean;
  premiumSelected: boolean;
  onCheckout: () => void;
};

export function ReviewStep({
  draft,
  onPreview,
  onPublish,
  isPublishing,
  publishError,
  publishedLetter,
  premiumPaid,
  premiumSelected,
  onCheckout,
}: ReviewStepProps) {
  const needsPremiumPayment = premiumSelected && !premiumPaid;
  const quizError = draft.quizEnabled ? getQuizError(draft.quiz) : "";
  const checks = [
    { label: "Mensagem escrita", complete: Boolean(draft.message.trim()) },
    { label: "E-mail para entrega", complete: Boolean(draft.recipientEmail.trim()) },
    { label: "Foto principal", complete: Boolean(draft.heroImage) },
    { label: "Carrossel de momentos", complete: draft.gallery.length > 0 },
    { label: "Lugar favorito", complete: Boolean(draft.favoritePlace.name.trim()) },
    { label: "Tempo de namoro", complete: Boolean(draft.relationshipStartedAt) },
    { label: "Música no Spotify", complete: Boolean(getSpotifyTrackId(draft.song.spotifyUrl)) },
  ];
  const completed = checks.filter((item) => item.complete).length;
  const canPublish = Boolean(
    draft.recipientName.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(draft.recipientEmail.trim()) &&
      draft.senderName.trim() &&
      draft.title.trim() &&
      draft.message.trim() &&
      draft.signature.trim() &&
      draft.openingText.trim() &&
      draft.closingText.trim() &&
      (!draft.song.spotifyUrl.trim() || getSpotifyTrackId(draft.song.spotifyUrl)) && !quizError,
  );

  return (
    <div className="space-y-7">
      <div className="rounded-3xl border border-[#e2cdd5] bg-[#fff9fa] p-5">
        <div className="flex items-center gap-3"><h3 className="font-serif text-2xl text-[#522434]">{premiumSelected ? "Sua cartinha Premium" : "Sua cartinha grátis"}</h3>{premiumSelected && <PremiumBadge unlocked={premiumPaid} selected={!premiumPaid} />}</div>
        <p className="mt-2 text-xs leading-6 text-[#8b7079]">{premiumPaid ? "Pagamento confirmado. Quiz do casal e até 6 fotos estão liberados nesta cartinha." : premiumSelected ? `Sua cartinha está pronta para o pagamento único de ${PREMIUM_PRICE_LABEL}. O QR Code Pix será criado aqui, antes da publicação e do envio.` : "Mensagem personalizada, nomes, data especial, até 2 fotos no carrossel, link exclusivo, QR Code da cartinha e compartilhamento."}</p>
      </div>
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
            minhacartinha.com.br/c/identificador-seguro
          </p>
          <p className="mt-4 text-xs leading-5 text-[#8d747c]">
            Ao publicar, criaremos um endereço exclusivo para você compartilhar com segurança e sem precisar de cadastro.
          </p>
        </div>
      </div>

      {publishedLetter ? (
        <PublishedSuccess letter={publishedLetter} />
      ) : (
        <div className="rounded-3xl border border-[#e4d5d9] bg-[#fff9fa] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md">
              <h3 className="font-serif text-2xl font-semibold text-[#522434]">Pronta para emocionar?</h3>
              <p className="mt-1 text-xs leading-5 text-[#8b7079]">Ao publicar, sua cartinha ficará pronta para compartilhar por link e QR Code.</p>
            </div>
            <button
              type="button"
              onClick={() => needsPremiumPayment ? onCheckout() : void onPublish()}
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
                  {needsPremiumPayment ? `Gerar Pix — ${PREMIUM_PRICE_LABEL}` : "Publicar e criar link"}
                  <ArrowIcon className="size-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
          {!canPublish ? <p className="mt-4 text-xs font-semibold text-[#a44a60]">Preencha os campos principais da história antes de publicar.</p> : null}
          {quizError ? <p className="mt-3 text-xs text-[#a44a60]">{quizError}</p> : null}
          {publishError ? <p className="mt-4 text-xs font-semibold text-[#a6374d]" role="alert">{publishError}</p> : null}
        </div>
      )}
    </div>
  );
}
