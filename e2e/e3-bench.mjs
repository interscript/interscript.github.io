// E3: browser-tier benchmark through the LIVE /neural page (paper C).
import { chromium } from "@playwright/test"

const URL = "https://interscript.org/neural"
const MODEL = "tha-g2p-small-1.0" // smallest tier for a headless-runnable pass
const browser = await chromium.launch()
const page = await browser.newPage()

const t0 = Date.now()
await page.goto(URL, { waitUntil: "networkidle" })
console.log(`page load: ${Date.now() - t0} ms`)

await page.selectOption("#model", MODEL)
await page.evaluate(() => caches.keys().then((k) => Promise.all(k.map((n) => caches.delete(n)))))
for (const pass of ["cold", "warm"]) {
  const t1 = Date.now()
  await page.click("#run")
  await page.waitForFunction(() => document.getElementById("output").textContent.length > 0, null, { timeout: 600000 })
  const out = await page.textContent("#output")
  console.log(`${pass} resolve+session+decode: ${Date.now() - t1} ms (out ${out.length}B)`)
  if (pass === "cold") await page.click("#clear-cache")
}
await browser.close()
