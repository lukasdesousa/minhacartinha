import "server-only";

const PUBLIC_ID_PATTERN = /^[a-f0-9]{32}$/;

export function createLetterPublicId() {
  return crypto.randomUUID().replaceAll("-", "");
}

export function isCurrentLetterPublicId(value: string) {
  return PUBLIC_ID_PATTERN.test(value);
}
