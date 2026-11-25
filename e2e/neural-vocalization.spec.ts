import { expect, test, type Page } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"

/**
 * /neural vocalization demo.
 *
 * The smoke assertions always run (no model download). The full
 * in-browser conformance run downloads the real artifacts (397 MB +
 * 249 MB) through the page's worker and asserts the frozen conformance
 * vectors byte-exactly — gate it behind BROWSER_VOCAL_E2E=1 so normal
 * CI never pulls half a gigabyte.
 *
 *   BROWSER_VOCAL_E2E=1 npx playwright test e2e/neural-vocalization.spec.ts
 *
 * Vectors (interscript-models/conformance):
 *   heb-vocalized-plane-3.0-vectors.json row 177 (the /ml quickstart row)
 *   urd-vocalized-2.0-vectors.json row 0
 */

// Constants below are the frozen conformance vector rows as \u escapes —
// bidi rendering visually reorders Hebrew combining marks, so the bytes
// must be pinned exactly (the /ml page's quoted string differs in mark
// order; the fixtures are the gate).
const HEB_SRC = "\u05d5\u05d0\u05dd \u05d4\u05d6\u05d4, \u05db\u05e9\u05e8"
const HEB_OUT =
  "\u05d5\u05b0\u05d0\u05b4\u05dd \u05d4\u05b4\u05d6\u05bc\u05b8\u05d4, \u05db\u05bc\u05b8\u05e9\u05c1\u05b5\u05e8"
const URD_SRC = "\u0641\u0627\u0633\u062f \u0627\u0644\u0639\u0642\u06cc\u062f\u06c1"
const URD_OUT =
  "\u0641\u0652\u0627\u0633\u0652\u062f\u0650 \u0627\u0644\u0652\u0639\u064f\u0642\u0652\u06cc\u062f\u0652\u06c1\u064e"

const GATED = process.env["BROWSER_VOCAL_E2E"] === "1"

async function runModel(
  page: Page,
  value: string,
  kind: string,
): Promise<{ output: string; stats: string }> {
  await page.selectOption("#model", { value })
  await expect(page.locator("#model option:checked")).toHaveAttribute("data-kind", kind)
  await page.locator("#run").click()
  // model download + verify + session + decode: 10 minutes of headroom
  await expect
    .poll(async () => page.locator("#output").textContent(), {
      timeout: 600_000,
      intervals: [2_000],
    })
    .not.toBe("")
  const output = (await page.locator("#output").textContent()) ?? ""
  const stats = (await page.locator("#confidence").textContent()) ?? ""
  return { output, stats }
}

test("neural demo renders with the vocalization models in the picker", async ({ page }) => {
  await page.goto("/neural")
  await expect(page.locator("#model option[value='heb-vocalized-plane-3.0']")).toHaveCount(1)
  await expect(page.locator("#model option[value='urd-vocalized-2.0']")).toHaveCount(1)
  await expect(page.locator("#model option[value='heb-vocalized-plane-3.0']")).toHaveAttribute(
    "data-kind",
    "plane",
  )
  // switching models swaps in the conformance example
  await page.selectOption("#model", "urd-vocalized-2.0")
  await expect(page.locator("#input")).toHaveValue(URD_SRC)
  await page.selectOption("#model", "heb-vocalized-plane-3.0")
  await expect(page.locator("#input")).toHaveValue(HEB_SRC)
})

test.describe.configure({ mode: "serial" })

test("heb-vocalized-plane-3.0 reproduces the conformance vector in-browser", async ({ page }) => {
  test.skip(!GATED, "model download gated behind BROWSER_VOCAL_E2E=1")
  test.setTimeout(900_000)
  await page.goto("/neural")
  const t0 = Date.now()
  const { output, stats } = await runModel(page, "heb-vocalized-plane-3.0", "plane")
  expect(output, "Hebrew conformance vector must be byte-exact in the browser").toBe(HEB_OUT)
  const record = {
    model: "heb-vocalized-plane-3.0",
    kind: "plane",
    totalMs: Date.now() - t0,
    stats,
    output,
  }
  mkdirSync("test-results", { recursive: true })
  writeFileSync("test-results/vocal-heb.json", JSON.stringify(record, null, 2))
})

test("urd-vocalized-2.0 reproduces the conformance vector in-browser", async ({ page }) => {
  test.skip(!GATED, "model download gated behind BROWSER_VOCAL_E2E=1")
  test.setTimeout(900_000)
  await page.goto("/neural")
  const t0 = Date.now()
  const { output, stats } = await runModel(page, "urd-vocalized-2.0", "imf")
  expect(output, "Urdu conformance vector must be byte-exact in the browser").toBe(URD_OUT)
  const record = {
    model: "urd-vocalized-2.0",
    kind: "imf",
    totalMs: Date.now() - t0,
    stats,
    output,
  }
  mkdirSync("test-results", { recursive: true })
  writeFileSync("test-results/vocal-urd.json", JSON.stringify(record, null, 2))
})
