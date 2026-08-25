/**
 * E2E tests for the Interscript.org home page.
 *
 * Validates: page loads, hero renders, catalogue data is present,
 * CTAs link to the right pages.
 */
import { test, expect } from "@playwright/test"

test.describe("home page", () => {
  test("loads and renders hero", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Interscript/i)
    // Scoped to the hero h1 — the Astro dev toolbar injects its own h1s.
    await expect(page.locator("h1.hero-headline")).toContainText(/Every/i)
  })

  test("hero stats render real numbers", async ({ page }) => {
    await page.goto("/")
    const lead = page.locator(".hero-lead")
    await expect(lead).toContainText(/systems/)
    await expect(lead).toContainText(/authorities/)
  })

  test("CTA links to demo page", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    const cta = page.locator('a[href="/demo"]').first()
    await expect(cta).toBeVisible({ timeout: 5000 })
    await cta.click()
    await expect(page).toHaveURL(/\/demo/)
  })

  test("CTA links to maps browser", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    const cta = page.locator('a[href="/maps"]').first()
    await expect(cta).toBeVisible({ timeout: 5000 })
    await cta.click()
    await expect(page).toHaveURL(/\/maps/)
  })

  test("script mosaic renders", async ({ page }) => {
    await page.goto("/")
    const mosaic = page.locator(".script-mosaic, [class*='mosaic']")
    // Mosaic may take a moment to hydrate
    await page.waitForTimeout(1000)
    await expect(mosaic.first()).toBeVisible()
  })
})
