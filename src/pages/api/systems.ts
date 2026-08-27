/**
 * Public REST API: /api/systems
 *
 * GET /api/systems                    — list every system code
 * GET /api/systems?authority=bgnpcgn  — filter by authority
 * GET /api/systems?source_script=Cyrl — filter by source script
 * GET /api/systems?destination_script=Latn
 *
 * Response: { count, systems: [{code, authority, source_script, destination_script, name, year}] }
 *
 * Catalogue is bundled at build time — no runtime I/O. Cheap to serve.
 */

import type { APIRoute } from "astro"
import catalogue from "../../data/maps-catalogue.json" with { type: "json" }

export const prerender = false

interface MapEntry {
  data: {
    authority_id: string
    id: string
    source_script: string
    destination_script: string
    name: string
    creation_date?: string
  }
}

export const GET: APIRoute = ({ url }) => {
  const authority = url.searchParams.get("authority")
  const source = url.searchParams.get("source_script")
  const dest = url.searchParams.get("destination_script")

  const systems = Object.entries(catalogue)
    .map(([code, entry]) => ({ code, ...(entry as MapEntry).data }))
    .filter((s) => {
      if (authority && s.authority_id !== authority) return false
      if (source && s.source_script !== source) return false
      if (dest && s.destination_script !== dest) return false
      return true
    })
    .map((s) => ({
      code: s.code,
      authority: s.authority_id,
      source_script: s.source_script,
      destination_script: s.destination_script,
      name: s.name,
      year: s.creation_date ?? s.id,
    }))
    .sort((a, b) => a.code.localeCompare(b.code))

  return new Response(JSON.stringify({ count: systems.length, systems }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  })
}

export const OPTIONS: APIRoute = () => new Response(null, { status: 204 })
