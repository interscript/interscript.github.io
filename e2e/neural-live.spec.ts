// LIVE /neural verification — downloads the real artifact through the
// assets proxy and decodes in the browser. Opt-in (LIVE_NEURAL=1) so
// CI never pulls 95MB; run against the deployed site:
//   LIVE_NEURAL=1 npx playwright test e2e/neural-live.spec.ts
import { expect, test } from "@playwright/test"

test.skip(!process.env.LIVE_NEURAL, "live download test — set LIVE_NEURAL=1")

test("lite int4 tier downloads, verifies, and vocalizes in the browser", async ({ page }) => {
  test.setTimeout(420_000)
  await page.goto(`${process.env.LIVE_NEURAL_BASE ?? "https://interscript.org"}/neural`)
  await page.selectOption("#model", "ara-diac-layerdrop-1.0-int4")
  await page.fill("#input", "قوله فحكمها في الوفاة")
  await page.click("#run")
  // progress must appear (index resolve + download), then the model decodes
  await expect(page.locator("#progress")).toBeVisible({ timeout: 30_000 })
  const output = page.locator("#output")
  await expect(output).not.toBeEmpty({ timeout: 420_000 })
  const text = (await output.textContent()) ?? ""
  // fully vocalized output carries haraqat bytes and no error surface
  expect(text).toMatch(/[ً-ْٰٓ-ٕ]/)
  expect(text).not.toMatch(/Error|cause:/)
})
