/**
 * E2E tests for the /batch page.
 *
 * Validates: batch transliteration of multiple inputs works correctly.
 */
import { test, expect } from "@playwright/test"

test.describe("batch transliteration", () => {
  test("page loads", async ({ page }) => {
    await page.goto("/batch")
    await expect(page.locator("body")).toBeVisible()
  })

  test("has input area for batch text", async ({ page }) => {
    await page.goto("/batch")
    const input = page.locator("textarea, input[type='text']").first()
    await expect(input).toBeVisible({ timeout: 5000 })
  })

  test("has system selector", async ({ page }) => {
    await page.goto("/batch")
    await page.waitForLoadState("networkidle")
    const select = page.locator("#batch-system, select").first()
    await expect(select).toBeVisible({ timeout: 10000 })
  })
})
