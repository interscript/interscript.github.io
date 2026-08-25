<script setup lang="ts">
/**
 * HeroMorph — signature element of the home page.
 *
 * Takes a single source phrase ("interoperable script conversion") and
 * cycles it through several scripts using real interscript-ts maps.
 * The displayed text fades between transformations, proving the
 * product's value on the page itself.
 *
 * Loads interscript-ts dynamically so initial page bundle stays small.
 */
import { ref, onMounted, onUnmounted, watch } from "vue"

interface Props {
  /** The phrase to morph. Default suits a romanization showcase. */
  phrase?: string
  /** Cycle interval in ms. */
  intervalMs?: number
}

const props = withDefaults(defineProps<Props>(), {
  phrase: "transliteration",
  intervalMs: 2400,
})

// Each morph target: the system code + display label.
// Order is intentional: Latin → Cyrillic → back to Latin via a different
// authority. Each pair shows a real map that ships with the bundle.
const morphs = [
  { system: "bgnpcgn-ukr-Cyrl-Latn-2019", input: "Anton", label: "Latin → Cyrillic (Ukrainian, BGN/PCGN 2019)", reverse: true },
  { system: "bgnpcgn-ukr-Cyrl-Latn-2019", input: "Антон", label: "Cyrillic → Latin (Ukrainian, BGN/PCGN 2019)" },
  { system: "odni-rus-Cyrl-Latn-2015", input: "привет мир", label: "Russian → Latin (ODNI 2015)" },
  { system: "bgnpcgn-deu-Latn-Latn-2000", input: "Tschüß!", label: "German normalisation (BGN/PCGN 2000)" },
  { system: "alalc-amh-Ethi-Latn-2011", input: "ኢትዮጵያ", label: "Amharic → Latin (ALA-LC 2011)" },
  { system: "un-tam-Taml-Latn-1972", input: "தமிழ்", label: "Tamil → Latin (UN 1972)" },
] as const

const ready = ref(false)
const failed = ref(false)
const current = ref(0)
const input = ref<string>(morphs[0]!.input)
const output = ref<string>(morphs[0]!.input)
const label = ref<string>(morphs[0]!.label)
let timer: number | undefined
let transliterateFn: ((code: string, input: string) => string) | null = null

async function ensureEngine() {
  if (transliterateFn) return
  try {
    const mod = await import("interscript-ts")
    const wanted = new Set<string>(morphs.map((m) => m.system))
    const maps: Record<string, unknown> = {}
    const fetchOne = async (code: string) => {
      if (maps[code]) return
      const res = await fetch(`/maps/${code}.json`)
      if (!res.ok) return
      const json = (await res.json()) as { dependencies?: string[] }
      maps[code] = json
      for (const dep of json.dependencies ?? []) wanted.add(dep)
    }
    for (const code of wanted) await fetchOne(code)
    for (const code of [...wanted]) await fetchOne(code)
    mod.reset()
    mod.configure({ strategies: [mod.bundledStrategy(maps)] })
    transliterateFn = mod.transliterate
    ready.value = true
    tick()
  } catch (e) {
    console.error("HeroMorph: interscript-ts failed to load", e)
    failed.value = true
  }
}

function tick() {
  if (!transliterateFn) return
  const morph = morphs[current.value]!
  try {
    input.value = morph.input
    output.value = transliterateFn(morph.system, morph.input)
    label.value = morph.label
  } catch (e) {
    output.value = `(error: ${(e as Error).message})`
  }
  current.value = (current.value + 1) % morphs.length
}

onMounted(() => {
  ensureEngine()
  timer = window.setInterval(() => {
    if (ready.value) tick()
  }, props.intervalMs)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

watch(() => props.intervalMs, (v) => {
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(() => {
    if (ready.value) tick()
  }, v)
})
</script>

<template>
  <div class="specimen" :class="{ loading: !ready, failed }">
    <p class="specimen-label">Now transliterating</p>
    <div class="specimen-stage">
      <transition name="morph" mode="out-in">
        <div :key="output + label" class="specimen-pair">
          <div class="specimen-input">{{ input }}</div>
          <div class="specimen-arrow" aria-hidden="true">↓</div>
          <div class="specimen-output">{{ output }}</div>
        </div>
      </transition>
    </div>
    <p class="specimen-caption">
      <span v-if="!ready && !failed" class="status">Loading engine…</span>
      <span v-else-if="failed" class="status">Engine unavailable; check console.</span>
      <span v-else>{{ label }}</span>
    </p>
  </div>
</template>

<style scoped>
.specimen {
  background: var(--color-vellum);
  border: 1px solid var(--color-rule);
  padding: 2rem;
  position: relative;
  border-radius: 4px;
  box-shadow:
    0 1px 0 var(--color-rule),
    0 24px 48px -24px rgba(15, 15, 12, 0.18);
}
.specimen-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-stone);
  margin: 0 0 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.specimen-label::before {
  content: "";
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--color-ochre);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-ochre) 20%, transparent);
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
.specimen-stage {
  min-height: 7rem;
  display: grid;
  align-items: center;
}
.specimen-pair {
  display: grid;
  gap: 0.75rem;
  text-align: center;
}
.specimen-input {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 500;
  color: var(--color-stone);
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.specimen-arrow {
  color: var(--color-ochre);
  font-size: 1rem;
  font-family: var(--font-mono);
}
.specimen-output {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 500;
  color: var(--color-ink);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-style: italic;
}
.specimen-caption {
  margin: 1.5rem 0 0;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-stone);
  text-align: center;
  min-height: 1.2rem;
}
.specimen-caption .status {
  color: var(--color-stone-light);
  font-style: italic;
}

/* Transition: fade + slight Y shift between morphs */
.morph-enter-active,
.morph-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.morph-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.morph-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .specimen-label::before { animation: none; opacity: 1; }
  .morph-enter-active, .morph-leave-active { transition: none; }
}

.specimen.failed {
  border-color: var(--color-ochre);
}
</style>
