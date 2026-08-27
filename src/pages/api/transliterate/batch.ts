/**
 * Public REST API: /api/transliterate/batch
 *
 * POST /api/transliterate/batch
 *   body: { items: [{ system, input, stage? }, ...] }
 *   response: { results: [{ system, input, output?, error?, durationMs }, ...] }
 *
 * Processes up to 1000 items per request. Each item is independent —
 * one failure doesn't fail the batch. Designed for high-volume
 * pipelines: catalog cleanup, news batch romanization, citation
 * processing.
 */

import type { APIRoute } from "astro"
import { configure, reset, transliterateAsync } from "interscript-ts"
import { serverMapStrategies } from "../../../lib/server-map-strategies"
import { MapNotFoundError, InterscriptError } from "interscript-ts"

export const prerender = false

const MAX_ITEMS = 1000
const MAX_INPUT_LENGTH = 10_000

let configured = false
function ensureConfigured() {
  if (configured) return
  reset()
  configure({
    strategies: serverMapStrategies(),
  })
  configured = true
}

interface BatchItem {
  system?: string
  input?: string
  stage?: string
}

interface BatchResult {
  system: string
  input: string
  output?: string
  error?: string
  durationMs: number
}

export const POST: APIRoute = async ({ request }) => {
  ensureConfigured()

  let body: { items?: BatchItem[] }
  try {
    body = (await request.json()) as { items?: BatchItem[] }
  } catch {
    return json({ error: "Invalid JSON body" }, 400)
  }

  const items = body.items
  if (!Array.isArray(items)) {
    return json({ error: "Expected { items: [...] } body" }, 400)
  }
  if (items.length === 0) {
    return json({ error: "items array is empty" }, 400)
  }
  if (items.length > MAX_ITEMS) {
    return json({ error: `Too many items: ${items.length}. Max ${MAX_ITEMS} per batch.` }, 413)
  }

  const results: BatchResult[] = []
  for (const item of items) {
    const start = performance.now()
    const system = item.system
    const input = item.input

    if (!system || typeof system !== "string") {
      results.push({
        system: system ?? "",
        input: input ?? "",
        error: "Missing or invalid system",
        durationMs: 0,
      })
      continue
    }
    if (!input || typeof input !== "string") {
      results.push({
        system,
        input: input ?? "",
        error: "Missing or invalid input",
        durationMs: 0,
      })
      continue
    }
    if (input.length > MAX_INPUT_LENGTH) {
      results.push({
        system,
        input,
        error: `input exceeds ${MAX_INPUT_LENGTH} chars`,
        durationMs: 0,
      })
      continue
    }

    try {
      const output = await transliterateAsync(system, input, item.stage)
      results.push({
        system,
        input,
        output,
        durationMs: Math.round(performance.now() - start),
      })
    } catch (e) {
      const errStr =
        e instanceof MapNotFoundError
          ? `System not found: ${system}`
          : e instanceof InterscriptError
            ? e.message
            : `Transliteration failed: ${(e as Error).message}`
      results.push({
        system,
        input,
        error: errStr,
        durationMs: Math.round(performance.now() - start),
      })
    }
  }

  return json({ results })
}

export const OPTIONS: APIRoute = () => new Response(null, { status: 204 })

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
