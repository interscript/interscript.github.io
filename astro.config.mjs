// @ts-check
import { defineConfig } from "astro/config"
import vue from "@astrojs/vue"
import tailwindcss from "@tailwindcss/vite"
import node from "@astrojs/node"

// Interscript.org v2 — Astro 7 + Vite 8 + Tailwind 4 + Vue 3 islands.
// Static output by default; per-route opt-out via `export const prerender = false`.
// The /api/* endpoints are real on-demand Node routes served via
// @astrojs/node. Deploy target: any Node-capable host.
export default defineConfig({
  site: "https://www.interscript.org",
  output: "static",
  adapter: node({ mode: "standalone" }),
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
  },
})
