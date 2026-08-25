/**
 * Service Worker for interscript.org
 *
 * Offline-first caching strategy:
 *   - Navigation requests: stale-while-revalidate (instant load + bg update)
 *   - Map IR (/maps/*.json): cache-first, never expire (they're versioned)
 *   - Static assets (_astro/*, fonts, images): cache-first
 *   - API (/api/*): network-only (always fresh)
 *
 * On first visit, populates the cache. Subsequent visits work offline.
 * Map IR is the heavy payload (8MB+) — caching it makes the worker,
 * batch processor, and compare mode all work without a network.
 */

const VERSION = "isx-sw-v1"
const CORE_CACHE = `${VERSION}-core`
const MAP_CACHE = `${VERSION}-maps`

const CORE_ASSETS = [
  "/",
  "/offline.html",
  "/symbol.svg",
  "/favicon.svg",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS).catch(() => undefined)),
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION))
          .map((k) => caches.delete(k)),
      ),
    ),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const req = event.request
  const url = new URL(req.url)

  // Same-origin only — let cross-origin requests pass through.
  if (url.origin !== self.location.origin) return

  // API: network-only, never cache.
  if (url.pathname.startsWith("/api/")) return

  // Map IR: cache-first (immutable files, versioned by content).
  if (url.pathname.startsWith("/maps/") && url.pathname.endsWith(".json")) {
    event.respondWith(cacheFirst(req, MAP_CACHE))
    return
  }

  // Static assets (_astro/*, fonts, images): cache-first.
  if (
    url.pathname.startsWith("/_astro/") ||
    url.pathname.startsWith("/fonts/") ||
    /\.(?:woff2?|ttf|otf|png|jpg|jpeg|gif|svg|webp|css|js)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(req, CORE_CACHE))
    return
  }

  // Navigation (HTML pages): stale-while-revalidate with offline fallback.
  if (req.mode === "navigate") {
    event.respondWith(staleWhileRevalidate(req))
    return
  }
})

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(req)
  if (cached) return cached
  try {
    const res = await fetch(req)
    if (res.ok) cache.put(req, res.clone())
    return res
  } catch {
    return cached ?? new Response("Offline", { status: 503 })
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CORE_CACHE)
  const cached = await cache.match(req)
  const fetchPromise = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone())
      return res
    })
    .catch(() => cached)
  return cached || fetchPromise
}
