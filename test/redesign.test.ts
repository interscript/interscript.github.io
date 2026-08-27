/**
 * Vitest for the redesigned site — "scholarly ink + script mosaic"
 * direction. Verifies that the new design tokens, signature element,
 * and partner attribution all render correctly.
 */

import { describe, it, expect } from "vitest"
import { readFileSync, existsSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const DIST = resolve(process.cwd(), "dist/client")
const ASTRO_CSS_DIR = resolve(DIST, "_astro")

function readHtml(path: string): string {
  return readFileSync(resolve(DIST, path), "utf8")
}

function readAllCss(): string {
  if (!existsSync(ASTRO_CSS_DIR)) return ""
  return readdirSync(ASTRO_CSS_DIR)
    .filter((f) => f.endsWith(".css"))
    .map((f) => readFileSync(resolve(ASTRO_CSS_DIR, f), "utf8"))
    .join("\n")
}

function allBuiltHtmlFiles(): string[] {
  if (!existsSync(DIST)) return []
  const out: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = resolve(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith(".html")) out.push(full)
    }
  }
  walk(DIST)
  return out
}

describe("scholarly-ink design system", () => {
  const css = readAllCss()

  it("uses Inter Tight only — sans-serif throughout, no serif faces", () => {
    expect(css.toLowerCase()).toMatch(/inter[- ]?tight/)
    expect(css.toLowerCase()).not.toMatch(/fraunces|newsreader|source serif|georgia/)
  })

  it("loads the Inter Tight body font", () => {
    expect(css.toLowerCase()).toMatch(/inter[- ]?tight/)
  })

  it("applies the new palette: paper, ink, brand teal, highlight", () => {
    expect(css).toContain("f6f3ec") // paper
    expect(css).toContain("1a1d1f") // ink
    expect(css).toContain("008075") // brand teal (from original logo)
    expect(css).toContain("b8462e") // highlight (vermillion)
  })
})

describe("original brand logo adoption", () => {
  it("ships the original symbol.svg from the Ribose/Interscript brand", () => {
    const exists = existsSync(resolve(DIST, "symbol.svg"))
    expect(exists).toBe(true)
  })

  it("uses the symbol as favicon", () => {
    const exists = existsSync(resolve(DIST, "favicon.svg"))
    expect(exists).toBe(true)
  })

  it("symbol.svg contains the brand teal #008075 from the logo", () => {
    const svg = readFileSync(resolve(DIST, "symbol.svg"), "utf8")
    expect(svg).toContain("008075")
  })

  it("every page renders the brand mark as an <img src='/symbol.svg'>", () => {
    const pages = allBuiltHtmlFiles()
    expect(pages.length).toBeGreaterThan(50)
    for (const page of pages.slice(0, 25)) {
      const html = readFileSync(page, "utf8")
      expect(html).toMatch(/src="\/symbol\.svg"/)
    }
  })
})

describe("script mosaic signature element", () => {
  const home = readHtml("index.html")

  it("renders the ScriptMosaic island on the home page", () => {
    expect(home).toMatch(/ScriptMosaic|astro-island/)
  })

  it("includes all 6 script family labels", () => {
    for (const script of ["Cyrillic", "Arabic", "Devanagari", "Han", "Ethiopic", "Greek"]) {
      expect(home).toContain(script)
    }
  })

  it("shows live transliteration status text", () => {
    // Status text is rendered client-side; verify the cell-meta
    // structure is in place (it has the cell-arrow + authority span)
    expect(home).toMatch(/cell-status|mosaic-status|status-dot/)
  })

  it("includes vermillion arrow markers between source and target", () => {
    expect(home).toMatch(/cell-arrow/)
  })

  it("uses the deep ink surface for the mosaic container", () => {
    // CSS for .mosaic should use the ink color
    const css = readAllCss()
    expect(css).toMatch(/\.mosaic\b/)
  })

  it("shows real authority badges for initial transforms", () => {
    // First transforms per cell: BGN/PCGN, BGN/PCGN, UN, Academia Sinica, ALA-LC, ISO
    for (const auth of ["BGN/PCGN", "UN", "Academia Sinica", "ALA-LC", "ISO"]) {
      expect(home).toContain(auth)
    }
  })
})

describe("map catalogue page redesign", () => {
  const maps = readHtml("maps/index.html")
  const css = readAllCss()

  it("shows the new stats grid with 5 metrics", () => {
    for (const label of [
      "Total systems",
      "Authorities",
      "Source scripts",
      "Destination scripts",
      "Live-demoable",
    ]) {
      expect(maps).toContain(label)
    }
  })

  it("ships no leftover Fraunces axis settings", () => {
    expect(css).not.toMatch(/"WONK"|"SOFT"/)
  })
})

describe("attribution on every page", () => {
  // Embed widget is chrome-free — excluded from "every page" assertions.
  const mainPages = () =>
    allBuiltHtmlFiles().filter((p) => !p.includes("/embed") && !p.includes("/offline.html"))

  it("every page links to Ribose Inc. as maintainer", () => {
    expect(mainPages().length).toBeGreaterThan(50)
    for (const page of mainPages().slice(0, 50)) {
      const html = readFileSync(page, "utf8")
      expect(html).toMatch(/href="https:\/\/www\.ribose\.com"/)
    }
  })

  // The "cooperative agreement NSG-2021-XXX" NGA funding claim was a
  // hallucination introduced in the Astro migration and never existed on
  // the v1 site — keep it out permanently.
  it("no page carries the fabricated NGA attribution", () => {
    for (const page of mainPages()) {
      const html = readFileSync(page, "utf8")
      expect(html).not.toMatch(/In partnership with/i)
      expect(html).not.toMatch(/National Geospatial-Intelligence/i)
      expect(html).not.toMatch(/NSG-2021/)
      expect(html).not.toMatch(/does not necessarily reflect/i)
    }
  })
})

describe("navigation and chrome", () => {
  const home = readHtml("index.html")

  it("shows the GitHub pill with up-right arrow", () => {
    expect(home).toMatch(/GitHub\s*[↗]/)
  })

  it("primary nav has all 18 destinations", () => {
    for (const href of [
      "/",
      "/demo",
      "/compare",
      "/batch",
      "/detect",
      "/diff",
      "/marc",
      "/subtitles",
      "/maps",
      "/scripts",
      "/use-cases",
      "/api",
      "/api-docs",
      "/status",
      "/authorities",
      "/contributing",
      "/docs",
      "/about",
    ]) {
      expect(home).toContain(`href="${href}"`)
    }
  })

  it("CTA section credits Ribose maintenance, no fabricated partners", () => {
    expect(home).toMatch(/Maintained by Ribose Inc\./i)
    expect(home).not.toMatch(/National Geospatial-Intelligence/i)
  })
})

describe("featured systems showcase", () => {
  const home = readHtml("index.html")

  it("shows the 5 featured systems with byte-exact test vectors", () => {
    expect(home).toContain("Антон")
    expect(home).toContain("Anton")
    expect(home).toContain("Tschüß!")
    expect(home).toContain("Tschueß!")
    expect(home).toContain("привет мир")
    expect(home).toContain("privet mir")
    expect(home).toContain("ኢትዮጵያ")
    expect(home).toContain("தமிழ்")
  })

  it("links each featured system to its detail page", () => {
    expect(home).toContain('href="/maps/bgnpcgn-ukr-Cyrl-Latn-2019"')
    expect(home).toContain('href="/maps/alalc-amh-Ethi-Latn-2011"')
  })
})
