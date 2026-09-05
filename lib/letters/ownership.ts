import { createHash, timingSafeEqual } from "node:crypto";

export class LetterAccessError extends Error {
  readonly status = 403;
  constructor() {
    super("Não foi possível acessar este rascunho neste dispositivo.");
  }
}

export function getOwnerToken(request: Request) {
  const match = request.headers.get("authorization")?.match(/^Bearer ([a-f0-9]{64})$/i);
  if (!match) throw new LetterAccessError();
  return match[1];
}

export function hashOwnerToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function requireLetterOwner(request: Request, letter: { ownerTokenHash: string | null }) {
  const supplied = Buffer.from(hashOwnerToken(getOwnerToken(request)), "hex");
  const stored = Buffer.from(letter.ownerTokenHash ?? "", "hex");
  if (stored.length !== supplied.length || !timingSafeEqual(stored, supplied)) {
    throw new LetterAccessError();
  }
}
