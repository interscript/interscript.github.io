<script setup lang="ts">
/**
 * BatchProcessor — paste many names, get them all transliterated.
 *
 * Practical for:
 *   - Libraries cleaning up catalog records
 *   - Newsrooms romanizing a story's source list
 *   - Genealogists working through parish records
 *   - Academics romanizing citation lists
 *
 * Uses the Web Worker so 500 names doesn't freeze the page.
 */
import { ref, computed, onMounted, onUnmounted } from "vue"
import { createWorkerClient, type WorkerClient } from "../scripts/worker-client"

interface Props {
  systems: { code: string; label: string }[]
}

const props = defineProps<Props>()

const system = ref(props.systems[0]?.code ?? "")
const inputText = ref("Антон\nМихаил\nКиев\nЛев Толстой")
const results = ref<{ input: string; output: string; error?: string }[]>([])
const running = ref(false)
const elapsedMs = ref(0)

let client: WorkerClient | null = null

async function ensureEngine() {
  if (client) return
  client = createWorkerClient()
}

const lines = computed(() =>
  inputText.value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0),
)

async function run() {
  if (!client) return
  running.value = true
  const start = performance.now()
  const items = lines.value
  const out: typeof results.value = []
  // Process sequentially so the user sees streaming progress. Each
  // call goes to the worker, so the main thread stays responsive.
  for (let i = 0; i < items.length; i++) {
    const input = items[i]!
    try {
      const output = await client.transliterate(system.value, input)
      out.push({ input, output })
    } catch (e) {
      out.push({ input, output: "", error: (e as Error).message })
    }
    results.value = [...out]
  }
  elapsedMs.value = Math.round(performance.now() - start)
  running.value = false
}

const inputCount = computed(() => lines.value.length)
const outputCount = computed(() => results.value.filter((r) => !r.error).length)
const errorCount = computed(() => results.value.filter((r) => r.error).length)

const csvOutput = computed(() => {
  const rows = [["input", "output", "error"]]
  for (const r of results.value) {
    rows.push([r.input, r.output, r.error ?? ""])
  }
  return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n")
})

async function copyCsv() {
  await navigator.clipboard.writeText(csvOutput.value)
}

onMounted(ensureEngine)
onUnmounted(() => client?.terminate())
</script>

<template>
  <div class="batch">
    <div class="batch-controls">
      <div class="control-field">
        <label for="batch-system">System</label>
        <select id="batch-system" v-model="system">
          <option v-for="s in systems" :key="s.code" :value="s.code">{{ s.label }}</option>
        </select>
      </div>
      <button class="run-btn" :disabled="running || inputCount === 0" @click="run">
        {{
          running ? `Working… (${results.length}/${inputCount})` : `Transliterate ${inputCount} →`
        }}
      </button>
    </div>

    <div class="batch-grid">
      <div class="input-pane">
        <header>
          <span class="pane-label">Input — one name per line</span>
          <span class="pane-count tnum">{{ inputCount }}</span>
        </header>
        <textarea
          v-model="inputText"
          spellcheck="false"
          placeholder="Антон&#10;Михаил&#10;Киев"
        ></textarea>
      </div>

      <div class="output-pane">
        <header>
          <span class="pane-label">Output</span>
          <span class="pane-stats tnum">
            <span class="ok">{{ outputCount }} ok</span>
            <span v-if="errorCount" class="err">{{ errorCount }} errors</span>
            <span v-if="elapsedMs" class="time">{{ elapsedMs }}ms</span>
          </span>
          <button v-if="results.length > 0" class="copy-btn" @click="copyCsv">Copy CSV</button>
        </header>
        <ol class="result-list">
          <li v-for="(r, i) in results" :key="i" :class="{ error: r.error }">
            <span class="row-in">{{ r.input }}</span>
            <span class="row-arrow" aria-hidden="true">→</span>
            <span v-if="r.error" class="row-err">⚠ {{ r.error }}</span>
            <span v-else class="row-out">{{ r.output }}</span>
          </li>
          <li v-if="results.length === 0 && !running" class="empty">
            Click <em>Transliterate</em> to see results.
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style scoped>
.batch {
  display: grid;
  gap: 1.5rem;
}

.batch-controls {
  display: flex;
  gap: 0.75rem;
  align-items: end;
  flex-wrap: wrap;
}
.control-field {
  display: grid;
  gap: 0.4rem;
  flex: 1;
  min-width: 240px;
}
.control-field label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-stone);
}
.control-field select {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  padding: 0.625rem 0.75rem;
  background: var(--color-vellum);
  border: 1.5px solid var(--color-rule);
  border-radius: 1px;
  color: var(--color-ink);
  outline: none;
}
.control-field select:focus {
  border-color: var(--color-brand);
}

.run-btn {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.7rem 1.25rem;
  background: var(--color-ink);
  color: var(--color-vellum);
  border: 1.5px solid var(--color-ink);
  cursor: pointer;
  border-radius: 1px;
  transition: all 0.15s ease;
}
.run-btn:hover:not(:disabled) {
  background: var(--color-brand);
  border-color: var(--color-brand);
}
.run-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.batch-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 900px) {
  .batch-grid {
    grid-template-columns: 1fr 1.2fr;
  }
}

.input-pane,
.output-pane {
  background: var(--color-vellum);
  border: 1px solid var(--color-rule);
  display: flex;
  flex-direction: column;
}
.input-pane header,
.output-pane header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-rule);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-stone);
}
.pane-label {
  flex: 1;
}
.pane-count {
  background: var(--color-paper-deep);
  padding: 0.2rem 0.55rem;
  border-radius: 1px;
  color: var(--color-ink);
}
.pane-stats {
  display: flex;
  gap: 0.625rem;
  font-size: 0.65rem;
}
.pane-stats .ok {
  color: var(--color-brand-deep);
}
.pane-stats .err {
  color: var(--color-highlight);
}
.pane-stats .time {
  color: var(--color-stone-light);
}
.copy-btn {
  font-family: inherit;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid var(--color-rule-strong);
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  color: var(--color-stone);
  border-radius: 1px;
}
.copy-btn:hover {
  background: var(--color-ink);
  color: var(--color-vellum);
  border-color: var(--color-ink);
}

textarea {
  flex: 1;
  min-height: 320px;
  font-family: var(--font-display);
  font-size: 1.0625rem;
  padding: 1rem;
  border: none;
  outline: none;
  resize: vertical;
  background: transparent;
  color: var(--color-ink);
  line-height: 1.55;
}

.result-list {
  list-style: none;
  padding: 0.5rem 1rem;
  margin: 0;
  flex: 1;
  min-height: 320px;
  max-height: 480px;
  overflow-y: auto;
}
.result-list li {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: baseline;
  gap: 0.875rem;
  padding: 0.625rem 0;
  border-bottom: 1px dashed var(--color-rule);
  font-family: var(--font-display);
  font-size: 1rem;
}
.result-list li:last-child {
  border-bottom: none;
}
.result-list li.empty {
  grid-template-columns: 1fr;
  text-align: center;
  color: var(--color-stone);
  font-style: italic;
  font-family: var(--font-sans);
  font-size: 0.9rem;
}
.result-list li.error .row-out,
.result-list li.error .row-err {
  color: var(--color-highlight);
}
.row-in {
  color: var(--color-stone);
}
.row-arrow {
  color: var(--color-highlight);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}
.row-out {
  color: var(--color-highlight);
  font-style: italic;
}
.row-err {
  color: var(--color-highlight);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-style: normal;
}
</style>
