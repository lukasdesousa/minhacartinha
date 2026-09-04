const spotifyTrackIdPattern = /^[A-Za-z0-9]{22}$/;

export function getSpotifyTrackId(value: string) {
  const input = value.trim();
  if (!input) return null;

  const uriMatch = input.match(/^spotify:track:([A-Za-z0-9]{22})$/i);
  if (uriMatch) return uriMatch[1];

  try {
    const url = new URL(input);
    if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "open.spotify.com") {
      return null;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const trackIndex = segments.findIndex((segment) => segment.toLowerCase() === "track");
    const trackId = trackIndex >= 0 ? segments[trackIndex + 1] : undefined;
    return trackId && spotifyTrackIdPattern.test(trackId) ? trackId : null;
  } catch {
    return null;
  }
}

export function getCanonicalSpotifyUrl(value: string) {
  const trackId = getSpotifyTrackId(value);
  return trackId ? `https://open.spotify.com/track/${trackId}` : null;
}

export function getSpotifyEmbedUrl(value: string) {
  const trackId = getSpotifyTrackId(value);
  return trackId
    ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`
    : null;
}
