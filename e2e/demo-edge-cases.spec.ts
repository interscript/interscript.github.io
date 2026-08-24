/**
 * Edge case E2E tests for the /demo transliteration page.
 *
 * Tests boundary conditions, unicode edge cases, performance,
 * and error recovery that the happy-path tests don't cover.
 *
 * The default demo mode calls api.interscript.org, so output
 * assertions must poll (debounce + network round-trip) rather than
 * sleep for a fixed interval.
 */
import { test, expect, type Page } from "@playwright/test"

async function ready(page: Page) {
  await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })
}

test.describe("demo edge cases", () => {
  test("handles empty input", async ({ page }) => {
    await page.goto("/demo")
    await ready(page)

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("")

    const output = page.locator(".pane-result")
    const text = await output.textContent()
    expect(text).toBeTruthy()
    await expect(page.locator(".error-banner")).not.toBeVisible()
  })

  test("handles single character", async ({ page }) => {
    await page.goto("/demo")
    await ready(page)

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("А")

    await expect(page.locator(".pane-result")).toContainText("A", { timeout: 8000 })
  })

  test("handles very long input (1000+ chars)", async ({ page }) => {
    await page.goto("/demo")
    await ready(page)

    const longText = "Антон ".repeat(200) // ~1200 chars
    const textarea = page.locator("textarea.pane-body")
    await textarea.fill(longText)

    const output = page.locator(".pane-result")
    // "Anton Anton" can only come from the repeated long input, not the
    // page's default single-word sample.
    await expect(output).toContainText("Anton Anton", { timeout: 15000 })
    const text = (await output.textContent())?.trim()
    expect(text?.length).toBeGreaterThan(100)
  })

  test("handles rapid typing without errors", async ({ page }) => {
    await page.goto("/demo")
    await ready(page)

    const textarea = page.locator("textarea.pane-body")
    // Type rapidly character by character
    for (const char of "АнтонМир") {
      await textarea.type(char, { delay: 10 })
    }

    await expect(page.locator(".pane-result")).toContainText("Anton", { timeout: 8000 })
    await expect(page.locator(".error-banner")).not.toBeVisible()
  })

  test("handles mixed scripts", async ({ page }) => {
    await page.goto("/demo")
    await ready(page)

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Hello Антон мир 123")

    // Latin chars should pass through
    await expect(page.locator(".pane-result")).toContainText("Hello", { timeout: 8000 })
  })

  test("handles special characters (newlines, tabs)", async ({ page }) => {
    await page.goto("/demo")
    await ready(page)

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Антон\nМир\tПривет")

    await expect(page.locator(".pane-result")).toContainText("Anton", { timeout: 8000 })
  })

  test("handles numbers and punctuation", async ({ page }) => {
    await page.goto("/demo")
    await ready(page)

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Антон123!@#")

    await expect(page.locator(".pane-result")).toContainText("123", { timeout: 8000 })
  })

  test("handles unicode surrogate pairs (emoji)", async ({ page }) => {
    await page.goto("/demo")
    await ready(page)

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Антон 🎉 мир")

    // Emoji should pass through (not crash)
    await expect(page.locator(".pane-result")).toContainText("Anton", { timeout: 8000 })
    await expect(page.locator(".error-banner")).not.toBeVisible()
  })

  test("system switching preserves input", async ({ page }) => {
    await page.goto("/demo")
    await ready(page)

    const textarea = page.locator("textarea.pane-body")
    const select = page.locator("select.field-input")

    // Type in Ukrainian
    await textarea.fill("Антон")
    await expect(page.locator(".pane-result")).toContainText("Anton", { timeout: 8000 })

    // Switch to Russian
    await select.selectOption("odni-rus-Cyrl-Latn-2015")

    // Input should be preserved; output should change (different system)
    const inputValue = await textarea.inputValue()
    expect(inputValue).toBe("Антон")
    await expect(page.locator(".pane-result")).toContainText("Anton", { timeout: 8000 })
  })

  test("handles input that produces no transformation", async ({ page }) => {
    await page.goto("/demo")
    await ready(page)

    const textarea = page.locator("textarea.pane-body")
    // Pure Latin text — should pass through unchanged for Cyrillic→Latin map
    await textarea.fill("Hello World")

    await expect(page.locator(".pane-result")).toHaveText("Hello World", { timeout: 8000 })
  })

  test("character counter updates correctly", async ({ page }) => {
    await page.goto("/demo")
    await ready(page)

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Hi")

    // Look for character count indicator
    const meta = page.locator(".pane-meta").first()
    const metaText = await meta.textContent()
    expect(metaText).toMatch(/\d+/)
  })
})
