import assert from "node:assert/strict";
import { test } from "node:test";
import { initialLetterDraft } from "../components/create/types";
import { parseLetterPayload } from "../lib/letters/validation";
import { assertPublishEntitlement, PremiumRequiredError } from "../lib/letters/entitlement";
import { hashOwnerToken, LetterAccessError, requireLetterOwner } from "../lib/letters/ownership";
import { readLetterJson, RequestBodyError, MAX_LETTER_REQUEST_BYTES } from "../lib/letters/request";
import { parseQuiz } from "../lib/letters/quiz";
import { parseLoveVouchers, parseLoveWheelOptions, secureRandomIndex } from "../lib/letters/romantic-features";
import {
  FREE_LETTER_LIFETIME_MS,
  getLetterExpirationAt,
  isPublishedLetterAvailable,
} from "../lib/letters/expiration";

const image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aT1sAAAAASUVORK5CYII=";
const question = { id: "one", question: "Onde nos conhecemos?", options: ["Praia", "Parque", "Café", "Cinema"], correctIndex: 2 };
function payload(photos: number, quizEnabled = false) {
  return { ...initialLetterDraft, recipientEmail: "recebe@example.test", gallery: Array.from({ length: photos }, (_, index) => ({ id: String(index), src: image, caption: "Nós" })), quizEnabled, quiz: quizEnabled ? [question] : [] };
}
function validateAndAuthorize(value: unknown, status: string) {
  const parsed = parseLetterPayload(value);
  assertPublishEntitlement({ quizEnabled: parsed.quizEnabled, galleryCount: parsed.images.filter((item) => item.role === "GALLERY").length, vouchersEnabled: parsed.vouchersEnabled, loveWheelEnabled: parsed.loveWheelEnabled }, status);
  return parsed;
}

for (const count of [0, 1, 2]) {
  test(`Grátis publica com ${count} foto(s) no carrossel`, () => {
    assert.equal(validateAndAuthorize(payload(count), "FREE").images.length, count);
  });
}
test("terceira foto e Quiz exigem pagamento confirmado no servidor", () => {
  for (const state of ["FREE", "PAYMENT_PENDING"]) {
    assert.throws(() => validateAndAuthorize(payload(3), state), PremiumRequiredError);
    assert.throws(() => validateAndAuthorize(payload(0, true), state), PremiumRequiredError);
  }
});
test("preço e flags enviados pelo cliente não desbloqueiam Premium", () => {
  assert.throws(() => validateAndAuthorize({ ...payload(3, true), premiumStatus: "PREMIUM", paid: true, price: 0.01 }, "FREE"), PremiumRequiredError);
});
test("uma compra libera Quiz e seis fotos juntos", () => {
  const result = validateAndAuthorize(payload(6, true), "PREMIUM");
  assert.equal(result.quiz[0].correctIndex, 2);
  assert.equal(result.images.length, 6);
  assert.throws(() => validateAndAuthorize(payload(7), "PREMIUM"));
});
test("Quiz valida quatro alternativas, resposta correta, ordem e perguntas completas", () => {
  assert.throws(() => parseQuiz([{ ...question, options: ["A"] }]));
  assert.throws(() => parseQuiz([{ ...question, correctIndex: 4 }]));
  assert.throws(() => parseQuiz([{ ...question, question: "" }]));
  assert.throws(() => parseQuiz([question, question]));
  assert.deepEqual(parseQuiz([{ ...question, id: "two" }, question]).map((item) => item.id), ["two", "one"]);
  assert.equal(parseQuiz([{ ...question, question: "" }], false).length, 1);
});
test("rascunho desativado conserva perguntas sem publicar o Quiz", () => {
  const parsed = validateAndAuthorize({ ...payload(0), quiz: [{ ...question, question: "" }] }, "FREE");
  assert.equal(parsed.quizEnabled, false);
  assert.equal(parsed.quiz.length, 1);
});
test("Vales e Roleta são Premium e o cliente não consegue forjar o desbloqueio", () => {
  const romantic = {
    ...payload(0),
    vouchersEnabled: true,
    vouchers: [{ id: "vale-1", title: "Café na cama", description: "Com carinho", totalUses: 1 }],
    loveWheelEnabled: true,
    loveWheelOptions: [
      { id: "opcao-1", title: "Cinema", description: "" },
      { id: "opcao-2", title: "Piquenique", description: "" },
    ],
    premiumStatus: "PREMIUM",
    paid: true,
  };
  for (const status of ["FREE", "PAYMENT_PENDING"]) assert.throws(() => validateAndAuthorize(romantic, status), PremiumRequiredError);
  const parsed = validateAndAuthorize(romantic, "PREMIUM");
  assert.equal(parsed.vouchers.length, 1);
  assert.equal(parsed.loveWheelOptions.length, 2);
});
test("recursos românticos validam limites, duplicatas e preservam conteúdo desligado", () => {
  assert.throws(() => parseLoveVouchers([], true), /pelo menos um/i);
  assert.throws(() => parseLoveVouchers(Array.from({ length: 11 }, (_, index) => ({ id: `v-${index}`, title: "Vale", description: "", totalUses: 1 })), true), /no máximo 10/i);
  assert.throws(() => parseLoveWheelOptions([{ id: "a", title: "Cinema", description: "" }], true), /pelo menos 2/i);
  assert.throws(() => parseLoveWheelOptions([{ id: "a", title: "Cinema", description: "" }, { id: "b", title: " cinema ", description: "" }], true), /mesmo título/i);
  assert.equal(parseLoveWheelOptions([{ id: "a", title: "", description: "rascunho" }], false)[0].description, "rascunho");
  assert.equal(secureRandomIndex(4, new Uint32Array([7])), 3);
  assert.throws(() => validateAndAuthorize({ ...payload(0), loveWheelEnabled: true, loveWheelTitle: "", loveWheelOptions: [{ id: "a", title: "Cinema", description: "" }, { id: "b", title: "Piquenique", description: "" }] }, "PREMIUM"), /título da Roleta/i);
});
test("lugar favorito pode desaparecer por escolha do usuário", () => {
  const hidden = validateAndAuthorize({
    ...payload(0),
    showFavoritePlace: false,
    favoritePlace: { name: 123, caption: { ignored: true }, image: "também ignorada" },
  }, "FREE");
  assert.equal(hidden.showFavoritePlace, false);
  assert.equal(hidden.favoritePlaceName, null);
  assert.equal(hidden.favoritePlaceCaption, null);
  assert.equal(hidden.images.some((item) => item.role === "FAVORITE_PLACE"), false);
  assert.equal(validateAndAuthorize({ ...payload(0), showFavoritePlace: undefined }, "FREE").showFavoritePlace, true);
  assert.throws(() => validateAndAuthorize({ ...payload(0), showFavoritePlace: "sim" }, "FREE"));
});
test("cartinha grátis expira em 48 horas e Premium não expira", () => {
  const publishedAt = new Date("2026-09-07T12:00:00.000Z");
  const expiresAt = getLetterExpirationAt("FREE", publishedAt);
  assert.equal(expiresAt?.getTime(), publishedAt.getTime() + FREE_LETTER_LIFETIME_MS);
  assert.equal(isPublishedLetterAvailable("FREE", expiresAt, new Date(expiresAt!.getTime() - 1)), true);
  assert.equal(isPublishedLetterAvailable("FREE", expiresAt, expiresAt!), false);
  assert.equal(getLetterExpirationAt("PREMIUM", publishedAt), null);
  assert.equal(isPublishedLetterAvailable("PREMIUM", null, new Date("2099-01-01")), true);
});
test("ID público e outro token não autorizam o acesso à cartinha", () => {
  const token = "a".repeat(64);
  const letter = { ownerTokenHash: hashOwnerToken(token) };
  requireLetterOwner(new Request("https://example.test", { headers: { Authorization: `Bearer ${token}` } }), letter);
  assert.throws(() => requireLetterOwner(new Request("https://example.test"), letter), LetterAccessError);
  assert.throws(() => requireLetterOwner(new Request("https://example.test", { headers: { Authorization: `Bearer ${"b".repeat(64)}` } }), letter), LetterAccessError);
});
test("limite do corpo vale sem Content-Length e conteúdo é JSON", async () => {
  const request = new Request("https://example.test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "a".repeat(MAX_LETTER_REQUEST_BYTES) }) });
  await assert.rejects(readLetterJson(request), (error: unknown) => error instanceof RequestBodyError && error.status === 413);
  assert.deepEqual(await readLetterJson(new Request("https://example.test", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{\"valid\":true}" })), { valid: true });
});
