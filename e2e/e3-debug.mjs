import { chromium } from "@playwright/test"
const b = await chromium.launch()
const p = await b.newPage()
await p.goto("https://interscript.org/neural", { waitUntil: "networkidle" })
const res = await p.evaluate(async () => {
  try {
    const r = await fetch("https://github.com/interscript/interscript-ml/releases/download/index-v3/models-index.yaml.sha256")
    return `ok ${r.status}`
  } catch (e) { return `FAIL ${e.message} | ${e.cause?.message ?? ""}` }
})
console.log("index fetch:", res)
const same = await p.evaluate(async () => {
  try { const r = await fetch("/v1/info"); return `ok ${r.status}` } catch (e) { return `FAIL ${e.message}` }
})
console.log("same-origin:", same)
await b.close()
