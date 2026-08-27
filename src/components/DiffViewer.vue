<script setup lang="ts">
/**
 * DiffViewer — pick two systems, see their rule sets side-by-side.
 *
 * Useful for linguists / developers choosing between similar authorities.
 * Pulls the first ~30 rules from each system's IR and shows them in
 * parallel columns.
 */
import { ref, onMounted, onUnmounted, watch } from "vue"
import { createWorkerClient, type WorkerClient } from "../scripts/worker-client"

interface System {
  code: string
  label: string
}

interface Props {
  systems: System[]
  initialLeft: string
  initialRight: string
}

const props = defineProps<Props>()

const left = ref(props.initialLeft)
const right = ref(props.initialRight)
const leftRules = ref<RuleRow[]>([])
const rightRules = ref<RuleRow[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

interface RuleRow {
  kind: string
  from: string
  to: string
  raw: unknown
}

let client: WorkerClient | null = null

async function ensureEngine() {
  if (client) return
  client = createWorkerClient()
}

function rulesFromMap(map: unknown): RuleRow[] {
  const stages = (map as { stages?: Array<{ rules?: unknown[] }> }).stages ?? []
  const rules: RuleRow[] = []
  for (const stage of stages) {
    for (const r of (stage.rules ?? []) as Array<Record<string, unknown>>) {
      rules.push(ruleToRow(r))
      if (rules.length >= 30) return rules
    }
  }
  return rules
}

function ruleToRow(r: Record<string, unknown>): RuleRow {
  const kind = (r.kind as string) ?? "?"
  if (kind === "sub") {
    const from = stringify((r.from as Record<string, unknown>) ?? null)
    const to = stringify((r.to as Record<string, unknown>) ?? null)
    return { kind, from, to, raw: r }
  }
  if (kind === "parallel" || kind === "sequential") {
    const n = ((r.rules as unknown[]) ?? []).length
    return { kind, from: "", to: `${n} rules`, raw: r }
  }
  if (kind === "run") {
    return { kind, from: (r.stage as string) ?? "", to: (r.docName as string) ?? "", raw: r }
  }
  if (kind === "funcall") {
    return { kind, from: (r.name as string) ?? "", to: "", raw: r }
  }
  return { kind, from: "", to: "", raw: r }
}

function stringify(item: Record<string, unknown> | null): string {
  if (!item) return ""
  switch (item.kind) {
    case "string":
      return (item.value as string) ?? ""
    case "alias":
      return `:${item.name}`
    case "any":
      return `any(${((item.of as unknown[]) ?? []).length.toString()})`
    case "any_char_class":
      if (item.range) return `[${item.range[0]}-${item.range[1]}]`
      if (item.chars) return `[${(item.chars as string[]).slice(0, 5).join("")}…]`
      return "[…]"
    case "group":
      return "{…}"
    case "capture_group":
      return `(${stringify(item.data as Record<string, unknown>)})`
    case "capture_ref":
      return `\\${item.id}`
    case "stage_ref":
      return `@${item.name}`
    case "funcall_inline":
      return `:${item.name}()`
    default:
      return JSON.stringify(item).slice(0, 40)
  }
}

async function load() {
  if (!client) return
  loading.value = true
  error.value = null
  try {
    const [leftMap, rightMap] = await Promise.all([
      client.loadMap(left.value),
      client.loadMap(right.value),
    ])
    leftRules.value = rulesFromMap(leftMap)
    rightRules.value = rulesFromMap(rightMap)
  } catch (e) {
    error.value = (e as Error).message
  }
  loading.value = false
}

onMounted(async () => {
  await ensureEngine()
  await load()
})

onUnmounted(() => client?.terminate())

watch([left, right], () => {
  void load()
})
</script>

<template>
  <div class="diff">
    <div class="diff-controls">
      <div class="control-field">
        <label for="diff-left">System A</label>
        <select id="diff-left" v-model="left">
          <option v-for="s in systems" :key="s.code" :value="s.code">{{ s.label }}</option>
        </select>
      </div>
      <div class="vs" aria-hidden="true">vs</div>
      <div class="control-field">
        <label for="diff-right">System B</label>
        <select id="diff-right" v-model="right">
          <option v-for="s in systems" :key="s.code" :value="s.code">{{ s.label }}</option>
        </select>
      </div>
    </div>

    <p v-if="error" class="error">⚠ {{ error }}</p>

    <div class="diff-table">
      <div class="diff-col">
        <header>
          <code class="col-code">{{ left }}</code>
          <span class="col-count tnum">{{ leftRules.length }} rules (first 30)</span>
        </header>
        <ol>
          <li v-for="(r, i) in leftRules" :key="i" :class="`rule rule-${r.kind}`">
            <span class="rule-kind">{{ r.kind }}</span>
            <span class="rule-from">{{ r.from || "—" }}</span>
            <span class="rule-arrow">→</span>
            <span class="rule-to">{{ r.to || "—" }}</span>
          </li>
        </ol>
      </div>

      <div class="diff-col">
        <header>
          <code class="col-code">{{ right }}</code>
          <span class="col-count tnum">{{ rightRules.length }} rules (first 30)</span>
        </header>
        <ol>
          <li v-for="(r, i) in rightRules" :key="i" :class="`rule rule-${r.kind}`">
            <span class="rule-kind">{{ r.kind }}</span>
            <span class="rule-from">{{ r.from || "—" }}</span>
            <span class="rule-arrow">→</span>
            <span class="rule-to">{{ r.to || "—" }}</span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diff {
  display: grid;
  gap: 1.5rem;
}

.diff-controls {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: end;
}
@media (max-width: 600px) {
  .diff-controls {
    grid-template-columns: 1fr;
  }
  .vs {
    text-align: center;
    padding: 0.5rem 0;
  }
}
.control-field {
  display: grid;
  gap: 0.4rem;
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
  border-radius: 1px;
  color: var(--color-ink);
}
.vs {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-highlight);
  font-style: italic;
  padding-bottom: 0.65rem;
}

.error {
  background: color-mix(in srgb, var(--color-highlight) 8%, transparent);
  padding: 0.75rem 1rem;
  border-left: 3px solid var(--color-highlight);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-highlight-deep);
  margin: 0;
}

.diff-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--color-rule);
  border: 1px solid var(--color-rule);
}
@media (max-width: 768px) {
  .diff-table {
    grid-template-columns: 1fr;
  }
}
.diff-col {
  background: var(--color-vellum);
  min-height: 400px;
}
.diff-col header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--color-rule);
  background: var(--color-paper-deep);
  flex-wrap: wrap;
  gap: 0.5rem;
}
.col-code {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-ink);
  background: transparent;
  padding: 0;
}
.col-count {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-stone);
}

.diff-col ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
.rule {
  display: grid;
  grid-template-columns: 80px 1fr auto 1fr;
  align-items: baseline;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px dashed var(--color-rule);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.4;
}
.rule:last-child {
  border-bottom: none;
}
.rule-kind {
  font-size: var(--text-micro);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-stone);
}
.rule-sub .rule-kind {
  color: var(--color-brand-deep);
}
.rule-parallel .rule-kind {
  color: var(--color-highlight);
}
.rule-run .rule-kind {
  color: var(--color-stone-light);
}
.rule-funcall .rule-kind {
  color: var(--color-stone-light);
}

.rule-from {
  color: var(--color-ink);
  font-weight: 500;
  word-break: break-all;
}
.rule-arrow {
  color: var(--color-highlight);
  font-size: 0.7rem;
}
.rule-to {
  color: var(--color-stone);
  font-style: italic;
  word-break: break-all;
}
</style>
