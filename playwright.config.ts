import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright E2E configuration for interscript.org.
 *
 * Tests run against `astro dev` (port 4321) started in CI.
 * For local runs: `npm run dev` in one terminal, `npx playwright test` in another.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  use: {
    baseURL: "http://localhost:4322",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.CI
    ? {
        command: "npm run dev",
        url: "http://localhost:4321",
        reuseExistingServer: false,
        timeout: 60_000,
      }
    : undefined,
})
