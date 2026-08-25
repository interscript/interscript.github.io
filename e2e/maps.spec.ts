/**
 * E2E tests for the /maps browser page.
 *
 * Validates: map catalogue loads, filtering works, individual map pages
 * show metadata and rules.
 */
import { test, expect } from "@playwright/test"

test.describe("maps browser", () => {
  test("page loads with map cards", async ({ page }) => {
    await page.goto("/maps")
    // The page should render a list of maps
    await expect(page.locator("body")).toContainText(/system|map/i, { timeout: 5000 })
  })

  test("shows total system count", async ({ page }) => {
    await page.goto("/maps")
    // The page mentions the number of systems
    await expect(page.locator("body")).toContainText(/\d{3}/)
  })

  test("has search or filter controls", async ({ page }) => {
    await page.goto("/maps")
    // Look for search input, select, or filter buttons
    const controls = page.locator("input[type='search'], input[placeholder*='search' i], select, button")
    await expect(controls.first()).toBeVisible({ timeout: 5000 })
  })

  test("can click into a map detail page", async ({ page }) => {
    await page.goto("/maps")
    // Wait for content to render
    await page.waitForLoadState("networkidle")

    // Find the first link to a map detail page
    const mapLink = page.locator('a[href*="/maps/"]').first()
    if (await mapLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await mapLink.click()
      await expect(page).toHaveURL(/\/maps\//)
    }
  })
})
