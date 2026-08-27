/**
 * Vitest for round-4 additions: /diff, /marc, enriched /authorities/[slug],
 * API endpoints, and service worker registration.
 */

import { describe, it, expect } from "vitest"
import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const DIST = resolve(process.cwd(), "dist/client")

function readHtml(path: string): string {
  return readFileSync(resolve(DIST, path), "utf8")
}

describe("/diff page", () => {
  const html = readHtml("diff/index.html")

  it("renders the DiffViewer island", () => {
    expect(html).toMatch(/DiffViewer|astro-island/)
  })

  it("shows two system selectors with vs divider", () => {
    expect(html).toContain("System A")
    expect(html).toContain("System B")
    expect(html).toContain("vs")
  })

  it("lists 3 use cases for diff (adoption, authoring, research)", () => {
    expect(html).toContain("Adoption decisions")
    expect(html).toContain("Map authoring")
    expect(html).toContain("Linguistic research")
  })
})

describe("/marc page", () => {
  const html = readHtml("marc/index.html")

  it("renders the MarcTool island", () => {
    expect(html).toMatch(/MarcTool|astro-island/)
  })

  it("ships ALA-LC systems for the picker", () => {
    expect(html).toContain("alalc-rus-Cyrl-Latn-2012")
    expect(html).toContain("alalc-ara-Arab-Latn-1997")
  })

  it("mentions the privacy guarantee", () => {
    expect(html).toMatch(/never leaves your browser|nothing.*uploaded/i)
  })

  it("documents MARC 880 parallel field convention", () => {
    expect(html).toContain("880")
    expect(html).toMatch(/parallel/i)
  })

  it("links to the LOC 880 reference", () => {
    expect(html).toContain("loc.gov/marc")
  })
})

describe("enriched /authorities/[slug] pages", () => {
  const bgn = readHtml("authorities/bgnpcgn/index.html")

  it("shows the full authority name", () => {
    expect(bgn).toContain("BGN/PCGN")
  })

  it("includes a narrative description for well-known authorities", () => {
    expect(bgn).toMatch(/Board on Geographic Names/)
  })

  it("renders a signature sample for prominent authorities", () => {
    expect(bgn).toMatch(/Signature sample/)
    expect(bgn).toContain("Антон")
    expect(bgn).toContain("Anton")
  })

  it("shows publication timeline by decade", () => {
    expect(bgn).toMatch(/Publication timeline|Systems by decade/)
  })

  it("lists source script coverage with display names", () => {
    expect(bgn).toMatch(/Source scripts covered/)
  })

  const alalc = readHtml("authorities/alalc/index.html")
  it("ALA-LC has its full narrative description", () => {
    expect(alalc).toMatch(/American Library Association/)
  })

  const iso = readHtml("authorities/iso/index.html")
  it("ISO has its full narrative description", () => {
    expect(iso).toMatch(/International Organization for Standardization/)
  })
})

describe("service worker registration", () => {
  const home = readHtml("index.html")

  it("registers the service worker on every page", () => {
    expect(home).toMatch(/navigator\.serviceWorker\.register/)
  })

  it("ships /sw.js", () => {
    expect(existsSync(resolve(DIST, "sw.js"))).toBe(true)
  })

  it("ships /offline.html as the fallback", () => {
    expect(existsSync(resolve(DIST, "offline.html"))).toBe(true)
  })

  it("offline page mentions reconnect option", () => {
    const offline = readHtml("offline.html")
    expect(offline).toMatch(/offline/i)
    expect(offline).toContain("/symbol.svg")
  })
})

describe("expanded navigation", () => {
  // Round 4: 13 → 16 nav items (added /diff, /marc, kept the others).
  const home = readHtml("index.html")

  it("primary nav has all 16 destinations", () => {
    for (const href of [
      "/",
      "/demo",
      "/compare",
      "/batch",
      "/detect",
      "/diff",
      "/marc",
      "/maps",
      "/scripts",
      "/use-cases",
      "/api",
      "/status",
      "/authorities",
      "/docs",
      "/about",
    ]) {
      expect(home).toContain(`href="${href}"`)
    }
  })
})
