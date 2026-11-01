/**
 * Regenerate `src/data/models-catalogue.json` from the model registry
 * (interscript-models/models.yaml). Run: `npm run generate:models`.
 */

import { readFileSync, writeFileSync } from "node:fs"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import yaml from "js-yaml"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const REGISTRY = resolve(ROOT, "..", "interscript-models", "models.yaml")
const OUT_PATH = join(ROOT, "src", "data", "models-catalogue.json")

const METRIC_ORDER = [
  "der_total_greedy", "der_morph_greedy", "der_teacher_greedy",
  "der_teacher_fullset", "wer_wikinews2024_multiref", "wer_wikinews_multiref",
  "cer", "per", "em",
]

function humanSize(bytes) {
  if (!bytes) return ""
  const gib = bytes / 2 ** 30
  if (gib >= 1) return `${gib.toFixed(1)} GiB`
  return `${(bytes / 2 ** 20).toFixed(0)} MiB`
}

function releaseTag(entry, id) {
  const first = (entry.parts || [])[0]
  if (first && first.url) {
    const m = first.url.match(/releases\/download\/([^/]+)\//)
    if (m) return m[1]
  }
  const alias = (entry.aliases || [])[0]
  return alias || id
}

function main() {
  const registry = yaml.load(readFileSync(REGISTRY, "utf8"))
  const out = {}
  for (const [id, e] of Object.entries(registry.models || {})) {
    const metrics = (e.metrics || []).map((m) => ({
      name: m.name,
      value: m.value,
    }))
    metrics.sort(
      (a, b) =>
        (METRIC_ORDER.indexOf(a.name) + 1 || 99) -
        (METRIC_ORDER.indexOf(b.name) + 1 || 99),
    )
    out[id] = {
      id,
      task: e.task || "",
      scripts: e.scripts || [],
      precision: e.precision || "",
      size: e.size || 0,
      sizeHuman: humanSize(e.size),
      splitParts: (e.parts || []).length || null,
      filename: e.filename || "",
      releaseTag: releaseTag(e, id),
      releaseUrl: `https://github.com/interscript/interscript-models/releases/tag/${releaseTag(e, id)}`,
      metrics,
      license: e.license || "",
      paritySamples: e.parity ? e.parity.samples : null,
    }
  }
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf8")
  console.log(`Generated models catalogue: ${Object.keys(out).length} models → ${OUT_PATH}`)
}

main()
