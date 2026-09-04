import { getSpotifyEmbedUrl } from "@/lib/spotify";

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
  const embedUrl = getSpotifyEmbedUrl(url);
  if (!embedUrl) return null;

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
