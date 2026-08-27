/**
 * Integration test for the new public REST API endpoints.
 *
 * Spawns the Astro server (`node dist/server/entry.mjs`) on a random
 * port and verifies each endpoint with real HTTP requests.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { spawn, type ChildProcess } from "node:child_process"
import { resolve } from "node:path"

const PORT = "4399"
const BASE = `http://localhost:${PORT}`

let server: ChildProcess | undefined

async function waitUntilReady() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`${BASE}/api/systems`)
      if (res.ok) return
    } catch {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error("Server failed to start within 12s")
}

beforeAll(async () => {
  server = spawn("node", [resolve(process.cwd(), "dist/server/entry.mjs")], {
    env: { ...process.env, HOST: "127.0.0.1", PORT },
    stdio: "ignore",
  })
  await waitUntilReady()
}, 30_000)

afterAll(() => {
  server?.kill()
})

async function get(path: string): Promise<Response> {
  return fetch(`${BASE}${path}`)
}

describe("GET /api/transliterate", () => {
  it("returns the expected romanization for Ukrainian", async () => {
    const res = await get(
      "/api/transliterate?system=bgnpcgn-ukr-Cyrl-Latn-2019&input=" + encodeURIComponent("Антон"),
    )
    expect(res.status).toBe(200)
    const body = (await res.json()) as {
      system: string
      input: string
      output: string
    }
    expect(body.system).toBe("bgnpcgn-ukr-Cyrl-Latn-2019")
    expect(body.output).toBe("Anton")
  })

  it("supports Amharic / Ethiopic script", async () => {
    const res = await get(
      "/api/transliterate?system=alalc-amh-Ethi-Latn-2011&input=" + encodeURIComponent("ኢትዮጵያ"),
    )
    expect(res.status).toBe(200)
    const body = (await res.json()) as { output: string }
    expect(body.output.length).toBeGreaterThan(0)
    expect(body.output).not.toBe("ኢትዮጵያ")
  })

  it("returns 404 for unknown system", async () => {
    const res = await get("/api/transliterate?system=nonexistent&input=test")
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error).toMatch(/not found/i)
  })

  it("returns 400 when system is missing", async () => {
    const res = await get("/api/transliterate?input=test")
    expect(res.status).toBe(400)
  })

  it("returns CORS headers", async () => {
    const res = await get("/api/transliterate?system=bgnpcgn-ukr-Cyrl-Latn-2019&input=test")
    expect(res.headers.get("access-control-allow-origin")).toBe("*")
  })

  it("includes durationMs timing", async () => {
    const res = await get("/api/transliterate?system=bgnpcgn-ukr-Cyrl-Latn-2019&input=test")
    const body = await res.json()
    expect(body.durationMs).toBeGreaterThanOrEqual(0)
  })
})

describe("POST /api/transliterate", () => {
  it("accepts JSON body", async () => {
    const res = await fetch(`${BASE}/api/transliterate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: "bgnpcgn-ukr-Cyrl-Latn-2019",
        input: "Київ",
      }),
    })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { output: string }
    expect(body.output.length).toBeGreaterThan(0)
  })

  it("rejects invalid JSON", async () => {
    const res = await fetch(`${BASE}/api/transliterate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    })
    expect(res.status).toBe(400)
  })
})

describe("GET /api/systems", () => {
  it("returns the full catalogue", async () => {
    const res = await get("/api/systems")
    expect(res.status).toBe(200)
    const body = (await res.json()) as { count: number; systems: unknown[] }
    expect(body.count).toBeGreaterThan(100)
    expect(body.systems.length).toBe(body.count)
  })

  it("filters by authority", async () => {
    const res = await get("/api/systems?authority=bgnpcgn")
    const body = (await res.json()) as {
      count: number
      systems: { authority: string }[]
    }
    expect(body.count).toBeGreaterThan(0)
    for (const s of body.systems) expect(s.authority).toBe("bgnpcgn")
  })

  it("filters by source script", async () => {
    const res = await get("/api/systems?source_script=Cyrl")
    const body = (await res.json()) as {
      systems: { source_script: string }[]
    }
    for (const s of body.systems) expect(s.source_script).toBe("Cyrl")
  })
})

describe("POST /api/transliterate/batch", () => {
  it("processes a batch of mixed requests", async () => {
    const res = await fetch(`${BASE}/api/transliterate/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          { system: "bgnpcgn-ukr-Cyrl-Latn-2019", input: "Антон" },
          { system: "bgnpcgn-ukr-Cyrl-Latn-2019", input: "Київ" },
          { system: "nonexistent", input: "test" },
        ],
      }),
    })
    expect(res.status).toBe(200)
    const body = (await res.json()) as {
      results: { output?: string; error?: string }[]
    }
    expect(body.results.length).toBe(3)
    expect(body.results[0]!.output).toBe("Anton")
    expect(body.results[1]!.output).toBe("Kyiv")
    expect(body.results[2]!.error).toMatch(/not found/i)
  })

  it("rejects empty items array", async () => {
    const res = await fetch(`${BASE}/api/transliterate/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [] }),
    })
    expect(res.status).toBe(400)
  })

  it("rejects bodies over 1000 items", async () => {
    const items = Array.from({ length: 1001 }, () => ({
      system: "bgnpcgn-ukr-Cyrl-Latn-2019",
      input: "test",
    }))
    const res = await fetch(`${BASE}/api/transliterate/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
    expect(res.status).toBe(413)
  })
})

describe("GET /openapi.json (OpenAPI spec)", () => {
  it("returns the OpenAPI 3.1 spec", async () => {
    const res = await fetch(`${BASE}/../openapi.json`)
    expect(res.status).toBe(200)
    const spec = (await res.json()) as { openapi: string; paths: Record<string, unknown> }
    expect(spec.openapi).toBe("3.1.0")
    expect(spec.paths["/transliterate"]).toBeDefined()
    expect(spec.paths["/transliterate/batch"]).toBeDefined()
    expect(spec.paths["/systems"]).toBeDefined()
    expect(spec.paths["/detect"]).toBeDefined()
  })
})

describe("OPTIONS preflight", () => {
  it("returns 204 for OPTIONS", async () => {
    const res = await fetch(`${BASE}/api/transliterate`, {
      method: "OPTIONS",
    })
    expect(res.status).toBe(204)
  })
})
