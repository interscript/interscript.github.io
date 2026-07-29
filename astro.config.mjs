// @ts-check
import { defineConfig } from "astro/config"
import vue from "@astrojs/vue"
import tailwindcss from "@tailwindcss/vite"

// Interscript.org v2 — Astro 7 + Vite 8 + Tailwind 4 + Vue 3 islands.
// Uses interscript-ts for the map explorer.
export default defineConfig({
  site: "https://www.interscript.org",
  output: "static",
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
  },
})
