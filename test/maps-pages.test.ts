/**
 * Vitest for the catalogue + detail pages — site-build smoke tests
 * for /maps index and per-map detail pages.
 *
 * Reads from dist/ after `npm run build`.
 */

import { describe, it, expect } from "vitest"
import { readFileSync, existsSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const DIST = resolve(process.cwd(), "dist/client")
const MAPS_DIST = resolve(DIST, "maps")

function readHtml(path: string): string {
  return readFileSync(resolve(DIST, path), "utf8")
}

describe("maps catalogue page", () => {
  const html = readHtml("maps/index.html")

  it("exists", () => {
    expect(existsSync(resolve(MAPS_DIST, "index.html"))).toBe(true)
  })

  it("mentions the catalogue total", () => {
    expect(html).toMatch(/287 maps/)
  })

  it("mentions authority count", () => {
    expect(html).toMatch(/authorities/)
  })

  it("includes the MapCatalogue island", () => {
    expect(html).toMatch(/MapCatalogue|astro-island/)
  })

  it("ships the catalogue JSON inline as props", () => {
    // At least 100 system codes should be embedded.
    const matches = html.match(/bgnpcgn-[a-z]+-(Cyrl|Latn)-Latn-\d{4}/g) || []
    expect(matches.length).toBeGreaterThan(5)
  })
})

describe("per-map detail pages", () => {
  const detailDirs = existsSync(MAPS_DIST)
    ? readdirSync(MAPS_DIST, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
    : []

  it("renders at least 280 detail pages (one per map)", () => {
    expect(detailDirs.length).toBeGreaterThan(280)
  })

  it("renders the BGN/PCGN Ukrainian detail page with metadata", () => {
    const html = readHtml("maps/bgnpcgn-ukr-Cyrl-Latn-2019/index.html")
    expect(html).toMatch(/BGN\/PCGN|bgnpcgn/i)
    expect(html).toMatch(/2019/)
    expect(html).toMatch(/Cyrl/)
    expect(html).toMatch(/Latn/)
    expect(html).toMatch(/Romanization of Ukrainian/i)
    // Real test vector for this map
    expect(html).toContain("Алушта")
    expect(html).toContain("Alushta")
  })

  it("renders ALA-LC Amharic with Ethiopic test vector", () => {
    const html = readHtml("maps/alalc-amh-Ethi-Latn-2011/index.html")
    expect(html).toContain("ኢትዮጵያ")
    expect(html).toContain("Ethi")
  })

  it("includes a link to the .imp source on GitHub for each map", () => {
    const sample = detailDirs.slice(0, 5)
    for (const dir of sample) {
      const html = readFileSync(resolve(MAPS_DIST, dir, "index.html"), "utf8")
      expect(html).toMatch(/github\.com\/interscript\/maps\/blob\/main\/maps\//)
      expect(html).toContain(`${dir}.imp`)
    }
  })

  it("links back to the catalogue index from each detail", () => {
    const sample = detailDirs.slice(0, 5)
    for (const dir of sample) {
      const html = readFileSync(resolve(MAPS_DIST, dir, "index.html"), "utf8")
      expect(html).toContain('href="/maps"')
    }
  })

  it("renders the MapPreview island on each detail page", () => {
    const sample = detailDirs.slice(0, 5)
    for (const dir of sample) {
      const html = readFileSync(resolve(MAPS_DIST, dir, "index.html"), "utf8")
      expect(html).toMatch(/MapPreview|astro-island/)
    }
  })

  it("shows reference vector section for maps with test data", () => {
    const html = readHtml("maps/bgnpcgn-ukr-Cyrl-Latn-2019/index.html")
    expect(html).toMatch(/Reference vector/i)
  })
})
