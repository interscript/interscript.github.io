#!/usr/bin/env node
// Corpus parse timing (ts leg): parseIsc over every corpus .isc,
// in-process, RUNS runs. Methodology follows maps/docs/parity/README.md
// §A.8 (median-of-3, clean serial runs).
//
// Usage: node parse-ts.mjs <ts_dist_dir> <maps_dir>

import { readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const [distDir, mapsDir] = process.argv.slice(2)
const RUNS = 3

const { parseIsc } = await import(resolve(distDir, "isc", "index.js"))

const files = readdirSync(mapsDir)
  .filter((f) => f.endsWith(".isc"))
  .sort()
if (files.length === 0) throw new Error(`no .isc files under ${mapsDir}`)

for (let run = 0; run < RUNS; run++) {
  const t0 = performance.now()
  let ok = 0
  for (const f of files) {
    try {
      parseIsc(readFileSync(resolve(mapsDir, f), "utf8"), f)
      ok++
    } catch (e) {
      console.error(`FAIL ${f}: ${String(e.message).split("\n")[0]}`)
    }
  }
  const t1 = performance.now()
  console.log(`ts parse ${ok}/${files.length} maps in ${(t1 - t0).toFixed(1)} ms`)
}
