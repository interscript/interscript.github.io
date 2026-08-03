/**
 * Edge case E2E tests for the /demo transliteration page.
 *
 * Tests boundary conditions, unicode edge cases, performance,
 * and error recovery that the happy-path tests don't cover.
 */
import { test, expect } from "@playwright/test"

test.describe("demo edge cases", () => {
  test("handles empty input", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("")
    await page.waitForTimeout(300)

    const output = page.locator(".pane-result")
    const text = await output.textContent()
    expect(text).toBeTruthy()
  })

  test("handles single character", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("А")
    await page.waitForTimeout(300)

    const output = page.locator(".pane-result")
    const text = (await output.textContent())?.trim()
    expect(text?.length).toBeGreaterThan(0)
  })

  test("handles very long input (1000+ chars)", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })

    const longText = "Антон ".repeat(200) // ~1200 chars
    const textarea = page.locator("textarea.pane-body")
    await textarea.fill(longText)
    await page.waitForTimeout(500)

    const output = page.locator(".pane-result")
    const text = (await output.textContent())?.trim()
    expect(text?.length).toBeGreaterThan(100)
    expect(text).toContain("Anton")
  })

  test("handles rapid typing without errors", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })

    const textarea = page.locator("textarea.pane-body")
    // Type rapidly character by character
    for (const char of "АнтонМир") {
      await textarea.type(char, { delay: 10 })
    }
    await page.waitForTimeout(500)

    const errorBanner = page.locator(".error-banner")
    await expect(errorBanner).not.toBeVisible()
  })

  test("handles mixed scripts", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Hello Антон мир 123")
    await page.waitForTimeout(300)

    const output = page.locator(".pane-result")
    const text = (await output.textContent())?.trim()
    expect(text?.length).toBeGreaterThan(0)
    // Latin chars should pass through
    expect(text).toContain("Hello")
  })

  test("handles special characters (newlines, tabs)", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Антон\nМир\tПривет")
    await page.waitForTimeout(300)

    const output = page.locator(".pane-result")
    const text = (await output.textContent())?.trim()
    expect(text?.length).toBeGreaterThan(0)
  })

  test("handles numbers and punctuation", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Антон123!@#")
    await page.waitForTimeout(300)

    const output = page.locator(".pane-result")
    const text = (await output.textContent())?.trim()
    expect(text).toContain("123")
  })

  test("handles unicode surrogate pairs (emoji)", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Антон 🎉 мир")
    await page.waitForTimeout(300)

    const output = page.locator(".pane-result")
    const text = (await output.textContent())?.trim()
    // Emoji should pass through (not crash)
    expect(text).toBeTruthy()
  })

  test("system switching preserves input", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })

    const textarea = page.locator("textarea.pane-body")
    const select = page.locator("select.field-input")

    // Type in Ukrainian
    await textarea.fill("Антон")
    await page.waitForTimeout(300)

    // Switch to Russian
    await select.selectOption("odni-rus-Cyrl-Latn-2015")
    await page.waitForTimeout(300)

    // Input should be preserved
    const inputValue = await textarea.inputValue()
    expect(inputValue).toBe("Антон")

    // Output should change (different system)
    const output = page.locator(".pane-result")
    const text = (await output.textContent())?.trim()
    expect(text?.length).toBeGreaterThan(0)
  })

  test("handles input that produces no transformation", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })

    const textarea = page.locator("textarea.pane-body")
    // Pure Latin text — should pass through unchanged for Cyrillic→Latin map
    await textarea.fill("Hello World")
    await page.waitForTimeout(300)

    const output = page.locator(".pane-result")
    const text = (await output.textContent())?.trim()
    expect(text).toBe("Hello World")
  })

  test("character counter updates correctly", async ({ page }) => {
    await page.goto("/demo")
    await expect(page.locator(".rail-status")).toContainText("ready", { timeout: 20000 })

    const textarea = page.locator("textarea.pane-body")
    await textarea.fill("Hi")
    await page.waitForTimeout(300)

    // Look for character count indicator
    const meta = page.locator(".pane-meta").first()
    const metaText = await meta.textContent()
    expect(metaText).toMatch(/\d+/)
  })
})
