<script setup lang="ts">
/**
 * MapPreview — single-system transliteration widget for the map detail
 * page. Smaller surface than MapExplorer; dedicated to one system code.
 *
 * If the system's IR isn't bundled (most of the 287 maps), the widget
 * explains that and offers the Ruby gem path. For the 15 bundled
 * systems, it transliterates live.
 */
import { ref, computed, onMounted } from "vue"

interface Props {
  systemCode: string
  systemName: string
  sourceScript: string
  destinationScript: string
  initialInput?: string
  /** When false, shows the install-notice fallback without trying to load. */
  liveDemoable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialInput: "",
  liveDemoable: false,
})

const input = ref(props.initialInput)
const engine = ref<"ready" | "loading" | "missing" | "unavailable">("loading")
const errorMessage = ref<string | null>(null)

let transliterateFn: ((code: string, input: string) => string) | null = null

async function ensureEngine() {
  if (!props.liveDemoable) {
    engine.value = "unavailable"
    return
  }
  engine.value = "loading"
  try {
    const mod = await import("interscript")
    // Fetch this system + its transitive deps. import.meta.glob can't
    // see public/ files in dev.
    const wanted = new Set<string>([props.systemCode])
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
    engine.value = "ready"
  } catch (e) {
    engine.value = "missing"
    errorMessage.value = (e as Error).message
  }
}

const runResult = computed<{ value: string; error: string | null }>(() => {
  if (engine.value !== "ready" || !transliterateFn) return { value: "", error: null }
  try {
    return { value: transliterateFn(props.systemCode, input.value), error: null }
  } catch (e) {
    return { value: "", error: (e as Error).message }
  }
})
const output = computed(() => runResult.value.value)

onMounted(ensureEngine)
</script>

<template>
  <div class="preview">
    <div v-if="engine === 'unavailable'" class="notice">
      <p>
        <strong>Live preview not available for this system.</strong>
        This map has no browser-bundled ISC source. To run it locally:
      </p>
      <pre><code># Ruby
gem install interscript
interscript -s {{ systemCode }} input.txt

# TypeScript (after npm install interscript-ts)
import {{ '{' }} transliterate {{ '}' }} from "interscript"
transliterate("{{ systemCode }}", "your input")</code></pre>
    </div>

    <div v-else class="work">
      <div class="pane pane-input">
        <header class="pane-header">
          <span class="pane-label">Input ({{ sourceScript }})</span>
        </header>
        <textarea
          v-model="input"
          rows="3"
          class="pane-body"
          :placeholder="`Type text in ${sourceScript}…`"
          spellcheck="false"
        ></textarea>
      </div>

      <div class="pane pane-output">
        <header class="pane-header">
          <span class="pane-label">Output ({{ destinationScript }})</span>
          <span
            class="pane-status"
            :class="{
              loading: engine === 'loading',
              ready: engine === 'ready',
              missing: engine === 'missing',
            }"
            >{{ engine }}</span
          >
        </header>
        <output class="pane-body pane-result">{{
          output || (engine === "ready" ? "—" : "Loading engine…")
        }}</output>
      </div>

      <div v-if="runResult.error || errorMessage" class="error-banner" role="alert">
        <strong>Error:</strong> {{ runResult.error || errorMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview {
  border: 1px solid var(--color-rule);
  border-radius: 4px;
  overflow: hidden;
  background: var(--color-vellum);
}
.notice {
  padding: 2rem;
}
.notice p {
  margin: 0 0 1rem;
  color: var(--color-ink);
}
.notice pre {
  margin: 0;
}
.work {
  display: grid;
  grid-template-rows: 1fr 1fr auto;
}
.pane {
  display: flex;
  flex-direction: column;
}
.pane-input {
  border-bottom: 1px solid var(--color-rule);
}
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
.pane-status {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
}
.pane-status.loading {
  background: color-mix(in srgb, var(--color-saffron) 12%, transparent);
  color: var(--color-saffron);
}
.pane-status.ready {
  background: color-mix(in srgb, #16a34a 12%, transparent);
  color: #16a34a;
}
.pane-status.missing {
  background: color-mix(in srgb, var(--color-ochre) 12%, transparent);
  color: var(--color-ochre);
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
  min-height: 5rem;
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
