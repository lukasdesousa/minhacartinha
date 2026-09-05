import { expect, test, type Page } from "@playwright/test";

const png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aT1sAAAAASUVORK5CYII=";

async function mockCheckout(page: Page) {
  let approved = false;
  let created = false;
  let draft: unknown = null;
  let creates = 0;
  await page.route("**/api/letters/draft**", async (route) => {
    if (route.request().method() === "POST") draft = route.request().postDataJSON().draft;
    await route.fulfill({ json: { id: "test-letter", premiumStatus: approved ? "PREMIUM" : created ? "PAYMENT_PENDING" : "FREE", status: "DRAFT", draft } });
  });
  await page.route("**/api/payments/pix**", async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      expect(body).toEqual({ letterId: "test-letter", payerEmail: "pagador@example.test" });
      expect(route.request().headers().authorization).toMatch(/^Bearer [a-f0-9]{64}$/);
      created = true;
      creates += 1;
    }
    await route.fulfill({ json: {
      premiumStatus: approved ? "PREMIUM" : created ? "PAYMENT_PENDING" : "FREE",
      payment: created ? { id: "test-payment", status: approved ? "APPROVED" : "PENDING", amountCents: 790, qrCode: "PIX-TESTE-SOMENTE-INTERFACE", qrCodeBase64: png, expiresAt: "2099-01-01T12:30:00Z" } : null,
      pollAfterMs: 15000,
    } });
  });
  return { approve: () => { approved = true; }, creates: () => creates };
}

test("terceira foto convida ao Premium e preserva fotos no celular", async ({ page }) => {
  await mockCheckout(page);
  await page.goto("/criar");
  await page.getByRole("navigation", { name: "Etapas de criação" }).getByRole("button", { name: /Fotos/ }).click();
  const galleryInput = page.locator('input[type="file"][multiple]');
  await galleryInput.setInputFiles([1, 2, 3].map((n) => ({ name: `momento-${n}.png`, mimeType: "image/png", buffer: Buffer.from(png, "base64") })));
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: /Quer adicionar mais momentos/ })).toBeVisible();
  await expect(dialog.getByText("Compra única para esta cartinha. Sem assinatura.")).toBeVisible();
  await dialog.getByRole("button", { name: "Continuar editando", exact: true }).click();
  await expect(page.getByRole("button", { name: "Remover foto 2", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Remover foto 3", exact: true })).toHaveCount(0);
  await page.screenshot({ path: "test-results/fotos-mobile.png", fullPage: true });
});

test("Quiz mantém edição durante Pix e após recarregar; confirmação libera tudo", async ({ page, context }) => {
  const checkout = await mockCheckout(page);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/criar");
  await page.getByLabel("E-mail para entregar a cartinha").fill("amor@example.test");
  await page.getByRole("navigation", { name: "Etapas de criação" }).getByRole("button", { name: /Estilo/ }).click();
  await page.getByLabel("Incluir Quiz nesta cartinha").check();
  await page.getByLabel("Sua pergunta", { exact: true }).fill("Onde nos conhecemos?");
  for (const [index, option] of ["Praia", "Parque", "Café", "Cinema"].entries()) {
    await page.getByRole("textbox", { name: `Alternativa ${String.fromCharCode(65 + index)} da pergunta 1`, exact: true }).fill(option);
  }
  await page.getByRole("radio", { name: "Alternativa C é a correta da pergunta 1" }).check();
  await page.getByRole("button", { name: "Desbloquear Premium — R$ 7,90", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Seu e-mail para o pagamento").fill("pagador@example.test");
  await dialog.getByRole("button", { name: "Desbloquear Premium — R$ 7,90", exact: true }).dblclick();
  await expect(dialog.getByRole("img", { name: /QR Code Pix/ })).toHaveAttribute("src", `data:image/png;base64,${png}`);
  await expect(dialog.getByLabel("Pix copia e cola")).toHaveValue("PIX-TESTE-SOMENTE-INTERFACE");
  await dialog.getByRole("button", { name: "Copiar Pix", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("PIX-TESTE-SOMENTE-INTERFACE");
  expect(checkout.creates()).toBe(1);
  await page.screenshot({ path: "test-results/pix-mobile.png" });
  await dialog.getByRole("button", { name: "Continuar editando", exact: true }).click();
  await expect(page.getByLabel("Sua pergunta", { exact: true })).toHaveValue("Onde nos conhecemos?");
  await page.reload();
  await page.getByRole("navigation", { name: "Etapas de criação" }).getByRole("button", { name: /Estilo/ }).click();
  await expect(page.getByLabel("Sua pergunta", { exact: true })).toHaveValue("Onde nos conhecemos?");
  checkout.approve();
  await page.getByRole("button", { name: "Desbloquear Premium — R$ 7,90", exact: true }).click();
  await expect(dialog.getByRole("heading", { name: "Premium desbloqueado!" })).toBeVisible();
  expect(checkout.creates()).toBe(1);
  await dialog.getByRole("button", { name: "Continuar minha cartinha" }).click();
  await page.getByRole("button", { name: "Ver prévia", exact: true }).click();
  const preview = page.getByRole("dialog", { name: "Prévia da sua cartinha" });
  await preview.getByRole("button", { name: "A. Praia", exact: true }).click();
  await expect(preview.getByText(/Quase! A resposta era C/)).toBeVisible();
  await preview.getByRole("button", { name: "Ver nosso resultado" }).click();
  await expect(preview.getByText("0/1", { exact: true })).toBeVisible();
  await preview.getByRole("button", { name: "Brincar de novo" }).click();
  await preview.getByRole("button", { name: "C. Café", exact: true }).click();
  await expect(preview.getByText(/Acertou! Essa lembrança/)).toBeVisible();
  await preview.getByRole("button", { name: "Ver nosso resultado" }).click();
  await expect(preview.getByText("1/1", { exact: true })).toBeVisible();
});

for (const count of [0, 1, 2]) {
  test(`cartinha grátis com ${count} fotos publica com link e QR Code sem comprar`, async ({ page }) => {
    const checkout = await mockCheckout(page);
    await page.route("**/api/letters", async (route) => {
      const data = route.request().postDataJSON();
      expect(data.gallery).toHaveLength(count);
      expect(data.quizEnabled).toBe(false);
      expect(route.request().headers().authorization).toMatch(/^Bearer [a-f0-9]{64}$/);
      await route.fulfill({ json: { id: "test-letter", slug: "test-letter", path: "/c/test-letter", publicUrl: "https://example.test/c/test-letter", qrCodeDataUrl: `data:image/png;base64,${png}`, emailStatus: "sent", emailMessage: "E-mail de teste simulado." } });
    });
    await page.goto("/criar");
    await page.getByLabel("E-mail para entregar a cartinha").fill("amor@example.test");
    if (count > 0) {
      await page.getByRole("navigation", { name: "Etapas de criação" }).getByRole("button", { name: /Fotos/ }).click();
      await page.locator('input[type="file"][multiple]').setInputFiles(Array.from({ length: count }, (_, index) => ({ name: `momento-${index}.png`, mimeType: "image/png", buffer: Buffer.from(png, "base64") })));
      await expect(page.getByRole("button", { name: `Remover foto ${count}`, exact: true })).toBeVisible();
    }
    await page.getByRole("navigation", { name: "Etapas de criação" }).getByRole("button", { name: /Revisar/ }).click();
    await page.getByRole("button", { name: "Publicar e criar link", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Sua cartinha está pronta" })).toBeVisible();
    await expect(page.getByRole("img", { name: "QR Code para abrir a cartinha" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Compartilhar", exact: true })).toBeVisible();
    expect(checkout.creates()).toBe(0);
  });
}

test("Home explica compra única e transparência não inventa dados indisponíveis", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Grátis/, exact: true })).toBeVisible();
  await expect(page.getByText(/Compra única/).first()).toBeVisible();
  await page.goto("/transparencia");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/transparencia$/);
  await page.screenshot({ path: "test-results/transparencia-mobile.png", fullPage: true });
});
