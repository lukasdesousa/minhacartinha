import type { LetterDraft, ThemeId } from "@/components/create/types";
import type { CSSProperties, ReactNode } from "react";
import { getTheme, letterThemes } from "@/components/create/types";
import { FieldGroup, TextField } from "@/components/create/form-controls";
import { RelationshipCounter } from "@/components/letter/relationship-counter";
import { SpotifyEmbed } from "@/components/letter/spotify-embed";
import { CalendarIcon, MusicIcon, SparklesIcon } from "@/components/ui/icons";
import { getSpotifyEmbedUrl } from "@/lib/spotify";

type DetailsStepProps = {
  draft: LetterDraft;
  onChange: (patch: Partial<LetterDraft>) => void;
};

export function DetailsStep({ draft, onChange }: DetailsStepProps) {
  const theme = getTheme(draft.themeId);
  const spotifyEmbedUrl = getSpotifyEmbedUrl(draft.song.spotifyUrl);
  const invalidSpotifyUrl = Boolean(draft.song.spotifyUrl.trim()) && !spotifyEmbedUrl;
  const themeStyle = {
    "--letter-accent": theme.colors.accent,
    "--letter-dark": theme.colors.dark,
    "--letter-muted": theme.colors.muted,
  } as CSSProperties;

  return (
    <div className="space-y-9">
      <FieldGroup
        title="Escolha a atmosfera"
        description="A paleta muda toda a experiência sem tirar o protagonismo da sua história."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {letterThemes.map((theme) => {
            const isSelected = draft.themeId === theme.id;
            return (
              <label
                key={theme.id}
                className={`relative cursor-pointer rounded-2xl border p-4 transition-all focus-within:ring-4 focus-within:ring-[#ead9de]/70 ${
                  isSelected
                    ? "border-[#8f3c56] bg-[#fffafa] shadow-[0_9px_25px_rgba(76,30,44,0.08)]"
                    : "border-[#e2d7d9] bg-[#fffdfc] hover:border-[#c8b2b8]"
                }`}
              >
                <input
                  type="radio"
                  name="theme"
                  value={theme.id}
                  checked={isSelected}
                  onChange={() => onChange({ themeId: theme.id as ThemeId })}
                  className="sr-only"
                />
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="size-5 rounded-full" style={{ backgroundColor: theme.colors.dark }} />
                  <span className="size-5 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                  <span className="size-5 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.wash }} />
                </span>
                <span className="mt-4 block text-sm font-bold text-[#57303d]">{theme.name}</span>
                <span className="mt-1 block text-[10px] leading-4 text-[#987e86]">{theme.description}</span>
                {isSelected ? (
                  <span className="absolute right-3 top-3 size-2 rounded-full bg-[#8f3c56]" aria-hidden="true" />
                ) : null}
              </label>
            );
          })}
        </div>
      </FieldGroup>

      <div className="h-px bg-[#eee5e7]" />

      <FieldGroup
        title="Frases que ficam"
        description="Use pequenas mensagens para conduzir a pessoa por toda a experiência."
      >
        <div className="space-y-5">
          <TextField
            label="Frase de abertura"
            hint={`${draft.openingText.length}/70`}
            value={draft.openingText}
            maxLength={70}
            onChange={(event) => onChange({ openingText: event.target.value })}
          />
          <TextField
            label="Frase de encerramento"
            hint={`${draft.closingText.length}/100`}
            value={draft.closingText}
            maxLength={100}
            onChange={(event) => onChange({ closingText: event.target.value })}
          />
        </div>
      </FieldGroup>

      <div className="h-px bg-[#eee5e7]" />

      <FieldGroup
        title="O começo do nosso nós"
        description="Marque o dia e, se quiser, o horário em que a história de vocês ganhou um novo nome."
      >
        <div
          className="relative isolate overflow-hidden rounded-[1.75rem] border border-[#ead8dd] bg-[linear-gradient(145deg,#fffafa,#f6e8ec)] p-5 sm:p-7"
          style={themeStyle}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-20 -z-10 size-56 rounded-full bg-[var(--letter-accent)]/10 blur-3xl"
            aria-hidden="true"
          />
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--letter-dark)] text-white shadow-[0_10px_24px_rgba(68,25,39,0.16)]">
              <CalendarIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--letter-muted)]">
                Desde o primeiro sim
              </p>
              <p className="mt-1 font-serif text-2xl font-semibold leading-none text-[var(--letter-dark)]">
                Há quanto tempo vocês se escolheram?
              </p>
            </div>
          </div>

          <div className="mt-6">
            <TextField
              label="Data e horário do início do namoro"
              hint="Para contar cada minuto"
              type="datetime-local"
              value={draft.relationshipStartedAt}
              onChange={(event) => onChange({ relationshipStartedAt: event.target.value })}
              className="bg-white/85"
            />
          </div>

          {draft.relationshipStartedAt ? (
            <div className="mt-6 rounded-2xl border border-white/80 bg-white/40 p-3 sm:p-4">
              <p className="mb-3 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--letter-muted)]">
                Vocês estão juntos há
              </p>
              <RelationshipCounter startedAt={draft.relationshipStartedAt} />
            </div>
          ) : null}

          <div className="mt-5">
            <ToggleOption
              checked={draft.showRelationshipTime}
              onChange={(showRelationshipTime) => onChange({ showRelationshipTime })}
              title="Mostrar nosso tempo juntos"
              description="Exibe o contador apaixonante na cartinha."
              icon={<CalendarIcon className="size-4" aria-hidden="true" />}
            />
          </div>
        </div>
      </FieldGroup>

      <div className="h-px bg-[#eee5e7]" />

      <FieldGroup
        title="A trilha de vocês"
        description="Cole a faixa que sempre leva vocês de volta a um momento especial."
      >
        <div className="space-y-5">
          <div className="overflow-hidden rounded-[1.75rem] border border-[#ded9df] bg-[#191414] p-4 shadow-[0_16px_40px_rgba(32,20,25,0.12)] sm:p-5">
            <div className="mb-4 flex items-center gap-3 text-white">
              <span className="grid size-10 place-items-center rounded-full bg-[#1ed760] text-[#0e351d]">
                <MusicIcon className="size-4.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#1ed760]">
                  Spotify
                </p>
                <p className="mt-0.5 text-xs text-white/60">Compartilhar → Copiar link da música</p>
              </div>
            </div>
            <TextField
              label="Link da música"
              value={draft.song.spotifyUrl}
              inputMode="url"
              autoComplete="off"
              maxLength={300}
              placeholder="https://open.spotify.com/track/..."
              onChange={(event) =>
                onChange({ song: { spotifyUrl: event.target.value } })
              }
              className="border-white/15 bg-white text-[#35212a]"
              labelClassName="text-white/80"
              aria-invalid={invalidSpotifyUrl}
            />
            {invalidSpotifyUrl ? (
              <p className="mt-2 text-xs font-semibold text-[#ff9aad]" role="alert">
                Cole um link de faixa do Spotify, como open.spotify.com/track/...
              </p>
            ) : null}

            {spotifyEmbedUrl ? (
              <div className="mt-4 overflow-hidden rounded-xl bg-black/30">
                <SpotifyEmbed url={draft.song.spotifyUrl} title="Prévia da música escolhida" />
              </div>
            ) : (
              <div className="mt-4 flex min-h-24 items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.04] p-4 text-white/55">
                <MusicIcon className="size-5 shrink-0 text-[#1ed760]" aria-hidden="true" />
                <p className="text-xs leading-5">
                  A capa, o artista e o botão de reprodução aparecerão aqui.
                </p>
              </div>
            )}
          </div>

          <ToggleOption
            checked={draft.showMusic}
            onChange={(showMusic) => onChange({ showMusic })}
            title="Tocar a nossa música"
            description="Inclui o player oficial do Spotify na cartinha."
            icon={<MusicIcon className="size-4" aria-hidden="true" />}
          />
        </div>
      </FieldGroup>

      <div className="flex gap-3 rounded-2xl bg-[#f2eef7] p-4 text-sm leading-6 text-[#665775]">
        <SparklesIcon className="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
        <p>Quem receber poderá ouvir a prévia diretamente na cartinha e abrir a faixa completa no Spotify.</p>
      </div>
    </div>
  );
}

type ToggleOptionProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
  icon: ReactNode;
};

function ToggleOption({ checked, onChange, title, description, icon }: ToggleOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#e3d7da] bg-[#fffdfc] p-3.5 transition-colors hover:border-[#c8b2b8]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f4e8eb] text-[#91405a]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold text-[#5d3341]">{title}</span>
        <span className="mt-0.5 block text-[10px] leading-4 text-[#998189]">{description}</span>
      </span>
      <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-[#8f3c56]" : "bg-[#d9cdd0]"}`} aria-hidden="true">
        <span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`} />
      </span>
    </label>
  );
}
