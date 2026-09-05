import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    // UI tests mock checkout APIs; never connect to the developer's real DB.
    env: { DATABASE_URL: "postgresql://test:test@127.0.0.1:1/test", MERCADO_PAGO_ACCESS_TOKEN: "", MERCADO_PAGO_WEBHOOK_SECRET: "" },
  },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3100",
    channel: "chrome",
    viewport: { width: 390, height: 844 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
