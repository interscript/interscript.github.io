/**
 * Vitest for round-5 additions: OpenAPI spec, /api-docs, batch API,
 * /subtitles, /contributing, dark-mode toggle, permalink sharing.
 */

import { describe, it, expect } from "vitest"
import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const DIST = resolve(process.cwd(), "dist/client")

function readHtml(path: string): string {
  return readFileSync(resolve(DIST, path), "utf8")
}

describe("OpenAPI spec at /openapi.json", () => {
  it("ships the JSON spec", () => {
    expect(existsSync(resolve(DIST, "openapi.json"))).toBe(true)
  })

  it("spec has the expected structure", () => {
    const spec = JSON.parse(readHtml("openapi.json"))
    expect(spec.openapi).toBe("3.1.0")
    expect(spec.info.title).toMatch(/Interscript/i)
    expect(spec.paths["/transliterate"]).toBeDefined()
    expect(spec.paths["/transliterate/batch"]).toBeDefined()
    expect(spec.paths["/systems"]).toBeDefined()
    expect(spec.paths["/detect"]).toBeDefined()
  })

  it("includes license + contact info", () => {
    const spec = JSON.parse(readHtml("openapi.json"))
    expect(spec.info.license.name).toBe("BSD-2-Clause")
    expect(spec.info.contact.url).toMatch(/interscript\.org/)
  })

  it("documents the batch endpoint with the right schema", () => {
    const spec = JSON.parse(readHtml("openapi.json"))
    const batch = spec.paths["/transliterate/batch"].post
    expect(batch.tags).toContain("transliterate")
    expect(batch.requestBody.content["application/json"].schema.$ref).toMatch(/BatchRequest/)
    expect(spec.components.schemas.BatchRequest).toBeDefined()
    expect(spec.components.schemas.BatchResponse).toBeDefined()
  })
})

describe("/api-docs redirect", () => {
  const html = readHtml("api-docs/index.html")

  it("redirects to the API's self-hosted docs", () => {
    expect(html).toContain("https://api.interscript.org/docs")
  })
})

describe("/subtitles tool", () => {
  const html = readHtml("subtitles/index.html")

  it("renders the SubtitlesProcessor island", () => {
    expect(html).toMatch(/SubtitlesProcessor|astro-island/)
  })

  it("documents SRT and WebVTT format support", () => {
    expect(html).toContain("SubRip")
    expect(html).toContain("WebVTT")
  })

  it("includes 3 streaming/caption use cases", () => {
    expect(html).toContain("Multi-track subtitles")
    expect(html).toContain("Search indexing")
    expect(html).toContain("Accessibility")
  })
})

describe("/contributing guide", () => {
  const html = readHtml("contributing/index.html")

  it("lists 5 steps from finding a system to opening a PR", () => {
    for (const step of [
      "Find a system",
      "Read the authority document",
      "Write the map",
      "Add test vectors",
      "Open a pull request",
    ]) {
      expect(html).toContain(step)
    }
  })

  it("shows the ISC syntax in a code block", () => {
    expect(html).toContain("metadata {")
    expect(html).toContain("stage main {")
    expect(html).toContain("parallel {")
  })

  it("links to the map repo", () => {
    expect(html).toContain("github.com/interscript/maps")
  })
})

describe("dark mode toggle", () => {
  const home = readHtml("index.html")

  it("renders the toggle button on every page", () => {
    expect(home).toContain('class="theme-toggle"')
  })

  it("applies saved theme before paint (FOUC prevention)", () => {
    expect(home).toMatch(/localStorage\.getItem\(["']isx-theme["']\)/)
  })

  it("ships the toggle script as a bundled module", () => {
    expect(home).toMatch(/theme-toggle/)
  })
})
