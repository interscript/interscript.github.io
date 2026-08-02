<script setup lang="ts">
import { ref, computed, onMounted } from "vue"

interface System {
  code: string
  label: string
}

const props = defineProps<{
  systems: System[]
}>()

const selected = ref(props.systems[0]?.code ?? "")
const input = ref("Антон")
const error = ref<string | null>(null)
const engine = ref<"ready" | "loading" | "missing">("loading")
// Must be a ref so the `output` computed re-evaluates when the engine
// finishes loading. A plain `let` is invisible to Vue's reactivity tracker.
const transliterateFn = ref<((code: string, input: string) => string) | null>(null)

async function ensureEngine() {
  if (transliterateFn.value) return transliterateFn.value
  engine.value = "loading"
  try {
    const mod = await import("interscript-ts")
    // fetch() the systems we need + their full transitive dep closure.
    // Loop until the wanted set stops growing — a dep may itself have
    // deps that need fetching (e.g. bgnpcgn-ukr → un-ukr → ua-ukr).
    const wanted = new Set<string>(props.systems.map((s) => s.code))
    const maps: Record<string, unknown> = {}
    const fetchOne = async (code: string) => {
      if (maps[code]) return
      const res = await fetch(`/maps/${code}.json`)
      if (!res.ok) return
      const json = (await res.json()) as { dependencies?: string[] }
      maps[code] = json
      for (const dep of json.dependencies ?? []) wanted.add(dep)
    }
    let prevSize = 0
    while (wanted.size > prevSize) {
      prevSize = wanted.size
      for (const code of wanted) await fetchOne(code)
    }
    mod.reset()
    mod.configure({ strategies: [mod.bundledStrategy(maps)] })
    transliterateFn.value = mod.transliterate
    engine.value = "ready"
  } catch (e) {
    engine.value = "missing"
    error.value = `Failed to load interscript-ts: ${(e as Error).message}`
  }
  return transliterateFn.value
}

const output = computed(() => {
  const fn = transliterateFn.value
  if (!fn) return ""
  try {
    error.value = null
    return fn(selected.value, input.value)
  } catch (e) {
    error.value = (e as Error).message
    return ""
  }
})

const inputChars = computed(() => Array.from(input.value).length)
const outputChars = computed(() => Array.from(output.value).length)

onMounted(ensureEngine)
</script>

<template>
  <div class="explorer">
    <div class="explorer-grid">
      <aside class="rail">
        <div class="rail-head">
          <span
            class="rail-status"
            :class="{
              'is-loading': engine === 'loading',
              'is-ready': engine === 'ready',
              'is-missing': engine === 'missing',
            }"
            >{{ engine }}</span
          >
          <p class="rail-label">Engine status</p>
        </div>

        <label class="field">
          <span class="field-label">System</span>
          <select v-model="selected" class="field-input">
            <option v-for="s in systems" :key="s.code" :value="s.code">{{ s.label }}</option>
          </select>
        </label>

        <div class="rail-system-code">
          <p class="rail-label">System code</p>
          <code>{{ selected }}</code>
        </div>
      </aside>

      <div class="work">
        <div class="pane pane-input">
          <header class="pane-header">
            <span class="pane-label">Input</span>
            <span class="pane-meta">{{ inputChars }} chars</span>
          </header>
          <textarea
            v-model="input"
            rows="4"
            class="pane-body"
            placeholder="Type source text…"
            spellcheck="false"
            autocomplete="off"
          ></textarea>
        </div>

        <div class="pane pane-output">
          <header class="pane-header">
            <span class="pane-label">Output</span>
            <span class="pane-meta">{{ outputChars }} chars</span>
          </header>
          <output class="pane-body pane-result">{{
            output || (engine === 'ready' ? '—' : 'Loading transliteration engine…')
          }}</output>
        </div>

        <div v-if="error" class="error-banner" role="alert">
          <strong>Error:</strong> {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explorer {
  background: var(--color-vellum);
  border: 1px solid var(--color-rule);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 0 var(--color-rule);
}
.explorer-grid {
  display: grid;
  grid-template-columns: 18rem 1fr;
  min-height: 24rem;
}
@media (max-width: 768px) {
  .explorer-grid {
    grid-template-columns: 1fr;
  }
}
.rail {
  background: var(--color-parchment);
  border-right: 1px solid var(--color-rule);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
@media (max-width: 768px) {
  .rail {
    border-right: none;
    border-bottom: 1px solid var(--color-rule);
  }
}
.rail-head { display: flex; flex-direction: column; gap: 0.25rem; }
.rail-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  width: fit-content;
}
.rail-status::before {
  content: "";
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: currentColor;
}
.rail-status.is-loading {
  background: color-mix(in srgb, var(--color-saffron) 12%, transparent);
  color: var(--color-saffron);
}
.rail-status.is-ready {
  background: color-mix(in srgb, #16a34a 12%, transparent);
  color: #16a34a;
}
.rail-status.is-missing {
  background: color-mix(in srgb, var(--color-ochre) 12%, transparent);
  color: var(--color-ochre);
}
.rail-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-stone);
  margin: 0;
}
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-stone);
}
.field-input {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--color-rule);
  border-radius: 3px;
  background: var(--color-vellum);
  color: var(--color-ink);
}
.field-input:focus-visible {
  outline: 2px solid var(--color-ochre);
  outline-offset: 1px;
}
.rail-system-code code {
  font-size: 0.75rem;
  word-break: break-all;
}
.work {
  display: grid;
  grid-template-rows: 1fr 1fr auto;
}
.pane {
  display: flex;
  flex-direction: column;
  min-height: 9rem;
}
.pane-input { border-bottom: 1px solid var(--color-rule); }
.pane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: color-mix(in srgb, var(--color-ink) 4%, transparent);
}
.pane-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-stone);
}
.pane-meta {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--color-stone-light);
}
.pane-body {
  flex: 1;
  padding: 1rem 1.25rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  line-height: 1.5;
  border: none;
  background: transparent;
  resize: none;
  color: var(--color-ink);
}
.pane-body:focus-visible {
  outline: 2px solid var(--color-ochre);
  outline-offset: -2px;
}
.pane-result {
  font-style: italic;
  color: var(--color-ochre);
  white-space: pre-wrap;
  word-break: break-word;
}
.error-banner {
  padding: 0.75rem 1.25rem;
  background: color-mix(in srgb, var(--color-ochre) 8%, transparent);
  color: var(--color-ochre);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  border-top: 1px solid var(--color-rule);
}
</style>
