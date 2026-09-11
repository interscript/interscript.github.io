// LIVE playground speculative-tier verification — downloads the real
// drafter+verifier pair through the assets proxy and decodes in the
// browser with the verifier deciding every token. Opt-in (SPEC_E2E=1):
//   SPEC_E2E=1 npx playwright test e2e/playground-spec-live.spec.ts
import { expect, test } from "@playwright/test"

test("speculative tier downloads both models and vocalizes in the browser", async ({ page }) => {
  test.skip(!process.env.SPEC_E2E, "live download test — set SPEC_E2E=1")
  test.setTimeout(900_000)
  await page.goto(`${process.env.SPEC_E2E_BASE ?? "http://localhost:4321"}/playground`)
  await page.fill("#input", "قوله فحكمها في الوفاة")
  await page.selectOption("#vocalize", "spec:ara-diac-small-2.1-int8")
  await page.click("#run")
  // both downloads stream progress, then the pair decodes
  await expect(page.locator("#status")).toBeVisible({ timeout: 30_000 })
  const vocalized = page.locator("#vocalized")
  // fresh profile = 359 MB total; budget for a slow network
  await expect(vocalized).not.toBeEmpty({ timeout: 840_000 })
  const text = (await vocalized.textContent()) ?? ""
  expect(text).toMatch(/[ً-ْٰٓ-ٕ]/)
  expect(text).not.toMatch(/Error|cause:/)
  // the acceptance readout surfaces once the worker call resolves
  // after the vocalized text — poll rather than read once
  await expect(page.locator("#status")).toContainText("accepted", { timeout: 60_000 })
})
