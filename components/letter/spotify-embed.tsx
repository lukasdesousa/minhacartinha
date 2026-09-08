"use client";

import { getSpotifyEmbedUrl } from "@/lib/spotify";
import { useConsent } from "@/components/privacy/consent-provider";

type SpotifyEmbedProps = {
  url: string;
  title?: string;
  className?: string;
};

export function SpotifyEmbed({
  url,
  title = "Nossa música no Spotify",
  className = "",
}: SpotifyEmbedProps) {
  const { externalMedia, allowExternalMedia, openPreferences } = useConsent();
  const embedUrl = getSpotifyEmbedUrl(url);
  if (!embedUrl) return null;

  if (!externalMedia) {
    return (
      <div className={`rounded-xl border border-[#e4d7da] bg-white/75 p-4 text-center ${className}`}>
        <p className="text-xs leading-5 text-[#745e66]">O player do Spotify está bloqueado até você permitir conteúdo externo.</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={allowExternalMedia} className="min-h-10 rounded-full bg-[#8e2f4b] px-4 text-xs font-bold text-white">Permitir Spotify</button>
          <button type="button" onClick={openPreferences} className="min-h-10 rounded-full border border-[#d8c4ca] px-4 text-xs font-semibold text-[#794157]">Preferências</button>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl}
      title={title}
      width="100%"
      height="152"
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className={`block h-[152px] w-full rounded-xl border-0 ${className}`}
    />
  );
}
