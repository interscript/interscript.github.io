#!/usr/bin/env node
// Regenerate the transliteration benchmark fixture: a deterministic
// fixed input set sampled from the interscript-rs golden capture
// (every Nth row). The fixture is committed and stays FIXED across
// benchmark runs so the throughput series is comparable over time even
// as the golden itself evolves.
//
// Usage: node make-fixture.mjs [--stride 25]
// Writes: fixtures/input-set.jsonl (do not hand-edit)

import { createHash } from "node:crypto"
import { readFileSync, writeFileSync } from "node:fs"
import { GOLDEN_JSONL, FIXTURE } from "./config.mjs"

const stride = (() => {
  const i = process.argv.indexOf("--stride")
  return i === -1 ? 25 : Number(process.argv[i + 1])
})()

const lines = readFileSync(GOLDEN_JSONL(), "utf8")
  .split("\n")
  .filter((l) => l.trim().length > 0)
const sampled = lines.filter((_, i) => i % stride === 0)

const sha = createHash("sha256").update(readFileSync(GOLDEN_JSONL())).digest("hex")

// Pure jsonl (no comment header) so every replay driver can consume it
// directly; provenance lives in README.md and the generated
// benchmarks.json.
writeFileSync(FIXTURE, sampled.join("\n") + "\n")
console.log(
  `fixture: ${sampled.length} rows (every ${stride}th of ${lines.length} golden rows, golden sha256 ${sha.slice(0, 16)}…) -> ${FIXTURE}`,
)
