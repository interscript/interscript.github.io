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
} from "interscript-ts"

const MAPS_DIR = resolve(process.cwd(), "public/maps")

function loadAllMaps(): Record<string, unknown> {
  const maps: Record<string, unknown> = {}
  for (const file of readdirSync(MAPS_DIR)) {
    if (!file.endsWith(".json")) continue
    const code = file.replace(/\.json$/, "")
    maps[code] = JSON.parse(readFileSync(resolve(MAPS_DIR, file), "utf8"))
  }
  return maps
}

describe("bundled maps integration", () => {
  it("loads every map in public/maps", () => {
    const maps = loadAllMaps()
    expect(Object.keys(maps).length).toBeGreaterThan(5)
  })

  it("every map JSON parses with the expected schemaVersion", () => {
    const maps = loadAllMaps()
    for (const [code, raw] of Object.entries(maps)) {
      const m = raw as { schemaVersion?: number; systemCode?: string }
      expect(m.schemaVersion, `${code} schemaVersion`).toBe(1)
      expect(m.systemCode, `${code} systemCode`).toBe(code)
    }
  })

  it("every non-library map has at least one stage", () => {
    const maps = loadAllMaps()
    const skipLibraries = new Set(["posix", "unicode", "var-Cyrl", "var-kor"])
    for (const [code, raw] of Object.entries(maps)) {
      if (skipLibraries.has(code)) continue
      const m = raw as { stages?: unknown[] }
      expect(m.stages, `${code} stages`).toBeDefined()
      expect(m.stages!.length, `${code} stages count`).toBeGreaterThan(0)
    }
  })

  it("bgnpcgn-ukr produces expected output", () => {
    reset()
    configure({ strategies: [bundledStrategy(loadAllMaps())] })
    expect(transliterate("bgnpcgn-ukr-Cyrl-Latn-2019", "Антон")).toBe("Anton")
  })

  it("bgnpcgn-deu produces expected output", () => {
    reset()
    configure({ strategies: [bundledStrategy(loadAllMaps())] })
    expect(transliterate("bgnpcgn-deu-Latn-Latn-2000", "Tschüß!")).toBe("Tschueß!")
  })

  it("odni-rus produces expected output (single word)", () => {
    reset()
    configure({ strategies: [bundledStrategy(loadAllMaps())] })
    expect(transliterate("odni-rus-Cyrl-Latn-2015", "привет")).toBe("privet")
  })

  it("transliterates a sample across multiple scripts without errors", () => {
    reset()
    configure({ strategies: [bundledStrategy(loadAllMaps())] })
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

  it("preserves the any_char_class optimisation across regeneration", () => {
    // After the JsonIR fix, ranges like 'a'..'z' should be serialised
    // as any_char_class, not expanded into 26 string alternatives.
    const maps = loadAllMaps()
    const per = maps["bgnpcgn-per-Arab-Latn-1958"] as {
      stages: Array<{ rules: Array<{ from?: { kind: string } }> }>
    }
    expect(per).toBeDefined()
    const main = per.stages.find((s) => s.name === "main")!
    const hasAnyCharClass = main.rules.some(
      (r) => r.from?.kind === "any_char_class",
    )
    expect(hasAnyCharClass, "post-rule upcase uses any_char_class").toBe(true)
  })
})
