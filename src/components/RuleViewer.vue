<script setup lang="ts">
/**
 * RuleViewer — renders the first N rules of a map's IR as a readable table.
 *
 * Reads the IR JSON from the page's bundled /maps/[code].json and extracts
 * the first few rules from the first stage. Each row shows:
 *   pattern (from) → replacement (to) | context constraints
 *
 * Pure presentational component; no transliteration logic.
 */
import { ref, onMounted } from "vue"

interface Props {
  systemCode: string
  maxRules?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxRules: 20,
})

interface RuleRow {
  kind: string
  from: string
  to: string
  context: string
}

const rules = ref<RuleRow[]>([])
const loaded = ref(false)
const failed = ref(false)
const totalRules = ref(0)

function extractLiteral(item: unknown): string {
  if (!item || typeof item !== "object") return "—"
  const obj = item as Record<string, unknown>
  if (obj.kind === "string") return `"${obj.value}"`
  if (obj.kind === "any") {
    const of = obj.of as Array<Record<string, unknown>> | undefined
    if (!of) return "(any)"
    return of.map((x) => x.value as string).join(" | ")
  }
  if (obj.kind === "alias") return `⟨${obj.name}⟩`
  if (obj.kind === "capture_group") return `(${extractLiteral(obj.data)})`
  if (obj.kind === "capture_ref") return `\\${obj.id}`
  if (obj.kind === "group") {
    const items = obj.items as unknown[]
    return items.map(extractLiteral).join("")
  }
  if (obj.kind === "repeat") return `${extractLiteral(obj.data)}*`
  if (obj.kind === "funcall_inline") return `${obj.name}()`
  return `(unsupported: ${obj.kind ?? "?"})`
}

function extractContext(rule: Record<string, unknown>): string {
  const parts: string[] = []
  if (rule.before) parts.push(`before=${extractLiteral(rule.before)}`)
  if (rule.after) parts.push(`after=${extractLiteral(rule.after)}`)
  if (rule.notBefore) parts.push(`not_before=${extractLiteral(rule.notBefore)}`)
  if (rule.notAfter) parts.push(`not_after=${extractLiteral(rule.notAfter)}`)
  return parts.join(" ")
}

function toRuleRow(rule: Record<string, unknown>): RuleRow {
  if (rule.kind === "sub") {
    return {
      kind: "sub",
      from: extractLiteral(rule.from),
      to: extractLiteral(rule.to),
      context: extractContext(rule),
    }
  }
  if (rule.kind === "run") {
    return {
      kind: "run",
      from: `(run stage)`,
      to: rule.stage as string,
      context: rule.docName ? `from ${rule.docName}` : "",
    }
  }
  if (rule.kind === "funcall") {
    return {
      kind: "funcall",
      from: `(call)`,
      to: rule.name as string,
      context: JSON.stringify(rule.kwargs ?? {}),
    }
  }
  if (rule.kind === "parallel") {
    const inner = rule.rules as Record<string, unknown>[]
    return {
      kind: "parallel",
      from: `(parallel block of ${inner.length} rules)`,
      to: "—",
      context: "",
    }
  }
  if (rule.kind === "sequential") {
    const inner = rule.rules as Record<string, unknown>[]
    return {
      kind: "sequential",
      from: `(sequential block of ${inner.length} rules)`,
      to: "—",
      context: "",
    }
  }
  return { kind: "unknown", from: `?${rule.kind}`, to: "?", context: "" }
}

onMounted(async () => {
  try {
    const res = await fetch(`/maps/${props.systemCode}.json`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const ir = (await res.json()) as {
      stages: Array<{ rules: Record<string, unknown>[] }>
    }
    const stage = ir.stages[0]
    if (!stage) {
      failed.value = true
      return
    }
    totalRules.value = stage.rules.length
    rules.value = stage.rules.slice(0, props.maxRules).map(toRuleRow)
    loaded.value = true
  } catch {
    failed.value = true
  }
})
</script>

<template>
  <div class="viewer">
    <header class="viewer-header">
      <p class="viewer-meta">
        <span v-if="!loaded && !failed">Loading rules…</span>
        <span v-else-if="failed">Rules unavailable for this system.</span>
        <span v-else>
          Showing first {{ rules.length }} of {{ totalRules }} rules
          <span v-if="totalRules > maxRules">
            · <a :href="`https://github.com/interscript/maps/blob/main/maps/${systemCode}.imp`" rel="noreferrer">view all on GitHub →</a>
          </span>
        </span>
      </p>
    </header>

    <table v-if="loaded && rules.length > 0" class="rule-table">
      <thead>
        <tr>
          <th class="col-num">#</th>
          <th class="col-kind">Type</th>
          <th class="col-from">Pattern</th>
          <th class="col-arrow"></th>
          <th class="col-to">Replacement</th>
          <th class="col-context">Context</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rule, i) in rules" :key="i" :class="`row-${rule.kind}`">
          <td class="col-num">{{ i + 1 }}</td>
          <td class="col-kind">
            <code class="kind-badge">{{ rule.kind }}</code>
          </td>
          <td class="col-from"><code>{{ rule.from }}</code></td>
          <td class="col-arrow" aria-hidden="true">→</td>
          <td class="col-to"><code>{{ rule.to }}</code></td>
          <td class="col-context">
            <span v-if="rule.context" class="context">{{ rule.context }}</span>
            <span v-else class="context-empty">—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.viewer {
  background: var(--color-vellum);
  border: 1px solid var(--color-rule);
  border-radius: 4px;
  overflow: hidden;
}
.viewer-header {
  padding: 0.75rem 1.25rem;
  background: color-mix(in srgb, var(--color-ink) 4%, transparent);
  border-bottom: 1px solid var(--color-rule);
}
.viewer-meta {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-stone);
}
.viewer-meta a { color: var(--color-ochre); }

.rule-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.rule-table th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-stone);
  border-bottom: 1px solid var(--color-rule);
  background: var(--color-parchment);
  font-weight: 500;
}
.rule-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--color-rule);
  vertical-align: top;
}
.rule-table tr:last-child td {
  border-bottom: none;
}
.rule-table tr:hover {
  background: color-mix(in srgb, var(--color-ochre) 4%, transparent);
}
.col-num {
  font-family: var(--font-mono);
  color: var(--color-stone-light);
  width: 2.5rem;
}
.col-kind { width: 5rem; }
.col-from, .col-to { word-break: break-all; }
.col-from code, .col-to code {
  background: transparent;
  color: var(--color-ink);
  padding: 0;
  font-size: 0.8125rem;
}
.col-arrow {
  width: 1.5rem;
  text-align: center;
  color: var(--color-ochre);
  font-family: var(--font-mono);
}
.col-context { width: 12rem; }
.context {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--color-stone);
  word-break: break-all;
}
.context-empty {
  color: var(--color-stone-light);
}
.kind-badge {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.1rem 0.35rem;
  border-radius: 2px;
  background: color-mix(in srgb, var(--color-ink) 8%, transparent);
  color: var(--color-stone);
}
.row-parallel .kind-badge {
  background: color-mix(in srgb, var(--color-saffron) 12%, transparent);
  color: var(--color-saffron);
}
.row-run .kind-badge {
  background: color-mix(in srgb, var(--color-ochre) 12%, transparent);
  color: var(--color-ochre);
}
.row-funcall .kind-badge {
  background: color-mix(in srgb, #16a34a 12%, transparent);
  color: #16a34a;
}
</style>
