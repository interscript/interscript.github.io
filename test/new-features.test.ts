/**
 * Vitest for the new big-impact surfaces added in this round:
 * /compare, /api, /status, /use-cases, /embed.
 *
 * Reads from dist/ after `npm run build`.
 */

import { describe, it, expect } from "vitest"
import { readFileSync, existsSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const DIST = resolve(process.cwd(), "dist/client")

function readHtml(path: string): string {
  return readFileSync(resolve(DIST, path), "utf8")
}

describe("/compare page", () => {
  const html = readHtml("compare/index.html")

  it("renders the CompareMode island", () => {
    expect(html).toMatch(/CompareMode|astro-island/)
  })

  it("lists at least 4 preset groups", () => {
    for (const label of ["Cyrillic names", "Arabic names", "Greek names", "Hindi names"]) {
      expect(html).toContain(label)
    }
  })

  it("shows the comparison narrative (why it matters)", () => {
    expect(html).toContain("Shcherbakova")
    expect(html).toContain("Ščerbakova")
  })

  it("links each system to its detail page", () => {
    expect(html).toContain("bgnpcgn-rus-Cyrl-Latn-1947")
    expect(html).toContain("iso-ell-Grek-Latn-843-1997-t1")
  })
})

describe("/api page", () => {
  const html = readHtml("api/index.html")

  it("renders the playground root element", () => {
    expect(html).toContain('id="playground-root"')
  })

  it("ships the systems data as JSON prop", () => {
    expect(html).toMatch(/data-systems="/)
    expect(html).toContain("bgnpcgn-ukr-Cyrl-Latn-2019")
  })

  it("has install cards for npm + gem + CDN", () => {
    expect(html).toContain("npm install")
    expect(html).toContain("gem install")
    expect(html).toContain("esm.sh")
  })

  it("includes the embed widget preview iframe", () => {
    expect(html).toMatch(/iframe[^>]+src="\/embed/)
  })
})

describe("/status page", () => {
  const html = readHtml("status/index.html")

  it("shows the Ruby parity KPI", () => {
    expect(html).toMatch(/Ruby parity/)
    expect(html).toMatch(/100\.0%|99\.\d%/)  // at least 99%
  })

  it("shows total systems, authorities, scripts", () => {
    expect(html).toMatch(/Total systems/)
    expect(html).toMatch(/Authorities/)
    expect(html).toMatch(/Scripts covered/)
  })

  it("shows corpus size + last sync date", () => {
    expect(html).toMatch(/Map corpus size/)
    expect(html).toMatch(/Last sync/)
  })

  it("lists top authorities with rank bars", () => {
    expect(html).toContain("class=\"rank-list\"")
    expect(html).toContain("bgnpcgn")
  })

  it("documents how the numbers are computed", () => {
    expect(html).toMatch(/How these numbers are computed/)
    expect(html).toMatch(/@iso24229\/iso15924-data/)
  })
})

describe("/use-cases page", () => {
  const html = readHtml("use-cases/index.html")

  it("renders all 6 documented use cases", () => {
    for (const title of [
      "Library catalogs",
      "Passports",
      "Newsroom",
      "Academic citations",
      "Geographic names",
      "Genealogy",
    ]) {
      expect(html).toContain(title)
    }
  })

  it("includes a live example for each use case", () => {
    expect(html).toContain("Достоевский")
    expect(html).toContain("Dostoevskiĭ")
    expect(html).toContain("بغداد")
    expect(html).toContain("Baghdad")
  })

  it("links each use case to relevant system detail pages", () => {
    expect(html).toContain("/maps/alalc-rus-Cyrl-Latn-2012")
    expect(html).toContain("/maps/icao-ukr-Cyrl-Latn-9303")
    expect(html).toContain("/maps/iso-rus-Cyrl-Latn-9-1995")
  })

  it("includes a CTA back to the API playground", () => {
    expect(html).toMatch(/Try the API playground/)
  })
})

describe("/embed widget", () => {
  const html = readHtml("embed/index.html")

  it("renders the custom element", () => {
    expect(html).toContain("interscript-widget")
  })

  it("ships the systems data for the dropdown", () => {
    expect(html).toMatch(/data-systems=/)
    expect(html).toContain("bgnpcgn-ukr-Cyrl-Latn-2019")
  })

  it("loads the widget script", () => {
    // Astro bundles the script with a hashed filename derived from the
    // page that imports it. Look for any _astro script src.
    expect(html).toMatch(/src="\/_astro\/[^"]+\.js"/)
  })

  it("does NOT render the site nav/footer (chrome-free)", () => {
    expect(html).not.toContain('class="site-header"')
    expect(html).not.toContain('class="site-footer"')
  })
})

describe("navigation across new pages", () => {
  const pages = ["compare", "api", "status", "use-cases"]

  it("every new page links to all primary nav destinations", () => {
    const navHrefs = [
      "/demo", "/compare", "/batch", "/detect", "/maps", "/scripts",
      "/use-cases", "/api", "/status", "/authorities", "/docs", "/about",
    ]
    for (const p of pages) {
      const html = readHtml(`${p}/index.html`)
      for (const href of navHrefs) {
        expect(html, `${p} → ${href}`).toContain(`href="${href}"`)
      }
    }
  })

  it("every new page preserves partner attribution", () => {
    for (const p of pages) {
      const html = readHtml(`${p}/index.html`)
      expect(html).toMatch(/In partnership with/)
      expect(html).toMatch(/Ribose Inc\./)
      expect(html).toMatch(/National Geospatial-Intelligence Agency/)
    }
  })

  it("every new page renders the brand mark", () => {
    for (const p of pages) {
      const html = readHtml(`${p}/index.html`)
      expect(html).toContain('src="/symbol.svg"')
    }
  })
})
