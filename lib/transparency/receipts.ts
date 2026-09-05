/** Public receipts are reviewed, redacted files on public HTTPS storage. */
export function publicHttpsUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (
      url.protocol !== "https:" || url.username || url.password ||
      host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") ||
      host.includes(":") || /^\d+(\.\d+){3}$/.test(host) || !host.includes(".") ||
      url.search || url.hash
    ) return null;
    return url.toString();
  } catch {
    return null;
  }
}
