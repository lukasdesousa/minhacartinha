import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.database_url;

  if (!databaseUrl) {
    throw new Error("Defina DATABASE_URL ou database_url para conectar ao PostgreSQL.");
  }

  const runtimeDatabaseUrl = new URL(databaseUrl);

  if (runtimeDatabaseUrl.searchParams.get("sslmode") === "require") {
    runtimeDatabaseUrl.searchParams.set("sslmode", "verify-full");
  }

  const adapter = new PrismaPg({
    connectionString: runtimeDatabaseUrl.toString(),
    max: 1,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
  });

  return new PrismaClient({ adapter });
}

export async function withPrisma<T>(
  operation: (client: PrismaClient) => Promise<T>,
) {
  const client = createPrismaClient();

  try {
    return await operation(client);
  } finally {
    await client.$disconnect();
  }
}
