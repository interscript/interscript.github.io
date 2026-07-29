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

// Interscript-ts is loaded dynamically so the bundle stays small. On the
// client, the demo ships ~50KB of IR data + the interpreter.
let transliterateFn: ((code: string, input: string) => string) | null = null

async function ensureEngine() {
  if (transliterateFn) return transliterateFn
  engine.value = "loading"
  try {
    const mod = await import("interscript-ts")
    const { configure, reset, transliterate, filesystemStrategy } = mod
    // Maps are bundled via Vite's import.glob; the strategy picks the right
    // JSON based on the selected system code.
    const modules = import.meta.glob("/maps/*.json", { eager: true, as: "raw" })
    const maps: Record<string, unknown> = {}
    for (const [path, raw] of Object.entries(modules)) {
      const code = path.match(/\/maps\/(.+)\.json$/)?.[1]
      if (code) maps[code] = JSON.parse(raw as string)
    }
    reset()
    configure({ strategies: [mod.bundledStrategy(maps)] })
    transliterateFn = transliterate
    engine.value = "ready"
  } catch (e) {
    engine.value = "missing"
    error.value = `Failed to load interscript-ts: ${(e as Error).message}`
  }
  return transliterateFn
}

const output = computed(() => {
  if (!transliterateFn) return ""
  try {
    error.value = null
    return transliterateFn(selected.value, input.value)
  } catch (e) {
    error.value = (e as Error).message
    return ""
  }
})

onMounted(ensureEngine)
</script>

<template>
  <div class="rounded-lg border border-ink/10 p-6">
    <div class="mb-4 flex items-center justify-between">
      <label for="system" class="text-sm font-medium text-ink/70">System</label>
      <span
        class="text-xs px-2 py-1 rounded"
        :class="{
          'bg-amber-100 text-amber-800': engine === 'loading',
          'bg-green-100 text-green-800': engine === 'ready',
          'bg-red-100 text-red-800': engine === 'missing',
        }"
      >{{ engine }}</span>
    </div>
    <select
      id="system"
      v-model="selected"
      class="mb-4 w-full rounded-md border border-ink/20 bg-paper px-3 py-2"
    >
      <option v-for="s in systems" :key="s.code" :value="s.code">{{ s.label }}</option>
    </select>

    <label for="input" class="mb-2 block text-sm font-medium text-ink/70">Input</label>
    <textarea
      id="input"
      v-model="input"
      rows="3"
      class="mb-4 w-full rounded-md border border-ink/20 bg-paper px-3 py-2 font-mono"
    ></textarea>

    <label for="output" class="mb-2 block text-sm font-medium text-ink/70">Output</label>
    <div
      id="output"
      class="rounded-md bg-ink/5 px-3 py-2 font-mono min-h-[3rem] whitespace-pre-wrap break-words"
    >
      {{ output || (engine === 'ready' ? '—' : 'Loading transliteration engine…') }}
    </div>

    <div v-if="error" class="mt-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-800">
      {{ error }}
    </div>
  </div>
</template>
