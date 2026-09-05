export const MAX_LETTER_REQUEST_BYTES = 4_400_000;
export const REQUEST_KEY_PATTERN = /^[A-Za-z0-9_-]{20,64}$/;

export class RequestBodyError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

/** Enforce limits while reading, including requests without Content-Length. */
export async function readLetterJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > MAX_LETTER_REQUEST_BYTES) {
    throw new RequestBodyError("As imagens ultrapassaram o limite permitido para esta cartinha.", 413);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new RequestBodyError("Envie os dados no formato JSON.", 415);
  }
  const reader = request.body?.getReader();
  if (!reader) throw new RequestBodyError("O conteúdo enviado é inválido.", 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_LETTER_REQUEST_BYTES) {
      await reader.cancel();
      throw new RequestBodyError("As imagens ultrapassaram o limite permitido para esta cartinha.", 413);
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
