<script setup lang="ts">
/**
 * SubtitlesProcessor — paste .srt or .vtt subtitle content, get
 * transliterated dialogue. Useful for streaming services preparing
 * multiple language tracks from a single source.
 *
 * Preserves subtitle structure (timestamps, indices). Only the dialogue
 * text gets transliterated.
 */
import { ref, onMounted, onUnmounted } from "vue"
import { createWorkerClient, type WorkerClient } from "../scripts/worker-client"

interface Props {
  systems: { code: string; label: string }[]
}

const props = defineProps<Props>()

const system = ref(props.systems[0]?.code ?? "")
const inputText = ref(`1
00:00:01,000 --> 00:00:03,500
Привет, меня зовут Антон.

2
00:00:04,000 --> 00:00:06,200
Я из Киева, а живу в Москве.`)
const output = ref("")
const running = ref(false)
const error = ref<string | null>(null)
const cueCount = ref(0)

let client: WorkerClient | null = null

async function ensureEngine() {
  if (client) return
  client = createWorkerClient()
}

// Regex: capture subtitle cues with timestamps.
// SRT/VTT pattern: index (optional), time range line, dialogue.
const CUE_RE =
  /(\d+\s*\n)?((?:\d{2}:)?\d{2}:\d{2}[,.]\d{3}\s*-->\s*(?:\d{2}:)?\d{2}:\d{2}[,.]\d{3})\s*\n([\s\S]*?)(?=\n\s*\n|\n\d+\s*\n|\n(?:\d{2}:)?\d{2}:\d{2}[,.]\d{3}|$)/g

async function run() {
  if (!client) return
  running.value = true
  error.value = null
  let count = 0

  try {
    const cues: { idx: string; time: string; dialogue: string }[] = []
    let m: RegExpExecArray | null
    const re = new RegExp(CUE_RE.source, "g")
    while ((m = re.exec(inputText.value)) !== null) {
      cues.push({
        idx: (m[1] ?? "").trim() ? (m[1] ?? "").trim() + "\n" : "",
        time: m[2]!,
        dialogue: m[3]!,
      })
    }
    if (cues.length === 0) {
      output.value = inputText.value
      cueCount.value = 0
      running.value = false
      return
    }

    const outParts: string[] = []
    for (const cue of cues) {
      const stripped = cue.dialogue.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim()
      // eslint-disable-next-line no-control-regex -- \x00-\x7F is the full ASCII range
      if (!/[^\x00-\x7F]/.test(stripped)) {
        outParts.push(`${cue.idx}${cue.time}\n${stripped}`)
        continue
      }
      try {
        const transliterated = await client.transliterate(system.value, stripped)
        count++
        outParts.push(`${cue.idx}${cue.time}\n${transliterated}`)
      } catch {
        outParts.push(`${cue.idx}${cue.time}\n${stripped}`)
      }
    }
    output.value = outParts.join("\n\n")
    cueCount.value = count
  } catch (e) {
    error.value = (e as Error).message
  }
  running.value = false
}

function copyOutput() {
  navigator.clipboard.writeText(output.value)
}

onMounted(ensureEngine)
onUnmounted(() => client?.terminate())
</script>

<template>
  <div class="subs">
    <div class="subs-controls">
      <div class="control-field">
        <label for="subs-system">Romanization system</label>
        <select id="subs-system" v-model="system">
          <option v-for="s in systems" :key="s.code" :value="s.code">{{ s.label }}</option>
        </select>
      </div>
      <button class="run-btn" :disabled="running" @click="run">
        {{ running ? "Transliterating…" : "Transliterate subtitles →" }}
      </button>
    </div>

    <div class="subs-grid">
      <div class="io-pane">
        <header>
          <span class="pane-label">SubRip (.srt) or WebVTT (.vtt)</span>
          <span class="pane-hint">Cue format</span>
        </header>
        <textarea v-model="inputText" spellcheck="false"></textarea>
      </div>
      <div class="io-pane output">
        <header>
          <span class="pane-label">Transliterated output</span>
          <button v-if="output" class="copy-btn" @click="copyOutput">Copy</button>
        </header>
        <pre>{{ output || "Output appears here." }}</pre>
      </div>
    </div>

    <p v-if="cueCount > 0" class="cue-count tnum">
      {{ cueCount }} cue{{ cueCount > 1 ? "s" : "" }} transliterated.
    </p>
    <p v-if="error" class="error">⚠ {{ error }}</p>
    <p class="privacy">Text never leaves your browser.</p>
  </div>
</template>

<style scoped>
.subs {
  display: grid;
  gap: 1.25rem;
}

.subs-controls {
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
}

.subs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 900px) {
  .subs-grid {
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
  font-size: 0.85rem;
  padding: 1rem;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-ink);
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
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

.cue-count {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-brand-deep);
  text-align: center;
  margin: 0;
}
.error {
  background: color-mix(in srgb, var(--color-highlight) 8%, transparent);
  padding: 0.625rem 1rem;
  border-left: 3px solid var(--color-highlight);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-highlight-deep);
  margin: 0;
}
.privacy {
  font-size: 0.85rem;
  color: var(--color-stone);
  margin: 0;
  text-align: center;
}
</style>
