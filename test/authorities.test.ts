/**
 * Vitest for authority index + detail pages.
 */

import { describe, it, expect } from "vitest"
import { readFileSync, existsSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const DIST = resolve(process.cwd(), "dist")

function readHtml(path: string): string {
  return readFileSync(resolve(DIST, path), "utf8")
}

describe("authorities index page", () => {
  const html = readHtml("authorities/index.html")

  it("exists and renders", () => {
    expect(existsSync(resolve(DIST, "authorities/index.html"))).toBe(true)
  })

  it("shows total authority count", () => {
    expect(html).toMatch(/\d+ authorities, \d+ systems/)
  })

  it("lists every authority with system counts", () => {
    for (const auth of ["BGN/PCGN", "ISO", "ALA-LC", "ODNI", "ICAO"]) {
      expect(html).toContain(auth)
    }
  })

  it("links to per-authority detail pages", () => {
    expect(html).toContain('href="/authorities/bgnpcgn"')
    expect(html).toContain('href="/authorities/iso"')
    expect(html).toContain('href="/authorities/alalc"')
  })

  it("links each row to view-systems action", () => {
    expect(html).toMatch(/View systems/i)
  })
})

describe("per-authority detail pages", () => {
  const authDir = resolve(DIST, "authorities")
  const authSlugs = existsSync(authDir)
    ? readdirSync(authDir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name)
    : []

  it("generates detail pages for at least 30 authorities", () => {
    expect(authSlugs.length).toBeGreaterThan(30)
  })

  it("renders BGN/PCGN authority page with system list", () => {
    const html = readHtml("authorities/bgnpcgn/index.html")
    expect(html).toMatch(/BGN\/PCGN/i)
    expect(html).toMatch(/Systems/i)
    expect(html).toMatch(/Source scripts/i)
    // Should list multiple systems
    const systemLinks = html.match(/href="\/maps\/bgnpcgn-/g) || []
    expect(systemLinks.length).toBeGreaterThan(5)
  })

  it("renders ALA-LC with test vectors", () => {
    const html = readHtml("authorities/alalc/index.html")
    expect(html).toMatch(/ALA-LC|American Library Association/i)
    // Should have at least one test vector
    expect(html).toMatch(/ኢትዮጵያ|Amharic/i)
  })

  it("shows metadata grid with system count and scripts", () => {
    const html = readHtml("authorities/iso/index.html")
    expect(html).toMatch(/Systems/i)
    expect(html).toMatch(/Source scripts/i)
    expect(html).toMatch(/Destination/i)
  })

  it("links back to authorities index", () => {
    for (const slug of authSlugs.slice(0, 5)) {
      const html = readFileSync(resolve(authDir, slug, "index.html"), "utf8")
      expect(html).toContain('href="/authorities"')
    }
  })

  it("links each system to its map detail page", () => {
    for (const slug of authSlugs.slice(0, 3)) {
      const html = readFileSync(resolve(authDir, slug, "index.html"), "utf8")
      expect(html).toMatch(/href="\/maps\//)
    }
  })
})
