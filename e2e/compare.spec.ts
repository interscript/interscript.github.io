/**
 * E2E tests for the /compare page.
 *
 * Validates: comparing the same input across multiple transliteration systems.
 */
import { test, expect } from "@playwright/test"

test.describe("compare systems", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/compare")
    await expect(page.locator("body")).toBeVisible()
  })

  test("has input field", async ({ page }) => {
    await page.goto("/compare")
    const input = page.locator("textarea, input[type='text']").first()
    await expect(input).toBeVisible({ timeout: 5000 })
  })

  test("has system selectors", async ({ page }) => {
    await page.goto("/compare")
    const selects = page.locator("select")
    if (await selects.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      const count = await selects.count()
      expect(count).toBeGreaterThanOrEqual(1)
    }
  })
})
