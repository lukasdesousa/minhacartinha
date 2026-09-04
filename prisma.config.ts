import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL ?? process.env.database_url;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // `prisma generate` runs during dependency installation and does not need
    // a database connection. Commands that access the database still require
    // DATABASE_URL (or the legacy database_url) in their environment.
    url: databaseUrl ?? "",
  },
});
