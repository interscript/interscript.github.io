/**
 * Regenerate `src/data/maps-catalogue.json` from `.isc` source files.
 *
 * Run via: `npm run generate:catalogue` (uses tsx for TypeScript import).
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { parseIsc } from "interscript"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const MAPS_DIR = resolve(ROOT, "..", "maps", "maps")
const OUT_PATH = join(ROOT, "src", "data", "maps-catalogue.json")

function firstString(value) {
  if (value === null || value === undefined) return ""
  return String(value)
}

function buildEntry(doc) {
  const meta = doc.metadata
  const firstTest = doc.tests[0]
  return {
    class: "Interscript::Node::MetaData",
    data: {
      authority_id: firstString(meta.authority_id),
      id: firstString(meta.id),
      language: firstString(meta.language),
      source_script: firstString(meta.source_script),
      destination_script: firstString(meta.destination_script),
      name: firstString(meta.name),
      description: firstString(meta.description),
      url: firstString(meta.url),
      creation_date: firstString(meta.creation_date),
      nonstandard: {},
    },
    test: firstTest ? [firstTest.input, firstTest.expected, null] : [null, null, null],
    skip_js: false,
  }
}

function main() {
  const files = readdirSync(MAPS_DIR)
    .filter((f) => f.endsWith(".isc"))
    .sort()
  const catalogue = {}
  let okCount = 0
  const errors = []
  for (const f of files) {
    const code = f.replace(/\.isc$/, "")
    try {
      const src = readFileSync(join(MAPS_DIR, f), "utf8")
      const doc = parseIsc(src, f)
      catalogue[code] = buildEntry(doc)
      okCount++
    } catch (e) {
      errors.push(`${f}: ${e.message}`)
    }
  }
  writeFileSync(OUT_PATH, JSON.stringify(catalogue, null, 2) + "\n", "utf8")
  console.log(`Generated catalogue: ${okCount}/${files.length} maps → ${OUT_PATH}`)
  if (errors.length > 0) {
    console.error("Errors:")
    for (const e of errors) console.error(`  ${e}`)
    process.exit(1)
  }
}

main()
