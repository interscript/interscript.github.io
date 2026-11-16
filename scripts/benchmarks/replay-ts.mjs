#!/usr/bin/env node
// Transliteration replay (ts leg): execute every row of a jsonl row
// set ({map, src, out}) through the engine, in-process, RUNS runs.
// Corpus preload is setup (unmeasured); only the transliteration loop
// is timed. Reports rows/sec and the exact-match count.
//
// Usage: node replay-ts.mjs <ts_dist_dir> <maps_dir> <libs_dir> <rows.jsonl>

import { readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const [distDir, mapsDir, libsDir, rowsPath] = process.argv.slice(2)
const RUNS = 3

const { configure, transliterate } = await import(resolve(distDir, "index.js"))
const { iscBundledStrategy } = await import(resolve(distDir, "isc", "loader.js"))

const rows = readFileSync(rowsPath, "utf8")
  .split("\n")
  .filter((l) => l.trim().length > 0)
  .map((l) => JSON.parse(l))
if (rows.length === 0) throw new Error(`no rows in ${rowsPath}`)

// Setup (unmeasured): preload the corpus into the bundled strategy.
const sources = {}
for (const dir of [libsDir, mapsDir]) {
  try {
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".isc"))) {
      sources[f.replace(/\.isc$/, "")] = readFileSync(resolve(dir, f), "utf8")
    }
  } catch {
    // absent dir (no libs) — skip
  }
}
configure({ strategies: [iscBundledStrategy(sources)] })

// Unmeasured warmup pass (per-map lazy compilation settles here).
for (const row of rows) {
  try {
    transliterate(row.map, row.src)
  } catch {
    // unexecutable rows are simply non-matching
  }
}

for (let run = 0; run < RUNS; run++) {
  let matched = 0
  let errors = 0
  const t0 = performance.now()
  for (const row of rows) {
    let got
    try {
      got = transliterate(row.map, row.src)
    } catch {
      errors++
      continue
    }
    if (got === row.out) matched++
  }
  const t1 = performance.now()
  const ms = t1 - t0
  console.log(
    `ts replay ${matched}/${rows.length} rows in ${ms.toFixed(1)} ms (${Math.round(rows.length / (ms / 1000))} rows/s)`,
  )
  const divergent = rows.length - matched - errors
  if (divergent > 0 || errors > 0) {
    console.error(`divergent ${divergent} exec_errors ${errors}`)
  }
}
