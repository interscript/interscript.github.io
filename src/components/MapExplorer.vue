<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { createWorkerClient, type WorkerClient } from "../scripts/worker-client"

interface System {
  code: string
  label: string
}

const props = defineProps<{
  systems: System[]
}>()

const API_ENDPOINT = "https://api.interscript.org/v1/transliterate"
const DEBOUNCE_MS = 300

type Mode = "api" | "browser"

const mode = ref<Mode>("api")
const selected = ref(props.systems[0]?.code ?? "")
const input = ref("Антон")
const output = ref("")
const error = ref<string | null>(null)
const status = ref<"loading" | "ready" | "missing">("loading")

const inputChars = computed(() => Array.from(input.value).length)
const outputChars = computed(() => Array.from(output.value).length)

let worker: WorkerClient | undefined
let timer: number | undefined
let seq = 0

async function runApi(text: string): Promise<string> {
  const res = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ system: selected.value, input: text }),
  })
  const body = (await res.json().catch(() => null)) as {
    output?: unknown
    error?: { message?: string }
  } | null
  if (typeof body?.output !== "string") {
    throw new Error(body?.error?.message ?? `API error (HTTP ${res.status})`)
  }
  return body.output
}

async function runBrowser(text: string): Promise<string> {
  worker ??= createWorkerClient()
  return worker.transliterate(selected.value, text)
}

function schedule() {
  const text = input.value
  const mySeq = ++seq
  if (timer) window.clearTimeout(timer)
  if (text === "") {
    output.value = ""
    return
  }
  timer = window.setTimeout(async () => {
    try {
      const result =
        mode.value === "api" ? await runApi(text) : await runBrowser(text)
      if (mySeq !== seq) return
      output.value = result
      error.value = null
      status.value = "ready"
    } catch (e) {
      if (mySeq !== seq) return
      error.value = (e as Error).message
      // A failed in-browser engine boot is terminal; API errors are
      // transient (network) and surface via the banner alone.
      if (mode.value === "browser" && status.value !== "ready") {
        status.value = "missing"
      }
    }
  }, DEBOUNCE_MS)
}

watch([selected, input, mode], schedule)

watch(mode, () => {
  error.value = null
  if (status.value !== "ready") status.value = "loading"
})

onMounted(schedule)

onBeforeUnmount(() => {
  worker?.terminate()
  if (timer) window.clearTimeout(timer)
})
</script>

<template>
  <div class="explorer">
    <div class="explorer-grid">
      <aside class="rail">
        <div class="rail-head">
          <span
            class="rail-status"
            :class="{
              'is-loading': status === 'loading',
              'is-ready': status === 'ready',
              'is-missing': status === 'missing',
            }"
            >{{ status }}</span
          >
          <p class="rail-label">Engine status</p>
        </div>

        <div class="mode-switch" role="radiogroup" aria-label="Transliteration mode">
          <button
            type="button"
            role="radio"
            :aria-checked="mode === 'api'"
            class="mode-btn"
            :class="{ 'is-active': mode === 'api' }"
            data-testid="mode-api"
            @click="mode = 'api'"
          >
            API
          </button>
          <button
            type="button"
            role="radio"
            :aria-checked="mode === 'browser'"
            class="mode-btn"
            :class="{ 'is-active': mode === 'browser' }"
            data-testid="mode-browser"
            @click="mode = 'browser'"
          >
            In-browser
          </button>
        </div>
        <p class="rail-hint">
          {{
            mode === "api"
              ? "Transliterates on api.interscript.org"
              : "Runs interscript-ts locally with ISC maps — downloads them on first use"
          }}
        </p>

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
            output || (status === "ready" ? "—" : "Loading transliteration engine…")
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
.mode-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--color-rule);
  border-radius: 3px;
  overflow: hidden;
}
.mode-btn {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.5rem 0.5rem;
  border: none;
  background: var(--color-vellum);
  color: var(--color-stone);
  cursor: pointer;
}
.mode-btn.is-active {
  background: color-mix(in srgb, var(--color-ink) 92%, var(--color-vellum));
  color: var(--color-vellum);
}
.mode-btn:focus-visible {
  outline: 2px solid var(--color-ochre);
  outline-offset: -2px;
}
.rail-hint {
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-stone-light);
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
