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
})
