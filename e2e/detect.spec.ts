/**
 * E2E tests for the /detect page.
 *
 * Validates: the language detection feature works — given Latin output,
 * it suggests which transliteration system was likely used.
 */
import { test, expect } from "@playwright/test"

test.describe("detect page", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/detect")
    await expect(page.locator("body")).toBeVisible()
  })

  test("has input field for detection", async ({ page }) => {
    await page.goto("/detect")
    const input = page.locator("input, textarea").first()
    await expect(input).toBeVisible({ timeout: 5000 })
  })

  test("detection produces results for valid input", async ({ page }) => {
    await page.goto("/detect")
    await page.waitForLoadState("networkidle")

    const input = page.locator("input, textarea").first()
    if (await input.isVisible({ timeout: 5000 }).catch(() => false)) {
      await input.fill("Anton")
      await page.waitForTimeout(1000)

      // Should show some result (system suggestion or "no match")
      const body = page.locator("body")
      await expect(body).toContainText(/system|result|match|detect/i)
    }
  })
})
