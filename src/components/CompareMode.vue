<script setup lang="ts">
/**
 * CompareMode — show the same input through N transliteration systems
 * side-by-side. This is the killer demo for "why every authority
 * matters": the same name surfaces differently across BGN/PCGN, ISO,
 * UN, ALA-LC, ODNI.
 *
 * Uses the Web Worker client so 5 simultaneous transliterations don't
 * jank the UI thread.
 *
 * Script display names are passed in as a prop (resolved at build time
 * from @iso24229/iso15924-data) so this component stays browser-safe.
 */
import { ref, computed, onMounted, onUnmounted, watch } from "vue"
import { createWorkerClient, type WorkerClient } from "../scripts/worker-client"

interface System {
  code: string
  authority: string
  note: string
  scriptName: string
}

interface Preset {
  id: string
  label: string
  input: string
  systems: System[]
}

interface Props {
  presets: Preset[]
}

const props = defineProps<Props>()

const presetId = ref(props.presets[0]?.id ?? "")
const input = ref(props.presets[0]?.input ?? "")
const outputs = ref<Record<string, string>>({})
const errors = ref<Record<string, string>>({})
const loading = ref(false)

const currentPreset = computed(() =>
  props.presets.find((p) => p.id === presetId.value) ?? props.presets[0]!,
)

let client: WorkerClient | null = null

async function ensureEngine() {
  if (client) return
  client = createWorkerClient()
}

async function run() {
  if (!client) return
  loading.value = true
  outputs.value = {}
  errors.value = {}
  // Race all systems in parallel — the worker handles them off the
  // main thread, so we get the results back without UI jank.
  await Promise.all(
    currentPreset.value.systems.map(async (sys) => {
      try {
        const result = await client!.transliterate(sys.code, input.value)
        outputs.value = { ...outputs.value, [sys.code]: result }
      } catch (e) {
        errors.value = { ...errors.value, [sys.code]: (e as Error).message }
      }
    }),
  )
  loading.value = false
}

function selectPreset(id: string) {
  presetId.value = id
  const preset = props.presets.find((p) => p.id === id)
  if (preset) input.value = preset.input
}

onMounted(async () => {
  await ensureEngine()
  await run()
})

onUnmounted(() => {
  client?.terminate()
})

watch([input, presetId], () => {
  void run()
})
</script>

<template>
  <div class="compare">
    <div class="compare-controls">
      <div class="preset-rail">
        <p class="rail-label">Try a preset</p>
        <div class="preset-row">
          <button
            v-for="preset in presets"
            :key="preset.id"
            :class="['preset-pill', { active: preset.id === presetId }]"
            @click="selectPreset(preset.id)"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <div class="input-row">
        <label class="input-label" for="compare-input">
          {{ currentPreset.systems[0]?.scriptName ?? 'Source' }} input
        </label>
        <input
          id="compare-input"
          v-model="input"
          class="compare-input"
          type="text"
          spellcheck="false"
          :placeholder="'Type or edit…'"
        />
      </div>
    </div>

    <ul class="result-list">
      <li v-for="sys in currentPreset.systems" :key="sys.code" class="result-row">
        <div class="result-meta">
          <span class="result-authority">{{ sys.authority }}</span>
          <span class="result-note">{{ sys.note }}</span>
          <a class="result-link" :href="`/maps/${sys.code}`" title="View system detail">↗</a>
        </div>
        <div class="result-output" :class="{ error: errors[sys.code], loading: loading && !outputs[sys.code] && !errors[sys.code] }">
          <span v-if="errors[sys.code]" class="err-msg">⚠ {{ errors[sys.code] }}</span>
          <span v-else-if="loading && !outputs[sys.code]">Loading…</span>
          <span v-else>{{ outputs[sys.code] }}</span>
        </div>
        <code class="result-code">{{ sys.code }}</code>
      </li>
    </ul>

    <p class="compare-deck">
      Same input, different romanization systems. Each authority publishes
      its own rules — Interscript encodes them as comparable, runnable maps
      so you can see the differences at a glance.
    </p>
  </div>
</template>

<style scoped>
.compare {
  display: grid;
  gap: 1.75rem;
}

.compare-controls {
  display: grid;
  gap: 1.25rem;
}

.preset-rail .rail-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-stone);
  margin: 0 0 0.625rem;
}
.preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.preset-pill {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  padding: 0.45rem 0.95rem;
  border: 1.5px solid var(--color-rule);
  background: var(--color-vellum);
  color: var(--color-ink);
  border-radius: 1px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.preset-pill:hover {
  border-color: var(--color-brand);
}
.preset-pill.active {
  background: var(--color-brand);
  border-color: var(--color-brand);
  color: var(--color-vellum);
}

.input-row {
  display: grid;
  gap: 0.4rem;
}
.input-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-stone);
}
.compare-input {
  font-family: var(--font-display);
  font-size: 1.5rem;
  padding: 0.875rem 1rem;
  border: 1.5px solid var(--color-rule);
  background: var(--color-vellum);
  color: var(--color-ink);
  border-radius: 1px;
  outline: none;
  transition: border-color 0.15s ease;
}
.compare-input:focus {
  border-color: var(--color-brand);
}

.result-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 2px solid var(--color-ink);
}
.result-row {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: 1.5rem;
  align-items: center;
  padding: 1.125rem 0;
  border-bottom: 1px solid var(--color-rule);
}
@media (max-width: 768px) {
  .result-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
.result-meta {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
}
.result-authority {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-brand-deep);
  font-weight: 500;
}
.result-note {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-stone-light);
  letter-spacing: 0.05em;
}
.result-link {
  color: var(--color-stone-light);
  text-decoration: none;
  font-size: 0.85rem;
}
.result-link:hover {
  color: var(--color-highlight);
}
.result-output {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-highlight);
  font-style: italic;
  letter-spacing: -0.01em;
  min-height: 2rem;
  display: flex;
  align-items: center;
}
.result-output.error {
  color: var(--color-highlight-deep);
  font-style: normal;
  font-size: 0.875rem;
}
.result-output.loading {
  color: var(--color-stone-light);
  font-style: normal;
  font-size: 0.875rem;
}
.result-code {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-stone);
  background: transparent;
  padding: 0;
  letter-spacing: 0.02em;
}

.compare-deck {
  font-size: 0.9375rem;
  color: var(--color-stone);
  line-height: 1.6;
  margin: 0;
  padding-top: 1rem;
  border-top: 1px solid var(--color-rule);
}
</style>
