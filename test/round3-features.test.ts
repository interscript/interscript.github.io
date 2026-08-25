/**
 * Vitest for round-3 additions: /batch, /detect, /scripts.
 */

import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const DIST = resolve(process.cwd(), "dist/client")

function readHtml(path: string): string {
  return readFileSync(resolve(DIST, path), "utf8")
}

describe("/batch page", () => {
  const html = readHtml("batch/index.html")

  it("renders the BatchProcessor island", () => {
    expect(html).toMatch(/BatchProcessor|astro-island/)
  })

  it("ships the system picker with curated systems", () => {
    expect(html).toContain("bgnpcgn-ukr-Cyrl-Latn-2019")
    expect(html).toContain("alalc-amh-Ethi-Latn-2011")
    expect(html).toContain("iso-ell-Grek-Latn-843-1997-t1")
  })

  it("mentions privacy guarantee (no server round-trip)", () => {
    expect(html).toMatch(/never leaves your browser/)
  })

  it("lists 4 working-set use cases", () => {
    for (const t of ["Libraries", "Newsrooms", "Genealogy", "Academia"]) {
      expect(html).toContain(t)
    }
  })
})

describe("/detect page", () => {
  const html = readHtml("detect/index.html")

  it("renders the DetectPanel island", () => {
    expect(html).toMatch(/DetectPanel|astro-island/)
  })

  it("explains the Levenshtein algorithm", () => {
    expect(html).toMatch(/Levenshtein/)
    expect(html).toMatch(/edit distance/i)
  })

  it("includes 4 script families", () => {
    for (const label of [
      "Cyrillic → Latin",
      "Arabic → Latin",
      "Greek → Latin",
      "Devanagari → Latin",
    ]) {
      expect(html).toContain(label)
    }
  })

  it("documents 3 detection use cases", () => {
    for (const t of ["Provenance", "Quality control", "dedup"]) {
      expect(html).toContain(t)
    }
  })
})

describe("/scripts encyclopedia", () => {
  const html = readHtml("scripts/index.html")

  it("shows a card per script with samples", () => {
    // Cards should include common scripts
    for (const s of ["Cyrillic", "Arabic", "Greek", "Devanagari"]) {
      expect(html).toContain(s)
    }
  })

  it("includes a glossary table with ISO 15924 numbers", () => {
    expect(html).toContain("ISO 15924")
    expect(html).toContain("Number") // table header
    // Number 220 = Cyrillic
    expect(html).toContain(">220<")
  })

  it("links each script card to a map detail page", () => {
    expect(html).toMatch(/href="\/maps\/[a-z]/)
  })

  it("credits @iso24229/iso15924-data for resolution", () => {
    expect(html).toContain("@iso24229/iso15924-data")
  })
})

describe("expanded navigation across new pages", () => {
  const pages = ["batch", "detect", "scripts"]
  // After round 5, the nav has 18 destinations.
  const navHrefs = [
    "/demo", "/compare", "/batch", "/detect", "/diff", "/marc", "/subtitles",
    "/maps", "/scripts", "/use-cases", "/api", "/api-docs", "/status",
    "/authorities", "/contributing", "/docs", "/about",
  ]

  it("every new page links to all primary nav destinations", () => {
    for (const p of pages) {
      const html = readHtml(`${p}/index.html`)
      for (const href of navHrefs) {
        expect(html, `${p} → ${href}`).toContain(`href="${href}"`)
      }
    }
  })

  it("every new page credits Ribose, no fabricated partners", () => {
    for (const p of pages) {
      const html = readHtml(`${p}/index.html`)
      expect(html).toMatch(/Ribose Inc\./)
      expect(html).not.toMatch(/National Geospatial-Intelligence/)
    }
  })

  it("every new page renders the brand mark", () => {
    for (const p of pages) {
      const html = readHtml(`${p}/index.html`)
      expect(html).toContain('src="/symbol.svg"')
    }
  })
})

describe("API page additions (CLI + GitHub Action)", () => {
  const html = readHtml("api/index.html")

  it("mentions the CLI install command", () => {
    expect(html).toContain("npm install -g interscript-ts")
    expect(html).toContain("npx interscript-ts")
  })

  it("shows single-call + batch CLI usage", () => {
    expect(html).toContain("interscript-ts t ")
    expect(html).toContain("interscript-ts b ")
    expect(html).toContain("interscript-ts list ")
  })

  it("includes a GitHub Action snippet", () => {
    expect(html).toContain("name: Romanize names")
    expect(html).toContain("uses: actions/setup-node")
    expect(html).toContain("npx interscript-ts@latest")
  })
})
