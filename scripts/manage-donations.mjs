import "dotenv/config";
import { readFile, stat } from "node:fs/promises";
import pg from "pg";
import { validateDonationInput } from "./lib/donation-input.mjs";

async function main() {
  const args = process.argv.slice(2);
  const fileIndex = args.indexOf("--input");
  const inputPath = fileIndex >= 0 ? args[fileIndex + 1] : null;
  const publish = args.includes("--publish");
  const dryRun = args.includes("--dry-run");
  if (!inputPath || inputPath.startsWith("--") || args.some((arg, index) => index !== fileIndex + 1 && !["--input", "--publish", "--dry-run"].includes(arg))) {
    throw new Error("Uso: node scripts/manage-donations.mjs --input arquivo.json [--dry-run] [--publish]");
  }
  if ((await stat(inputPath)).size > 65_536) throw new Error("O JSON deve ter no máximo 64 KB.");
  const { institution, donation } = validateDonationInput(JSON.parse(await readFile(inputPath, "utf8")), publish);
  if (dryRun) {
    console.info(`JSON validado. Instituição: 1. Doação: ${donation ? 1 : 0}. Destino: ${publish ? "publicação" : "rascunho"}. Nenhuma conexão ao banco foi feita.`);
    return;
  }

  const databaseUrl = process.env.DATABASE_URL ?? process.env.database_url;
  if (!databaseUrl) throw new Error("Defina DATABASE_URL para cadastrar os registros.");
  const connectionUrl = new URL(databaseUrl);
  if (connectionUrl.searchParams.get("sslmode") === "require") connectionUrl.searchParams.set("sslmode", "verify-full");
  const client = new pg.Client({ connectionString: connectionUrl.toString(), connectionTimeoutMillis: 10_000 });
  try {
    await client.connect();
    await client.query("BEGIN");
    await client.query('INSERT INTO donation_institutions (id, name, "websiteUrl", "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, "websiteUrl" = EXCLUDED."websiteUrl", "updatedAt" = NOW()', [institution.id, institution.name, institution.websiteUrl]);
    if (donation) {
      // A stable ID makes re-importing idempotent. Publishing is explicit and a
      // later draft import removes public visibility until it is reviewed again.
      await client.query('INSERT INTO donations (id, "institutionId", "amountCents", "donatedAt", description, "receiptUrl", note, "receiptReviewedAt", "publishedAt", "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW()) ON CONFLICT (id) DO UPDATE SET "institutionId"=EXCLUDED."institutionId", "amountCents"=EXCLUDED."amountCents", "donatedAt"=EXCLUDED."donatedAt", description=EXCLUDED.description, "receiptUrl"=EXCLUDED."receiptUrl", note=EXCLUDED.note, "receiptReviewedAt"=EXCLUDED."receiptReviewedAt", "publishedAt"=EXCLUDED."publishedAt", "updatedAt"=NOW()', [donation.id, institution.id, donation.amountCents, donation.donatedAt, donation.description, donation.receiptUrl, donation.note, donation.receiptReviewedAt, donation.publishedAt]);
    }
    await client.query("COMMIT");
    console.info(publish ? "Doação publicada com revisão registrada." : "Cadastro salvo. Doações permanecem em rascunho até publicação explícita.");
  } catch {
    await client.query("ROLLBACK").catch(() => {});
    throw new Error("Não foi possível salvar os registros. A transação foi revertida; confira a conexão, a migração e os dados.");
  } finally {
    await client.end().catch(() => {});
  }
}

main().catch((error) => {
  // Validation errors contain field names, never the input values or DB URL.
  console.error(error instanceof SyntaxError ? "JSON inválido." : error instanceof Error && error.message ? error.message : "Não foi possível processar o cadastro.");
  process.exitCode = 1;
});
