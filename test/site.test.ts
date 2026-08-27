import { describe, it, expect } from "vitest"
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { resolve, relative } from "node:path"

const DIST = resolve(process.cwd(), "dist/client")

function readHtml(path: string): string {
  const full = resolve(DIST, path)
  if (!existsSync(full)) {
    throw new Error(`Not built: ${path} — run 'npm run build' first`)
  }
  return readFileSync(full, "utf8")
}

function readAllCss(): string {
  const cssDir = resolve(DIST, "_astro")
  if (!existsSync(cssDir)) return ""
  return readdirSync(cssDir)
    .filter((f) => f.endsWith(".css"))
    .map((f) => readFileSync(resolve(cssDir, f), "utf8"))
    .join("\n")
}

function allBuiltHtmlFiles(): string[] {
  if (!existsSync(DIST)) return []
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
  return [...topLevel, ...subdirs]
}

describe("site build", () => {
  it("dist directory exists", () => {
    expect(existsSync(DIST)).toBe(true)
  })

  it("renders all expected pages", () => {
    const expected = [
      "index.html",
      "404.html",
      "demo/index.html",
      "maps/index.html",
      "authorities/index.html",
      "blog/index.html",
      "docs/index.html",
      "about/index.html",
      "blog/2021-06-26-webassembly-and-advanced-regular-expressions-with-opal/index.html",
      "blog/2022-04-04-transliteration-learned-from-transformers-and-graphs/index.html",
      "docs/Interscript_Map_Format/index.html",
      "docs/Map_Editing_Guide/index.html",
    ]
    for (const p of expected) {
      expect(existsSync(resolve(DIST, p))).toBe(true)
    }
  })
})

describe("design system — palette (in compiled CSS)", () => {
  const css = readAllCss()

  it("uses warm paper background", () => {
    expect(css).toContain("f6f3ec")
  })

  it("uses brand teal accent from the original logo", () => {
    expect(css).toContain("008075")
  })

  it("uses deep near-black ink", () => {
    expect(css).toContain("1a1d1f")
  })

  it("uses vermillion highlight for CTAs", () => {
    expect(css).toContain("b8462e")
  })
})

describe("design system — typography (in compiled CSS)", () => {
  const css = readAllCss()

  it("loads Inter Tight (sans-serif throughout)", () => {
    expect(css.toLowerCase()).toContain("inter tight")
  })

  it("loads no serif faces", () => {
    expect(css.toLowerCase()).not.toMatch(/fraunces|newsreader/)
  })

  it("loads JetBrains Mono", () => {
    expect(css.toLowerCase()).toContain("jetbrains")
  })
})

describe("partners and attribution", () => {
  // Embed widget is intentionally chrome-free — excluded from "every page"
  const mainPages = () =>
    allBuiltHtmlFiles().filter((p) => !p.includes("/embed") && !p.includes("/offline.html"))

  it("credits Ribose Inc. on every page footer", () => {
    for (const file of mainPages()) {
      const html = readFileSync(file, "utf8")
      expect(html).toMatch(/Ribose Inc\./)
    }
  })

  it("never claims NGA funding (fabricated-content guard)", () => {
    for (const file of mainPages()) {
      const html = readFileSync(file, "utf8")
      expect(html).not.toMatch(/National Geospatial-Intelligence|NSG-2021/i)
    }
  })

  it("About page mentions Ribose incubation", () => {
    const about = readHtml("about/index.html")
    expect(about).toMatch(/started at Ribose/i)
  })

  it("About page lists the real v1 supporters", () => {
    const about = readHtml("about/index.html")
    expect(about).toMatch(/Board on Geographic Names/)
    expect(about).toMatch(/CalConnect/)
    expect(about).toMatch(/International Civil Aviation Organization/)
  })
})

describe("navigation", () => {
  const navHrefs = [
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
    "https://api.interscript.org/docs",
    "/status",
    "/authorities",
    "/contributing",
    "/docs",
    "/about",
  ]

  it("every page (except /embed) links to all primary destinations", () => {
    const pages = allBuiltHtmlFiles().filter(
      (p) => !p.includes("/embed") && !p.includes("/offline.html"),
    )
    expect(pages.length).toBeGreaterThan(0)
    for (const page of pages) {
      void statSync(page)
      const html = readFileSync(page, "utf8")
      for (const href of navHrefs) {
        expect(html).toContain(`href="${href}"`)
      }
    }
  })

  it("GitHub pill is present on every page (except /embed)", () => {
    const pages = allBuiltHtmlFiles().filter(
      (p) => !p.includes("/embed") && !p.includes("/offline.html"),
    )
    for (const page of pages) {
      const html = readFileSync(page, "utf8")
      expect(html).toMatch(/github\.com\/interscript/)
    }
  })
})

describe("home page", () => {
  const home = readHtml("index.html")

  it("has the script mosaic hero (signature element)", () => {
    expect(home).toMatch(/ScriptMosaic|astro-island/)
  })

  it("renders the headline three beats", () => {
    expect(home).toMatch(/Every(\s|&nbsp;)+authority/i)
    expect(home).toMatch(/Every(\s|&nbsp;)+script/i)
    expect(home).toMatch(/One(\s|&nbsp;)+map/i)
  })

  it("shows the four headline stats", () => {
    expect(home).toMatch(/Systems/)
    expect(home).toMatch(/Authorities/)
    expect(home).toMatch(/Scripts/)
    expect(home).toMatch(/Runtimes/)
  })

  it("lists authority strip", () => {
    for (const auth of ["BGN/PCGN", "ISO", "ALA-LC", "ODNI", "ICAO"]) {
      expect(home).toContain(auth)
    }
  })

  it("shows featured systems with byte-exact transformations", () => {
    expect(home).toContain("Антон")
    expect(home).toContain("Anton")
    expect(home).toContain("Tschüß!")
    expect(home).toContain("Tschueß!")
    expect(home).toContain("привет мир")
    expect(home).toContain("privet mir")
    expect(home).toContain("ኢትዮጵያ")
    expect(home).toContain("தமிழ்")
  })

  it("shows install command in CTA", () => {
    expect(home).toContain("gem install interscript")
    expect(home).toContain("npm install interscript-ts")
  })
})

describe("demo page", () => {
  const demo = readHtml("demo/index.html")

  it("mentions interscript-ts", () => {
    expect(demo).toMatch(/interscript/)
  })

  it("includes the MapExplorer island", () => {
    expect(demo).toMatch(/MapExplorer|astro-island/)
  })

  it("has the reference-vectors table", () => {
    expect(demo).toMatch(/Reference vectors/i)
  })
})

describe("authorities page", () => {
  const auth = readHtml("authorities/index.html")

  it("lists authorities with system counts", () => {
    for (const name of ["BGN/PCGN", "ISO", "ALA-LC", "ODNI", "ICAO", "UNGEGN", "DIN", "MOFA"]) {
      expect(auth).toContain(name)
    }
  })
})

describe("404 page", () => {
  const html = readHtml("404.html")

  it("shows 404 prominently", () => {
    expect(html).toMatch(/404/)
  })

  it("suggests navigational destinations", () => {
    for (const target of ["/demo", "/maps", "/docs", "/blog"]) {
      expect(html).toContain(`href="${target}"`)
    }
  })
})

describe("blog", () => {
  const blog = readHtml("blog/index.html")

  it("lists the four published posts", () => {
    expect(blog).toMatch(/WebAssembly.*Opal/i)
    expect(blog).toMatch(/Diacritization.*Arabic/i)
    expect(blog).toMatch(/Rababa.*Hebrew/i)
    expect(blog).toMatch(/transliteration|transformers/i)
  })

  it("renders detail page for one post with full body", () => {
    const post = readHtml(
      "blog/2021-06-26-webassembly-and-advanced-regular-expressions-with-opal/index.html",
    )
    expect(post).toMatch(/WebAssembly/i)
    expect(post.length).toBeGreaterThan(2000)
  })
})

describe("docs", () => {
  const docs = readHtml("docs/index.html")

  it("lists the six docs", () => {
    expect(docs).toMatch(/Integration.*Ruby/i)
    expect(docs).toMatch(/Map Format/i)
    expect(docs).toMatch(/Maintainers/i)
    expect(docs).toMatch(/Map Editing/i)
    expect(docs).toMatch(/Rababa/i)
    expect(docs).toMatch(/Secryst/i)
  })

  it("renders a doc detail page with sidebar nav", () => {
    const doc = readHtml("docs/Interscript_Map_Format/index.html")
    expect(doc).toMatch(/Interscript Map Format/i)
    expect(doc.length).toBeGreaterThan(2000)
    expect(doc).toContain("Map_Editing_Guide")
    expect(doc).toContain("Maintainers")
    expect(doc).toContain("Usage_with_Rababa")
  })
})

describe("about page", () => {
  const about = readHtml("about/index.html")

  it("explains mission", () => {
    expect(about).toMatch(/Mission/)
    expect(about).toMatch(/interoperable/i)
  })

  it("covers history, team, partners", () => {
    expect(about).toMatch(/History/)
    expect(about).toMatch(/Team/)
    expect(about).toMatch(/Partners &amp; supporters/)
  })
})

describe("Astro whitespace collapse guard", () => {
  // Astro drops the space between text and an inline element when they
  // sit on different source lines ("the\n<a>x</a>" renders "thex").
  // Guard the source so the bug can't come back.
  const INLINE = "(a|em|strong|code|span|abbr|small|cite|sup|sub)"
  const srcFiles: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = resolve(dir, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (entry.endsWith(".astro")) srcFiles.push(full)
    }
  }
  for (const dir of ["src/pages", "src/layouts", "src/components"]) {
    walk(resolve(process.cwd(), dir))
  }

  it("no text-to-tag or tag-to-text line breaks around inline elements", () => {
    const offenders: string[] = []
    for (const file of srcFiles) {
      const lines = readFileSync(file, "utf8").split("\n")
      let inRaw = false
      for (let i = 0; i < lines.length - 1; i++) {
        if (/<style|<script/.test(lines[i])) inRaw = true
        if (/<\/style>|<\/script>/.test(lines[i])) inRaw = false
        if (inRaw) continue
        const this_ = lines[i]
        const next = lines[i + 1]
        if (
          /[a-zA-Z0-9,.;:!?)\]'"]$/.test(this_) &&
          new RegExp(`^\\s*<${INLINE}[\\s>]`).test(next)
        ) {
          offenders.push(`${relative(process.cwd(), file)}:${i + 1} text→tag`)
        }
        if (
          new RegExp(`</${INLINE}>$`).test(this_) &&
          /^\s*[a-zA-Z0-9(]/.test(next) &&
          !/^\s*<(\/|style|script)/.test(next)
        ) {
          offenders.push(`${relative(process.cwd(), file)}:${i + 1} tag→text`)
        }
      }
    }
    expect(offenders).toEqual([])
  })
})
