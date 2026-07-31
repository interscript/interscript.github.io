/**
 * Public REST API: /api/detect
 *
 * GET /api/detect?input=<source>&output=<romanization>&source_script=Cyrl
 *
 * Returns ranked candidates from systems that handle source_script → Latin.
 * Uses the detector's Levenshtein ranking. Limited to the systems we know
 * about (catalogue) for speed.
 */

import type { APIRoute } from "astro"
import catalogue from "../../data/maps-catalogue.json" with { type: "json" }

export const prerender = false

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  let prev = new Array<number>(b.length + 1)
  let curr = new Array<number>(b.length + 1)
  for (let j = 0; j <= b.length; j++) prev[j] = j
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j]! + 1, curr[j - 1]! + 1, prev[j - 1]! + cost)
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[b.length]!
}

interface MapEntry {
  data: { source_script: string; destination_script: string }
}

export const GET: APIRoute = ({ url }) => {
  const input = url.searchParams.get("input")
  const output = url.searchParams.get("output")
  const sourceScript = url.searchParams.get("source_script")
  if (!input || !output) {
    return new Response(
      JSON.stringify({ error: "Both input and output are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }

  // Detect is meant for the client-side playground — this endpoint
  // returns the candidate system list with their authority metadata.
  // The actual Levenshtein ranking happens client-side (needs to
  // transliterate through each system).
  const candidates = Object.entries(catalogue)
    .filter(([, e]) => {
      const d = (e as MapEntry).data
      if (sourceScript && d.source_script !== sourceScript) return false
      return d.destination_script === "Latn"
    })
    .map(([code]) => ({ code }))

  // For client convenience, also return a worked example if requested.
  const sample = url.searchParams.get("sample")
  const sampleDistance = sample ? levenshtein(input, sample) : undefined

  return new Response(
    JSON.stringify({
      input,
      output,
      source_script: sourceScript,
      candidate_count: candidates.length,
      candidates,
      ...(sample !== null ? { sample_distance: sampleDistance } : {}),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    },
  )
}

export const OPTIONS: APIRoute = () => new Response(null, { status: 204 })
