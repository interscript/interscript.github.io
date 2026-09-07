// Playground — the two-layer stack client-side: golden path runs a real
// authority system through the worker (no model download in CI).
import { expect, test } from "@playwright/test"

test("playground runs a deterministic system end-to-end", async ({ page }) => {
  await page.goto("/playground")
  await expect(page.getByRole("heading", { name: "Playground" })).toBeVisible()
  await page.fill("#input", "Антон Павлович Чехов")
  await page.fill("#filter", "bgnpcgn-rus")
  await page.selectOption("#system", { index: 0 })
  await page.click("#run")
  const out = page.locator("#output")
  await expect(out).not.toBeEmpty({ timeout: 30_000 })
  await expect(out).toContainText("Anton")
  // shareable URL carries the state
  await expect(page).toHaveURL(/sys=bgnpcgn-rus/)
  // the snippet mirrors the selected system
  await expect(page.locator("#snippet")).toContainText("transliterateAsync")
})

test("filter narrows the system list", async ({ page }) => {
  await page.goto("/playground")
  await page.fill("#filter", "Thai")
  const first = await page.locator("#system option").first().textContent()
  expect(first).toBeTruthy()
  const count = await page.locator("#system option").count()
  expect(count).toBeLessThan(50)
})
