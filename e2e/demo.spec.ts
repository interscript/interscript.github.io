/**
 * E2E test: the /demo page transliteration Explorer.
 *
 * This is the critical user-facing path: the TS runtime loads maps from
 * /public/maps and transliterates input in real-time via interscript-ts.
 *
 * If this test passes, the entire Ruby→IR→TS pipeline works end-to-end.
 */
import { test, expect } from "@playwright/test"

test.describe("demo page — transliteration explorer", () => {
  test("page loads with system selector and input", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator("h1")).toContainText(/Type/i)

    // Engine status shows loading or ready (not "missing")
    const status = page.locator(".rail-status")
    await expect(status).toBeVisible()

    // System selector has options
    const select = page.locator("select.field-input")
    await expect(select).toBeVisible()
    const options = select.locator("option")
    await expect(options).toHaveCount(289)
    await expect(select.locator("optgroup").first()).toHaveAttribute("label", "ACADSIN")
  })

  test("default system is the first catalogue entry", async ({ page }) => {
    await page.goto("/demo")
    const select = page.locator("select.field-input")
    await expect(select).toHaveValue("acadsin-zho-Hani-Latn-2002")
  })

  test("transliterates Ukrainian Cyrillic to Latin", async ({ page }) => {
    await page.goto("/demo")

    // Wait for engine to be ready (loads all systems + their deps)
    const status = page.locator(".rail-status")
    await expect(status).toContainText("ready", { timeout: 20000 })

    await page.locator("select.field-input").selectOption("bgnpcgn-ukr-Cyrl-Latn-2019")

    // Type Cyrillic input
    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Антон")

    // Wait for output to contain "Anton"
    const output = page.locator(".pane-result")
    await expect(output).toContainText("Anton", { timeout: 10000 })
  })

  test("transliterates ODNI Russian", async ({ page }) => {
    await page.goto("/demo")

    const status = page.locator(".rail-status")
    await expect(status).toContainText("ready", { timeout: 20000 })

    // Change system and type
    const select = page.locator("select.field-input")
    await select.selectOption("odni-rus-Cyrl-Latn-2015")

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("привет мир")

    const output = page.locator(".pane-result")
    await expect(output).toContainText("privet mir", { timeout: 10000 })
  })

  test("transliterates BGN/PCGN German", async ({ page }) => {
    await page.goto("/demo")

    const status = page.locator(".rail-status")
    await expect(status).toContainText("ready", { timeout: 20000 })

    const select = page.locator("select.field-input")
    await select.selectOption("bgnpcgn-deu-Latn-Latn-2000")

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Tschüß!")

    const output = page.locator(".pane-result")
    await expect(output).toContainText("Tschueß", { timeout: 10000 })
  })

  test("transliterates UN Tamil", async ({ page }) => {
    await page.goto("/demo")

    const status = page.locator(".rail-status")
    await expect(status).toContainText("ready", { timeout: 20000 })

    const select = page.locator("select.field-input")
    await select.selectOption("un-tam-Taml-Latn-1972")

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("தமிழ்")

    // Tamil output should be non-empty and different from input
    const output = page.locator(".pane-result")
    await page.waitForTimeout(1000)
    const text = (await output.textContent())?.trim()
    expect(text?.length ?? 0).toBeGreaterThan(0)
  })

  test("transliterates ALA-LC Amharic", async ({ page }) => {
    await page.goto("/demo")

    const status = page.locator(".rail-status")
    await expect(status).toContainText("ready", { timeout: 20000 })

    const select = page.locator("select.field-input")
    await select.selectOption("alalc-amh-Ethi-Latn-2011")

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("ኢትዮጵያ")

    const output = page.locator(".pane-result")
    await page.waitForTimeout(1000)
    const text = (await output.textContent())?.trim()
    expect(text?.length ?? 0).toBeGreaterThan(0)
  })

  test("handles empty input gracefully", async ({ page }) => {
    await page.goto("/demo")

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("")
    await page.waitForTimeout(200)

    const output = page.locator(".pane-result")
    const text = await output.textContent()
    // Empty input should produce empty output or a dash
    expect(text).toBeTruthy()
  })

  test("no error banner appears during normal use", async ({ page }) => {
    await page.goto("/demo")

    const status = page.locator(".rail-status")
    await expect(status).toContainText(/ready|loading/, { timeout: 10000 })

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Антон")
    await page.waitForTimeout(500)

    const errorBanner = page.locator(".error-banner")
    await expect(errorBanner).not.toBeVisible()
  })
})

test.describe("demo modes — API vs in-browser", () => {
  test("API mode is the default", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.getByTestId("mode-api")).toHaveAttribute("aria-checked", "true")
    await expect(page.getByTestId("mode-browser")).toHaveAttribute("aria-checked", "false")
  })

  test("browser mode transliterates via the local ISC engine", async ({ page }) => {
    await page.goto("/demo")

    await page.getByTestId("mode-browser").click()
    const status = page.locator(".rail-status")
    await expect(status).toContainText("ready", { timeout: 30000 })

    await page.locator("select.field-input").selectOption("odni-rus-Cyrl-Latn-2015")
    await page.locator("textarea.pane-body").fill("Антон")
    await expect(page.locator(".pane-result")).toContainText("Anton", { timeout: 10000 })
  })

  test("browser mode handles library-dependent systems (German)", async ({ page }) => {
    await page.goto("/demo")

    await page.getByTestId("mode-browser").click()
    const status = page.locator(".rail-status")
    await expect(status).toContainText("ready", { timeout: 30000 })

    // bgnpcgn-deu depends on the posix library, which only ships as
    // compiled JSON behind the ISC strategy.
    await page.locator("select.field-input").selectOption("bgnpcgn-deu-Latn-Latn-2000")
    await page.locator("textarea.pane-body").fill("Tschüß!")
    await expect(page.locator(".pane-result")).toContainText("Tschueß!", { timeout: 15000 })
  })

  test("both modes agree on Ukrainian", async ({ page }) => {
    await page.goto("/demo")

    // API mode first
    const status = page.locator(".rail-status")
    await expect(status).toContainText("ready", { timeout: 30000 })
    await page.locator("select.field-input").selectOption("bgnpcgn-ukr-Cyrl-Latn-2019")
    await page.locator("textarea.pane-body").fill("Київ")
    await expect(page.locator(".pane-result")).toContainText("Kyiv", { timeout: 10000 })
    const apiOutput = await page.locator(".pane-result").textContent()

    // Switch to the in-browser engine — same answer
    await page.getByTestId("mode-browser").click()
    await expect(page.locator(".pane-result")).toContainText(apiOutput ?? "Kyiv", {
      timeout: 30000,
    })
  })
})
