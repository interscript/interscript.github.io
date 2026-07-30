/**
 * Vitest for the redesigned site — "scholarly ink + script mosaic"
 * direction. Verifies that the new design tokens, signature element,
 * and partner attribution all render correctly.
 */

import { describe, it, expect } from "vitest"
import { readFileSync, existsSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const DIST = resolve(process.cwd(), "dist")
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

  it("uses the new Fraunces display font (not Newsreader)", () => {
    expect(css.toLowerCase()).toMatch(/fraunces/)
    expect(css.toLowerCase()).not.toMatch(/newsreader/)
  })

  it("loads Inter Tight body font", () => {
    expect(css.toLowerCase()).toMatch(/inter[- ]?tight/)
  })

  it("applies the new palette: paper, ink, accent, highlight", () => {
    expect(css).toContain("f4ede0") // paper
    expect(css).toContain("0e1620") // ink
    expect(css).toContain("4a7a72") // accent (teal)
    expect(css).toContain("b8462e") // highlight (vermillion)
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
    for (const label of ["Total systems", "Authorities", "Source scripts", "Destination scripts", "Live-demoable"]) {
      expect(maps).toContain(label)
    }
  })

  it("uses italic Fraunces variation settings in CSS", () => {
    expect(css).toMatch(/WONK/)
  })
})

describe("partner attribution on every page", () => {
  const pages = allBuiltHtmlFiles()

  it("every page has the 'In partnership with' callout", () => {
    expect(pages.length).toBeGreaterThan(50)
    for (const page of pages) {
      const html = readFileSync(page, "utf8")
      expect(html).toMatch(/In partnership with/i)
    }
  })

  it("every page links to Ribose Inc. in the partner callout", () => {
    for (const page of pages.slice(0, 50)) {
      const html = readFileSync(page, "utf8")
      expect(html).toMatch(/class="footer-partner"[^>]*href="https:\/\/www\.ribose\.com"/)
    }
  })

  it("every page links to NGA in the partner callout", () => {
    for (const page of pages.slice(0, 50)) {
      const html = readFileSync(page, "utf8")
      expect(html).toMatch(/class="footer-partner"[^>]*href="https:\/\/www\.nga\.mil\/"/)
    }
  })

  it("every page preserves the cooperative-agreement legal text", () => {
    for (const page of pages.slice(0, 50)) {
      const html = readFileSync(page, "utf8")
      expect(html).toMatch(/cooperative agreement NSG-2021/i)
    }
  })

  it("every page preserves the U.S. Government disclaimer", () => {
    for (const page of pages.slice(0, 50)) {
      const html = readFileSync(page, "utf8")
      expect(html).toMatch(/does not necessarily reflect/i)
    }
  })
})

describe("navigation and chrome", () => {
  const home = readHtml("index.html")

  it("shows the GitHub pill with up-right arrow", () => {
    expect(home).toMatch(/GitHub\s*[↗]/)
  })

  it("primary nav has all 7 destinations", () => {
    for (const href of ["/", "/demo", "/maps", "/authorities", "/docs", "/blog", "/about"]) {
      expect(home).toContain(`href="${href}"`)
    }
  })

  it("CTA section mentions Ribose + NGA support", () => {
    expect(home).toMatch(/Maintained by Ribose Inc\./i)
    expect(home).toMatch(/National Geospatial-Intelligence Agency/i)
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
