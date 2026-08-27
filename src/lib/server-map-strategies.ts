/**
 * Server-side map loading for the /api/* SSR routes.
 *
 * ISC maps resolve first (read straight from public/maps — no HTTP
 * roundtrip); the JSON filesystem fallback serves the .iml libraries
 * (posix/unicode/var-*), which have no ISC form.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { iscStrategy, type LoadStrategy } from "interscript"
import { filesystemStrategy } from "interscript/loaders.node"

const MAPS_DIR = resolve(process.cwd(), "public/maps")

function iscFilesystemStrategy(): LoadStrategy {
  return iscStrategy({
    baseUrl: "file://local-maps",
    fetchFn: (input: RequestInfo | URL) => {
      const url = String(input)
      const code = decodeURIComponent(url.slice(url.lastIndexOf("/") + 1).replace(/\.isc$/, ""))
      try {
        const source = readFileSync(resolve(MAPS_DIR, `${code}.isc`), "utf8")
        return Promise.resolve(new Response(source, { status: 200 }))
      } catch {
        return Promise.resolve(new Response(null, { status: 404 }))
      }
    },
  })
}

export function serverMapStrategies(): LoadStrategy[] {
  return [iscFilesystemStrategy(), filesystemStrategy(MAPS_DIR)]
}
