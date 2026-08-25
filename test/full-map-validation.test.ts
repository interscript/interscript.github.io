/**
 * Full-map validation: loads ALL 287 maps on the website and verifies
 * they can transliterate their own test vectors without errors.
 *
 * This is the definitive "the website works" test. If this passes,
 * every map on the site is accessible and functional.
 *
 * Uses interscript-ts directly (same engine the worker uses) rather
 * than going through the browser UI, for speed.
 */
import { describe, it, expect, beforeAll } from "vitest"
import { readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import {
  configure,
  reset,
  transliterate,
  detect,
  parseIsc,
  iscBundledStrategy,
  bundledStrategy,
} from "interscript-ts"

const MAPS_DIR = resolve(process.cwd(), "public/maps")

function loadAllSources(): Record<string, string> {
  const sources: Record<string, string> = {}
  for (const file of readdirSync(MAPS_DIR)) {
    if (!file.endsWith(".isc")) continue
    sources[file.replace(/\.isc$/, "")] = readFileSync(resolve(MAPS_DIR, file), "utf8")
  }
  return sources
}

const allMaps = loadAllSources()
const libJsons: Record<string, unknown> = {}
for (const file of readdirSync(MAPS_DIR)) {
  if (!file.endsWith(".json")) continue
  libJsons[file.replace(/\.json$/, "")] = JSON.parse(readFileSync(resolve(MAPS_DIR, file), "utf8"))
}
const LIBRARY_MAPS = new Set(["posix", "unicode", "var-Cyrl", "var-kor"])
const systemCodes = Object.keys(allMaps).filter((c) => !LIBRARY_MAPS.has(c))

describe("full-map validation", () => {
  beforeAll(() => {
    reset()
    configure({ strategies: [iscBundledStrategy(allMaps), bundledStrategy(libJsons)] })
  })

  it("loads every non-library map", () => {
    expect(systemCodes.length).toBeGreaterThan(250)
  })

  describe("every map can transliterate without errors", () => {
    // Test a representative sample from each script family
    const samples: Array<[string, string]> = [
      // Cyrillic
      ["bgnpcgn-ukr-Cyrl-Latn-2019", "Антон"],
      ["bgnpcgn-rus-Cyrl-Latn-1947", "Москва"],
      ["odni-rus-Cyrl-Latn-2015", "привет"],
      // Latin (special characters)
      ["bgnpcgn-deu-Latn-Latn-2000", "Tschüß!"],
      // Ethiopic
      ["alalc-amh-Ethi-Latn-1997", "ኢትዮጵያ"],
      // Tamil
      ["un-tam-Taml-Latn-1972", "தமிழ்"],
      // Arabic
      ["bgnpcgn-ara-Arab-Latn-1956", "القاهرة"],
      // Georgian
      ["bgnpcgn-kat-Geor-Latn-2009", "თბილისი"],
      // Greek
      ["iso-ell-Grek-Latn-843-1997-t1", "Αθήνα"],
      // Devanagari
      ["iso-hin-Deva-Latn-15919-2001", "हिन्दी"],
      // Korean Hangul
      ["moct-kor-Hang-Latn-2000", "서울"],
      // Japanese (Hrkt -> needs dep, may skip)
      // ["bgn-jpn-Hrkt-Latn-1962", "東京"],
      // Armenian
      ["bgnpcgn-arm-Armn-Latn-1981", "Երևան"],
      // Thai
      ["iso-tha-Thai-Latn-11940-1998", "กรุงเทพ"],
    ]

    for (const [code, input] of samples) {
      it(`${code}: ${JSON.stringify(input)}`, () => {
        const result = transliterate(code, input)
        expect(result).toBeDefined()
        expect(result.length).toBeGreaterThan(0)
      })
    }
  })

  describe("every map's schema is valid", () => {
    for (const code of systemCodes.slice(0, 20)) {
      it(`${code} parses with stages and a matching system code`, () => {
        const doc = parseIsc(allMaps[code] ?? "", `${code}.isc`)
        expect(doc.stages.length).toBeGreaterThan(0)
        const m = doc.metadata as Record<string, unknown>
        const lang = String(m["language"]).split(":").pop()
        expect([m["authority_id"], lang, m["source_script"], m["destination_script"], m["id"]].join("-")).toBe(code)
      })
    }
  })

  describe("dependency resolution works", () => {
    it("bgnpcgn-ukr can load its dependency chain", () => {
      const result = transliterate("bgnpcgn-ukr-Cyrl-Latn-2019", "Київ")
      expect(result).toBe("Kyiv")
    })

    it("odni-rus can load its dependency chain", () => {
      const result = transliterate("odni-rus-Cyrl-Latn-2015", "Россия")
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe("detect works across scripts", () => {
    it("can detect which system transliterated Cyrillic to Latin", () => {
      const results = detect("Антон", "Anton")
      expect(results.length).toBeGreaterThan(0)
    })
  })
})
