/**
 * Worker-mode guarantee: the package runs inside a Web Worker — the
 * architecture every browser runtime entry point uses to keep
 * conversions off the main thread. Imports via the CDN recipe pinned
 * in interscript-ts/docs/CDN.md, so each CI run re-proves that recipe
 * too.
 */
import { test, expect } from "@playwright/test"

const CDN = "https://esm.sh/interscript@5.3.0"

const WORKER_SOURCE = `
  self.onmessage = async (event) => {
    try {
      const { configure, iscStrategy, transliterateAsync } = await import("${CDN}")
      configure({
        strategies: [iscStrategy({ baseUrl: "https://interscript.org/maps" })],
      })
      const output = await transliterateAsync("bgnpcgn-ukr-Cyrl-Latn-2019", event.data)
      self.postMessage({ ok: true, output })
    } catch (error) {
      self.postMessage({ ok: false, error: String(error) })
    }
  }
`

test("the library converts inside a Web Worker via the CDN recipe", async ({ page }) => {
  await page.goto("/")
  const result = await page.evaluate(
    async ({ source, input }) => {
      const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }))
      const worker = new Worker(url, { type: "module" })
      try {
        return await new Promise((resolve) => {
          worker.onmessage = (event) => resolve(event.data)
          worker.postMessage(input)
        })
      } finally {
        worker.terminate()
        URL.revokeObjectURL(url)
      }
    },
    { source: WORKER_SOURCE, input: "Антон Олегович" },
  )
  expect(result.ok).toBe(true)
  expect(result.output).toBe("Anton Olehovych")
})
