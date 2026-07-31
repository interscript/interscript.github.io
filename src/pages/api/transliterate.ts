/**
 * Public REST API: /api/transliterate
 *
 * GET  /api/transliterate?system=<code>&input=<text>&stage=<stage?>
 * POST /api/transliterate  body: { system, input, stage? }
 *
 * Response: { system, input, output, stage?, durationMs }
 *
 * On-demand route: bypasses prerender. Runs interscript-ts with an
 * httpStrategy pointed at this site's own /maps/ directory. Map IR is
 * cached in-memory for the lifetime of the worker process.
 */

import type { APIRoute } from "astro"
import {
  configure,
  reset,
  transliterateAsync,
  // filesystemStrategy is server-only (node:fs) — import directly.
} from "interscript-ts"
import { filesystemStrategy } from "interscript-ts/loaders.node"
import { MapNotFoundError, InterscriptError } from "interscript-ts"
import { resolve } from "node:path"

export const prerender = false

// Singleton runtime — configured once, reused across requests.
let configured = false
function ensureConfigured() {
  if (configured) return
  // Server-side: read maps directly from public/maps/ — no HTTP roundtrip.
  reset()
  configure({
    strategies: [filesystemStrategy(resolve(process.cwd(), "public/maps"))],
  })
  configured = true
}

interface RequestBody {
  system?: string
  input?: string
  stage?: string
}

function bad(message: string, status = 400): Response {
  return json({ error: message }, status)
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export const GET: APIRoute = async ({ url }) => {
  ensureConfigured()
  const system = url.searchParams.get("system") ?? undefined
  const input = url.searchParams.get("input") ?? undefined
  const stage = url.searchParams.get("stage") ?? undefined
  return run(system, input, stage)
}

export const POST: APIRoute = async ({ request }) => {
  ensureConfigured()
  let body: RequestBody
  try {
    body = (await request.json()) as RequestBody
  } catch {
    return bad("Invalid JSON body")
  }
  return run(body.system, body.input, body.stage)
}

export const OPTIONS: APIRoute = () => new Response(null, { status: 204 })

async function run(
  system: string | undefined,
  input: string | undefined,
  stage: string | undefined,
): Promise<Response> {
  if (!system) return bad("Missing required parameter: system")
  if (!input) return bad("Missing required parameter: input")
  if (typeof system !== "string" || system.length > 200) {
    return bad("system must be a string ≤ 200 chars")
  }
  if (typeof input !== "string" || input.length > 10_000) {
    return bad("input must be a string ≤ 10000 chars")
  }

  const start = performance.now()
  try {
    const output = await transliterateAsync(system, input, stage)
    const durationMs = Math.round(performance.now() - start)
    return json({ system, input, output, stage: stage ?? "main", durationMs })
  } catch (e) {
    const durationMs = Math.round(performance.now() - start)
    if (e instanceof MapNotFoundError) {
      return json(
        { error: `System not found: ${system}`, system, durationMs },
        404,
      )
    }
    if (e instanceof InterscriptError) {
      return json(
        { error: e.message, system, durationMs },
        422,
      )
    }
    return json(
      { error: `Transliteration failed: ${(e as Error).message}`, system, durationMs },
      500,
    )
  }
}
