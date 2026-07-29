import { describe, it, expect } from "vitest"
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { resolve } from "node:path"

const DIST = resolve(process.cwd(), "dist")

function readHtml(path: string): string {
  const full = resolve(DIST, path)
  if (!existsSync(full)) {
    throw new Error(`Not built: ${path} — run 'npm run build' first`)
  }
  return readFileSync(full, "utf8")
}

describe("site build", () => {
  it("dist directory exists", () => {
    expect(existsSync(DIST)).toBe(true)
  })

  it("renders expected pages", () => {
    const expected = [
      "index.html",
      "demo/index.html",
      "maps/index.html",
      "authorities/index.html",
      "blog/index.html",
      "about/index.html",
      "docs/index.html",
    ]
    for (const p of expected) {
      expect(existsSync(resolve(DIST, p))).toBe(true)
    }
  })
})

describe("home page", () => {
  const html = readHtml("index.html")

  it("mentions Interscript", () => {
    expect(html).toMatch(/Interscript/i)
  })

  it("links to demo and docs", () => {
    expect(html).toMatch(/href="\/demo"/)
    expect(html).toMatch(/href="\/docs"/)
  })

  it("includes stats grid", () => {
    expect(html).toMatch(/300\+/)
    expect(html).toMatch(/Authorities/)
  })

  it("includes quick-start code sample", () => {
    expect(html).toMatch(/gem install interscript/)
    expect(html).toMatch(/npm install interscript-ts/)
  })
})

describe("demo page", () => {
  const html = readHtml("demo/index.html")

  it("mentions interscript-ts", () => {
    expect(html).toMatch(/interscript-ts/)
  })

  it("includes the MapExplorer island", () => {
    expect(html).toMatch(/MapExplorer|astro-island/)
  })

  it("lists sample transliterations", () => {
    expect(html).toContain("Anton")
    expect(html).toContain("Tschueß")
  })
})

describe("authorities page", () => {
  const html = readHtml("authorities/index.html")

  it("lists known authorities", () => {
    for (const auth of ["BGN/PCGN", "ISO", "ALA-LC", "ODNI", "ICAO"]) {
      expect(html).toContain(auth)
    }
  })
})

describe("nav across pages", () => {
  it("every built page links to all top-nav destinations", () => {
    const topLevel = readdirSync(DIST)
      .filter((f) => f.endsWith(".html"))
      .map((f) => resolve(DIST, f))
    const subdirs = readdirSync(DIST, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .flatMap((d) =>
        readdirSync(resolve(DIST, d.name))
          .filter((f) => f.endsWith(".html"))
          .map((f) => resolve(DIST, d.name, f)),
      )
    const allPages = [...topLevel, ...subdirs]
    expect(allPages.length).toBeGreaterThan(0)

    for (const page of allPages) {
      void statSync(page)
      const html = readFileSync(page, "utf8")
      for (const href of ["/demo", "/maps", "/authorities", "/docs", "/blog", "/about"]) {
        expect(html).toContain(`href="${href}"`)
      }
    }
  })
})
