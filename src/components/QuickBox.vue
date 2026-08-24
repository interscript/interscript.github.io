<script setup lang="ts">
/**
 * Quick transliteration widget — compact inline island for blog posts,
 * doc pages, etc. Picks a system from a small curated list and shows
 * the result below the input.
 *
 * Loading interscript-ts dynamically keeps the page bundle small.
 */
import { ref, computed, onMounted } from "vue"

interface Props {
  /** Optional initial system code. */
  defaultSystem?: string
  /** Optional initial input text. */
  defaultInput?: string
  /** Compact layout (no header). */
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultSystem: "bgnpcgn-ukr-Cyrl-Latn-2019",
  defaultInput: "Антон",
  compact: false,
})

const systems = [
  { code: "bgnpcgn-ukr-Cyrl-Latn-2019", label: "BGN/PCGN Ukrainian (2019)" },
  { code: "bgnpcgn-deu-Latn-Latn-2000", label: "BGN/PCGN German (2000)" },
  { code: "odni-rus-Cyrl-Latn-2015", label: "ODNI Russian (2015)" },
  { code: "alalc-amh-Ethi-Latn-2011", label: "ALA-LC Amharic (2011)" },
  { code: "un-tam-Taml-Latn-1972", label: "UN Tamil (1972)" },
]

const selected = ref(props.defaultSystem)
const input = ref(props.defaultInput)
const ready = ref(false)
let transliterateFn: ((code: string, input: string) => string) | null = null

async function ensureEngine() {
  if (transliterateFn) return
  try {
    const mod = await import("interscript-ts")
    const wanted = new Set<string>(systems.map((s) => s.code))
    const sources: Record<string, string> = {}
    const libJsons: Record<string, unknown> = {}
    const fetchOne = async (code: string) => {
      if (sources[code]) return
      const res = await fetch(`/maps/${code}.isc`)
      if (res.ok) {
        const text = await res.text()
        sources[code] = text
        for (const dep of mod.parseIsc(text, `${code}.isc`).dependencies) wanted.add(dep.target)
        return
      }
      // Libraries (.iml) ship as compiled JSON — no ISC form.
      const lib = await fetch(`/maps/${code}.json`)
      if (!lib.ok) return
      libJsons[code] = await lib.json()
    }
    for (const code of wanted) await fetchOne(code)
    for (const code of [...wanted]) await fetchOne(code)
    mod.reset()
    mod.configure({
      strategies: [mod.iscBundledStrategy(sources), mod.bundledStrategy(libJsons)],
    })
    transliterateFn = mod.transliterate
    ready.value = true
  } catch (e) {
    console.error("interscript-ts load failed:", e)
  }
}

const output = computed(() => {
  if (!transliterateFn) return ""
  try {
    return transliterateFn(selected.value, input.value)
  } catch {
    return ""
  }
})

onMounted(ensureEngine)
</script>

<template>
  <div class="quick" :class="{ compact }">
    <div v-if="!compact" class="header">
      <label for="qs">Quick transliteration</label>
    </div>
    <select id="qs" v-model="selected" class="select">
      <option v-for="s in systems" :key="s.code" :value="s.code">{{ s.label }}</option>
    </select>
    <input
      v-model="input"
      type="text"
      class="input"
      placeholder="Type text…"
      :disabled="!ready"
    />
    <div class="output" :class="{ placeholder: !output }">
      {{ output || (ready ? '—' : 'Loading…') }}
    </div>
  </div>
</template>

<style scoped>
.quick {
  border: 1px solid var(--border, #ddd);
  border-radius: 6px;
  padding: 0.75rem;
  background: var(--surface, #f8f8f8);
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.4rem;
}
.quick.compact {
  padding: 0.5rem;
}
.header {
  font-size: 0.85rem;
  color: var(--muted, #666);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.select,
.input {
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--border, #ddd);
  border-radius: 4px;
  background: white;
  font-family: inherit;
  font-size: 0.95rem;
}
.output {
  padding: 0.4rem 0.5rem;
  font-family: monospace;
  background: white;
  border: 1px solid var(--border, #ddd);
  border-radius: 4px;
  min-height: 1.8rem;
}
.output.placeholder {
  color: var(--muted, #999);
}
</style>
