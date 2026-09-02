// /neural demo — plumbing assertions (no model download: UI + error surfaces).
import { expect, test } from "@playwright/test"

test("neural demo renders controls and surfaces errors with causes", async ({ page }) => {
  await page.goto("/neural")
  await expect(page.getByRole("heading", { name: "Neural models demo" })).toBeVisible()
  await expect(page.locator("#model")).toHaveValue(/ara-diac-small/)
  await expect(page.locator("#run")).toBeEnabled()
  // An unknown model id yields a RegistryError surfaced with its cause chain.
  await page.selectOption("#model", "ara-diac-small-2.0-int8")
  await page.evaluate(() => {
    const s = document.getElementById("model")! as HTMLSelectElement
    s.value = "nope-9.9"
  })
  await page.click("#run")
  await expect(page.locator("#output")).toContainText(/unknown model id|Error/, { timeout: 60_000 })
})

test("clear-cache reports state", async ({ page }) => {
  await page.goto("/neural")
  await page.click("#clear-cache")
  await expect(page.locator("#confidence")).toContainText(/cleared/i)
})
