<script setup lang="ts">
/**
 * MarcTool — paste MARC fields, romanize non-Latin content.
 *
 * Real-world use: a librarian copies MARC fields from their ILS, pastes
 * here, picks the appropriate transliteration system, and gets back
 * romanized access points to paste into the 880 field or to use for
 * cross-catalog discovery.
 *
 * Format supported: text-mode MARC (e.g. from MarcEdit), like
 *   =245 10$aАнтон Чехов
 *   =100 1\$aДостоевский, Фёдор
 *
 * Output: same fields with non-Latin subfield content romanized,
 * original kept alongside.
 */
import { ref, onMounted, onUnmounted } from "vue"
import { createWorkerClient, type WorkerClient } from "../scripts/worker-client"

interface Props {
  systems: { code: string; label: string }[]
}

const props = defineProps<Props>()

const system = ref(props.systems[0]?.code ?? "")
const inputText = ref(`=100  1#$aДостоевский, Фёдор Михайлович
=245  10$aПреступление и наказание
=700  1#$aТолстой, Лев Николаевич`)
const output = ref("")
const running = ref(false)
const error = ref<string | null>(null)

let client: WorkerClient | null = null

async function ensureEngine() {
  if (client) return
  client = createWorkerClient()
}

interface MarcLine {
  raw: string
  tag: string | null
  indicators: string
  body: string
}

function parseMarcLine(line: string): MarcLine | null {
  const m = line.match(/^=(\d{3})\s*([0-9 |#$]{2})(.*)$/)
  if (!m) return null
  return { raw: line, tag: m[1]!, indicators: m[2]!, body: m[3]! }
}

function hasNonLatin(s: string): boolean {
  // Detect non-ASCII letters (i.e. needs transliteration)
  // eslint-disable-next-line no-control-regex -- \x00-\x7F is the full ASCII range
  return /[^\x00-\x7F]/.test(s)
}

async function run() {
  if (!client) return
  running.value = true
  error.value = null

  const lines = inputText.value.split(/\r?\n/).filter(Boolean)
  const out: string[] = []

  for (const line of lines) {
    const parsed = parseMarcLine(line)
    if (!parsed) {
      out.push(line)
      continue
    }

    // Find subfields with non-Latin content and transliterate them.
    // Subfield format: $x<content>$y<content>
    const subfields = parsed.body.split(/(?=\$[a-z|0-9])/)
    const translatedParts: string[] = []
    let needsRomanization = false

    for (const sf of subfields) {
      const code = sf.match(/^\$([a-z0-9])/)?.[1]
      const content = code ? sf.slice(2) : sf
      if (code && hasNonLatin(content)) {
        try {
          const romanized = await client.transliterate(system.value, content.trim())
          translatedParts.push(`$${code} ${romanized}`)
          needsRomanization = true
        } catch {
          translatedParts.push(sf)
        }
      } else {
        translatedParts.push(sf)
      }
    }

    if (needsRomanization) {
      // Emit a parallel 880 field with the romanization
      out.push(`=880  ${parsed.indicators}${translatedParts.join("")}`)
      out.push(`# ${line}`)
    } else {
      out.push(line)
    }
  }

  output.value = out.join("\n")
  running.value = false
}

function copyOutput() {
  navigator.clipboard.writeText(output.value)
}

onMounted(ensureEngine)
onUnmounted(() => client?.terminate())
</script>

<template>
  <div class="marc">
    <div class="marc-controls">
      <div class="control-field">
        <label for="marc-system">Romanization system</label>
        <select id="marc-system" v-model="system">
          <option v-for="s in systems" :key="s.code" :value="s.code">{{ s.label }}</option>
        </select>
      </div>
      <button class="run-btn" :disabled="running" @click="run">
        {{ running ? "Romanizing…" : "Romanize →" }}
      </button>
    </div>

    <div class="marc-grid">
      <div class="io-pane">
        <header>
          <span class="pane-label">MARC input</span>
          <span class="pane-hint">Text-mode (MarcEdit-style)</span>
        </header>
        <textarea v-model="inputText" spellcheck="false" placeholder="=100  1#$a…"></textarea>
      </div>
      <div class="io-pane output">
        <header>
          <span class="pane-label">Romanized output</span>
          <button v-if="output" class="copy-btn" @click="copyOutput">Copy</button>
        </header>
        <pre>{{ output || "Output appears here." }}</pre>
      </div>
    </div>

    <p class="privacy">Text never leaves your browser. All transliteration runs in a Web Worker.</p>
  </div>
</template>

<style scoped>
.marc {
  display: grid;
  gap: 1.5rem;
}

.marc-controls {
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
  font-size: 0.9rem;
  padding: 0.625rem 0.75rem;
  background: var(--color-vellum);
  border: 1.5px solid var(--color-rule);
  color: var(--color-ink);
  border-radius: 1px;
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
  background: var(--color-highlight);
  color: var(--color-vellum);
  border: 1.5px solid var(--color-highlight);
  cursor: pointer;
  border-radius: 1px;
}
.run-btn:hover:not(:disabled) {
  background: var(--color-highlight-deep);
  border-color: var(--color-highlight-deep);
}
.run-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.marc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 900px) {
  .marc-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.io-pane {
  background: var(--color-vellum);
  border: 1px solid var(--color-rule);
  display: flex;
  flex-direction: column;
}
.io-pane header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid var(--color-rule);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-stone);
}
.pane-hint {
  font-style: italic;
  text-transform: none;
  letter-spacing: 0.05em;
  font-size: 0.7rem;
  color: var(--color-stone-light);
}

textarea,
pre {
  flex: 1;
  min-height: 320px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  padding: 1rem;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-ink);
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  overflow: auto;
}

.copy-btn {
  font-family: inherit;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: transparent;
  border: 1px solid var(--color-rule-strong);
  padding: 0.25rem 0.55rem;
  cursor: pointer;
  color: var(--color-stone);
  border-radius: 1px;
}
.copy-btn:hover {
  background: var(--color-ink);
  color: var(--color-vellum);
  border-color: var(--color-ink);
}

.privacy {
  font-size: 0.85rem;
  color: var(--color-stone);
  margin: 0;
  text-align: center;
}
</style>
