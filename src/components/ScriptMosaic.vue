<script setup lang="ts">
/**
 * ScriptMosaic — signature element of the Interscript home page.
 *
 * A grid of live transliteration cards, each cycling through real
 * interscript-ts systems. The grid IS the design: many scripts,
 * working at once, like a museum of writing systems.
 *
 * Loads interscript-ts dynamically so initial page bundle stays small.
 */
import { ref, onMounted, onUnmounted } from "vue"

interface Props {
  /** Cell cycle interval in ms. */
  intervalMs?: number
  /** Stagger between cells in ms (cells rotate out of phase). */
  staggerMs?: number
}

const props = withDefaults(defineProps<Props>(), {
  intervalMs: 3200,
  staggerMs: 530,
})

// Each cell rotates through 2-3 transformations. Cells are deliberately
// heterogeneous: Cyrillic, Arabic, Devanagari, Han, Ethiopic, Greek.
// All systems ship with the bundled IR catalogue.
interface Transform {
  system: string
  input: string
  authority: string
  note: string
}

interface Cell {
  id: string
  script: string
  transforms: Transform[]
}

const cells: Cell[] = [
  {
    id: "cyrillic",
    script: "Cyrillic",
    transforms: [
      { system: "bgnpcgn-ukr-Cyrl-Latn-2019", input: "Антон", authority: "BGN/PCGN", note: "Ukrainian · 2019" },
      { system: "odni-rus-Cyrl-Latn-2015", input: "Калинина", authority: "ODNI", note: "Russian · 2015" },
      { system: "icao-ukr-Cyrl-Latn-9303", input: "Київ", authority: "ICAO", note: "Travel docs · 9303" },
    ],
  },
  {
    id: "arabic",
    script: "Arabic",
    transforms: [
      { system: "bgnpcgn-ara-Arab-Latn-1956", input: "عَبد الله", authority: "BGN/PCGN", note: "Arabic · 1956" },
      { system: "iso-ara-Arab-Latn-233-1984", input: "القاهرة", authority: "ISO", note: "Arabic · 233" },
      { system: "alalc-ara-Arab-Latn-1997", input: "بَغداد", authority: "ALA-LC", note: "Arabic · 1997" },
    ],
  },
  {
    id: "devanagari",
    script: "Devanagari",
    transforms: [
      { system: "un-hin-Deva-Latn-1972", input: "महात्मा", authority: "UN", note: "Hindi · 1972" },
      { system: "alalc-mar-Deva-Latn-1997", input: "मुंबई", authority: "ALA-LC", note: "Marathi · 1997" },
      { system: "iso-hin-Deva-Latn-15919-2001", input: "फिलिपींस", authority: "ISO", note: "ISO 15919" },
    ],
  },
  {
    id: "han",
    script: "Han",
    transforms: [
      { system: "acadsin-zho-Hani-Latn-2002", input: "台北", authority: "Academia Sinica", note: "Tongyong · 2002" },
      { system: "bgnpcgn-zho-Hani-Latn-1979", input: "北京", authority: "BGN/PCGN", note: "Hanyu Pinyin · 1979" },
      { system: "iso-zho-Hani-Latn-1996", input: "香港", authority: "ISO", note: "ISO 7098 · 1996" },
    ],
  },
  {
    id: "ethiopic",
    script: "Ethiopic",
    transforms: [
      { system: "alalc-amh-Ethi-Latn-2011", input: "ኢትዮጵያ", authority: "ALA-LC", note: "Amharic · 2011" },
      { system: "bgnpcgn-amh-Ethi-Latn-1967", input: "አዲስ አበባ", authority: "BGN/PCGN", note: "Amharic · 1967" },
    ],
  },
  {
    id: "greek",
    script: "Greek",
    transforms: [
      { system: "iso-grc-Grek-Latn-843-1997", input: "Αθήνα", authority: "ISO", note: "Greek · 843/1997" },
      { system: "alalc-grc-Grek-Latn-1997", input: "Θεσσαλονίκη", authority: "ALA-LC", note: "Greek · 1997" },
      { system: "bgnpcgn-grc-Grek-Latn-1962", input: "Ελλάδα", authority: "BGN/PCGN", note: "Greek · 1962" },
    ],
  },
]

const ready = ref(false)
const failed = ref(false)
const indices = ref<number[]>(cells.map(() => 0))
const outputs = ref<string[]>(cells.map((c) => c.transforms[0]!.input))
let timer: number | undefined
let transliterateFn: ((code: string, input: string) => string) | null = null

async function ensureEngine() {
  if (transliterateFn) return
  try {
    const mod = await import("interscript-ts")
    const modules = import.meta.glob("/maps/*.json", { eager: true, as: "raw" })
    const maps: Record<string, unknown> = {}
    for (const [path, raw] of Object.entries(modules)) {
      const code = path.match(/\/maps\/(.+)\.json$/)?.[1]
      if (code) maps[code] = JSON.parse(raw as string)
    }
    mod.reset()
    mod.configure({ strategies: [mod.bundledStrategy(maps)] })
    transliterateFn = mod.transliterate
    ready.value = true
    // Initial render of all cells
    for (let i = 0; i < cells.length; i++) tickCell(i)
  } catch (e) {
    console.error("ScriptMosaic: interscript-ts failed to load", e)
    failed.value = true
  }
}

function tickCell(i: number) {
  if (!transliterateFn) return
  const cell = cells[i]!
  const next = (indices.value[i]! + 1) % cell.transforms.length
  indices.value[i] = next
  const tf = cell.transforms[next]!
  try {
    outputs.value[i] = transliterateFn(tf.system, tf.input)
  } catch (e) {
    outputs.value[i] = `(error)`
  }
}

function tick() {
  if (!ready.value) return
  // Stagger ticks: one cell per staggerMs interval
  let i = 0
  const step = () => {
    tickCell(i % cells.length)
    i++
    if (i < cells.length) staggerTimer = window.setTimeout(step, props.staggerMs)
  }
  step()
}

let staggerTimer: number | undefined

onMounted(() => {
  ensureEngine()
  timer = window.setInterval(tick, props.intervalMs)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
  if (staggerTimer) window.clearTimeout(staggerTimer)
})
</script>

<template>
  <div class="mosaic" :class="{ loading: !ready, failed }">
    <div class="mosaic-status">
      <span class="status-dot" :class="{ live: ready }" aria-hidden="true"></span>
      <span v-if="!ready && !failed">Warming up the engine…</span>
      <span v-else-if="failed">Engine unavailable</span>
      <span v-else>{{ ready ? 'Live transliteration' : '' }}</span>
    </div>

    <div class="mosaic-grid">
      <article
        v-for="(cell, i) in cells"
        :key="cell.id"
        class="cell"
        :data-script="cell.id"
      >
        <header class="cell-head">
          <span class="cell-script">{{ cell.script }}</span>
          <span class="cell-counter tnum">{{ indices[i]! + 1 }}/{{ cell.transforms.length }}</span>
        </header>

        <transition name="cellmorph" mode="out-in">
          <div :key="indices[i]" class="cell-body">
            <p class="cell-input">{{ cell.transforms[indices[i]!]!.input }}</p>
            <div class="cell-meta">
              <span class="cell-arrow" aria-hidden="true">→</span>
              <span class="cell-authority">{{ cell.transforms[indices[i]!]!.authority }}</span>
              <span class="cell-note">{{ cell.transforms[indices[i]!]!.note }}</span>
            </div>
            <p class="cell-output">{{ outputs[i] }}</p>
          </div>
        </transition>
      </article>
    </div>
  </div>
</template>

<style scoped>
.mosaic {
  background: var(--color-ink);
  color: var(--color-vellum);
  padding: 1.75rem;
  border-radius: 1px;
  position: relative;
  box-shadow:
    0 1px 0 var(--color-ink-soft),
    0 32px 64px -32px rgba(14, 22, 32, 0.45);
}

.mosaic-status {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-vellum) 65%, transparent);
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.5rem;
}
.status-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--color-stone-light);
  transition: background 0.3s ease;
}
.status-dot.live {
  background: var(--color-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 25%, transparent);
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.mosaic-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: color-mix(in srgb, var(--color-vellum) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-vellum) 12%, transparent);
}
@media (min-width: 768px) {
  .mosaic-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.cell {
  background: var(--color-ink);
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 14rem;
  transition: background 0.3s ease;
}
.cell:hover {
  background: var(--color-ink-soft);
}

.cell-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid color-mix(in srgb, var(--color-vellum) 15%, transparent);
  padding-bottom: 0.625rem;
}
.cell-script {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
  font-weight: 500;
}
.cell-counter {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: color-mix(in srgb, var(--color-vellum) 45%, transparent);
}

.cell-body {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  flex: 1;
  justify-content: space-between;
}

.cell-input {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 400;
  color: color-mix(in srgb, var(--color-vellum) 85%, transparent);
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0;
  font-variation-settings: "SOFT" 100, "WONK" 0;
  word-break: break-word;
}

.cell-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-vellum) 55%, transparent);
  flex-wrap: wrap;
}
.cell-arrow {
  color: var(--color-highlight);
  font-family: var(--font-mono);
}
.cell-authority {
  color: var(--color-vellum);
  font-weight: 500;
}
.cell-note {
  color: color-mix(in srgb, var(--color-vellum) 45%, transparent);
}

.cell-output {
  font-family: var(--font-display);
  font-size: clamp(1.625rem, 2.8vw, 2.25rem);
  font-weight: 400;
  color: var(--color-highlight);
  line-height: 1.1;
  letter-spacing: -0.015em;
  font-style: italic;
  margin: 0;
  font-variation-settings: "SOFT" 100, "WONK" 1;
  word-break: break-word;
}

/* Transition */
.cellmorph-enter-active,
.cellmorph-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.cellmorph-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.cellmorph-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .status-dot.live { animation: none; opacity: 1; }
  .cellmorph-enter-active, .cellmorph-leave-active { transition: none; }
}

.mosaic.failed {
  border-color: var(--color-highlight);
}
</style>
