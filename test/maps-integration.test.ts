/**
 * Integration test: confirm the bundled IR maps can be loaded by
 * interscript-ts and produce expected outputs. This guards against
 * regressions in either the site's bundled maps or the runtime.
 */

import { describe, it, expect } from "vitest"
import { readdirSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import {
  configure,
  reset,
  transliterate,
  bundledStrategy,
  parseIsc,
  iscBundledStrategy,
  type IscDocument,
} from "interscript-ts"

const MAPS_DIR = resolve(process.cwd(), "public/maps")

function loadAllMaps(): Record<string, IscDocument> {
  const maps: Record<string, IscDocument> = {}
  for (const file of readdirSync(MAPS_DIR)) {
    if (!file.endsWith(".isc")) continue
    const code = file.replace(/\.isc$/, "")
    maps[code] = parseIsc(readFileSync(resolve(MAPS_DIR, file), "utf8"), file)
  }
  return maps
}

function iscSources(): Record<string, string> {
  const sources: Record<string, string> = {}
  for (const file of readdirSync(MAPS_DIR)) {
    if (!file.endsWith(".isc")) continue
    sources[file.replace(/\.isc$/, "")] = readFileSync(resolve(MAPS_DIR, file), "utf8")
  }
  return sources
}

// The .iml libraries (posix/unicode/var-*) have no ISC form; they ship
// as the only remaining compiled JSON maps.
function libJsons(): Record<string, unknown> {
  const maps: Record<string, unknown> = {}
  for (const file of readdirSync(MAPS_DIR)) {
    if (!file.endsWith(".json")) continue
    const code = file.replace(/\.json$/, "")
    maps[code] = JSON.parse(readFileSync(resolve(MAPS_DIR, file), "utf8"))
  }
  return maps
}

function iscStrategies() {
  return [iscBundledStrategy(iscSources()), bundledStrategy(libJsons())]
}

function iscCode(doc: IscDocument): string {
  const m = doc.metadata as Record<string, unknown>
  const lang = String(m["language"]).split(":").pop()
  return [m["authority_id"], lang, m["source_script"], m["destination_script"], m["id"]].join("-")
}

describe("bundled maps integration", { timeout: 120_000 }, () => {
  it("loads every map in public/maps", () => {
    const maps = loadAllMaps()
    expect(Object.keys(maps).length).toBeGreaterThan(5)
  })

  it("every ISC document parses with a matching system code", () => {
    const maps = loadAllMaps()
    for (const [code, doc] of Object.entries(maps)) {
      expect(iscCode(doc), `${code} systemCode`).toBe(code)
    }
  })

  it("every map has at least one stage", () => {
    const maps = loadAllMaps()
    for (const [code, doc] of Object.entries(maps)) {
      expect(doc.stages, `${code} stages`).toBeDefined()
      expect(doc.stages.length, `${code} stages count`).toBeGreaterThan(0)
    }
  })

  it("bgnpcgn-ukr produces expected output", () => {
    reset()
    configure({ strategies: iscStrategies() })
    expect(transliterate("bgnpcgn-ukr-Cyrl-Latn-2019", "Антон")).toBe("Anton")
  })

  it("bgnpcgn-deu produces expected output", () => {
    reset()
    configure({ strategies: iscStrategies() })
    expect(transliterate("bgnpcgn-deu-Latn-Latn-2000", "Tschüß!")).toBe("Tschueß!")
  })

  it("odni-rus produces expected output (single word)", () => {
    reset()
    configure({ strategies: iscStrategies() })
    expect(transliterate("odni-rus-Cyrl-Latn-2015", "привет")).toBe("privet")
  })

  it("transliterates a sample across multiple scripts without errors", () => {
    reset()
    configure({ strategies: iscStrategies() })
    const samples: Array<[string, string]> = [
      ["bgnpcgn-ukr-Cyrl-Latn-2019", "Київ"],
      ["alalc-amh-Ethi-Latn-2011", "ኢትዮጵያ"],
      ["un-tam-Taml-Latn-1972", "தமிழ்"],
      ["din-grc-Grek-Latn-31634-2011-t1", "Αθήνα"],
      ["bgnpcgn-ara-Arab-Latn-1956", "القاهرة"],
    ]
    for (const [code, input] of samples) {
      const out = transliterate(code, input)
      expect(out.length, `${code} output`).toBeGreaterThan(0)
      expect(out, `${code} should not equal input`).not.toBe(input)
    }
  })

  it("ISC engine reproduces each map's own test vectors", () => {
    // Regeneration guard: the shipped .isc sources must stay
    // self-consistent — their embedded test vectors must pass.
    const maps = loadAllMaps()
    let checked = 0
    for (const [code, doc] of Object.entries(maps)) {
      if (code.includes("rababa")) continue // neural model proxy, no vectors
      for (const t of doc.tests.slice(0, 3)) {
        expect(transliterate(code, t.input), `${code}: ${t.input}`).toBe(t.expected)
        checked++
      }
      if (checked > 200) break
    }
    expect(checked).toBeGreaterThan(50)
  })
})
