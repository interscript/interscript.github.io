<script setup lang="ts">
/**
 * RuleViewer — the full rule chart of a map, parsed live from its ISC
 * source. Recovers the legacy system view: a collapsible tree of stages
 * and parallel/sequential groups, with from → to | condition columns
 * per rule and operation rows for run/separate/compose/etc.
 *
 * Mirrors the legacy react-static layout (stage tree + chart header),
 * on the ISC runtime instead of the retired JSON IR. Groups render in
 * full; only enormous ones (5000+) truncate with a GitHub link.
 */
import { ref, computed, onMounted } from "vue"

interface Props {
  systemCode: string
  sourceScript?: string
  destinationScript?: string
  /** Rules shown per group before truncating to a GitHub link. */
  maxPerGroup?: number
}

const props = withDefaults(defineProps<Props>(), {
  sourceScript: undefined,
  destinationScript: undefined,
  maxPerGroup: 5000,
})

type Item = Record<string, unknown>

interface Row {
  id: string
  depth: number
  kind: "stage" | "group" | "rule" | "op"
  label?: string
  badge?: string
  from?: string
  to?: string
  context?: string
  childCount: number
  truncated: number
  docLink?: string
}

interface TreeNode {
  row: Row
  children: TreeNode[]
}

const stages = ref<Array<{ name: string; items: unknown[] }>>([])
const loaded = ref(false)
const failed = ref(false)
const expanded = ref(new Set<string>())
// Map alias name (e.g. "cyrllatn") → dependency map code, used to turn
// `run map.<alias>.stage.x` into a link to the dependency's page.
const aliasToTarget = ref(new Map<string, string>())

function itemText(item: unknown): string {
  if (!item || typeof item !== "object") return "∅"
  const it = item as Item
  switch (it.type) {
    case "string":
      return JSON.stringify(it.value)
    case "none":
      return "∅"
    case "primitive":
      return `⟨${it.name}⟩`
    case "function":
      return `${it.name}()`
    case "alias_ref":
      return `⟨${it.name}⟩`
    case "capture":
      return `\\${it.index}`
    case "capture_group":
      return `(${itemText(it.inner)})`
    case "concat":
      return ((it.parts as unknown[]) ?? []).map(itemText).join("")
    case "set":
      return `[${((it.items as unknown[]) ?? []).map(itemText).join(" ")}]`
    case "range":
      return `${it.lo}–${it.hi}`
    case "maybe":
      return `${itemText(it.inner)}?`
    case "some":
      return `${itemText(it.inner)}+`
    default:
      return `?${String(it.type)}`
  }
}

function contextText(constraints: Array<{ kind: string; item: unknown }> | undefined): string {
  if (!constraints || constraints.length === 0) return ""
  return constraints.map((c) => `${c.kind}: ${itemText(c.item)}`).join(" · ")
}

function ruleRow(id: string, depth: number, rule: Item): Row {
  return {
    id,
    depth,
    kind: "rule",
    from: itemText(rule.from),
    to: itemText(rule.to),
    context: contextText(rule.constraints as Array<{ kind: string; item: unknown }> | undefined),
    childCount: 0,
    truncated: 0,
  }
}

function buildItems(items: unknown[], parentId: string, depth: number): TreeNode[] {
  const nodes: TreeNode[] = []
  items.forEach((raw, i) => {
    const item = raw as Item
    const id = `${parentId}/${i}`
    if (item.kind === "parallel" || item.kind === "sequence") {
      const rules = (item.rules as Item[]) ?? []
      const shown = rules.slice(0, props.maxPerGroup)
      nodes.push({
        row: {
          id,
          depth,
          kind: "group",
          badge: item.kind as string,
          childCount: rules.length,
          truncated: rules.length - shown.length,
        },
        children: shown.map((rule, ri) => ({
          row: ruleRow(`${id}/${ri}`, depth + 1, rule),
          children: [],
        })),
      })
    } else if (item.kind === "bare_rule") {
      nodes.push({ row: ruleRow(id, depth, item.rule as Item), children: [] })
    } else if (item.kind === "run") {
      const rawDep = item.dependency ? String(item.dependency) : ""
      const target = rawDep ? (aliasToTarget.value.get(rawDep) ?? rawDep) : ""
      nodes.push({
        row: {
          id,
          depth,
          kind: "op",
          badge: "run",
          from: target,
          to: String(item.stage ?? ""),
          docLink: target ? `/maps/${target}` : undefined,
          childCount: 0,
          truncated: 0,
        },
        children: [],
      })
    } else if (item.kind === "separate") {
      nodes.push({
        row: {
          id,
          depth,
          kind: "op",
          badge: "separate",
          from: item.separator !== undefined ? itemText(item.separator) : "(default)",
          childCount: 0,
          truncated: 0,
        },
        children: [],
      })
    } else if (
      item.kind === "compose" ||
      item.kind === "decompose" ||
      item.kind === "string_case"
    ) {
      nodes.push({
        row: {
          id,
          depth,
          kind: "op",
          badge: String(item.kind),
          from: item.kind === "string_case" ? String(item.op ?? "") : "",
          childCount: 0,
          truncated: 0,
        },
        children: [],
      })
    } else if (item.kind === "funcall") {
      nodes.push({
        row: {
          id,
          depth,
          kind: "op",
          badge: "funcall",
          from: String(item.name ?? ""),
          to: Object.keys((item.kwargs as Record<string, unknown>) ?? {}).length
            ? JSON.stringify(item.kwargs)
            : "",
          childCount: 0,
          truncated: 0,
        },
        children: [],
      })
    } else {
      nodes.push({
        row: {
          id,
          depth,
          kind: "op",
          badge: String(item.kind ?? "?"),
          childCount: 0,
          truncated: 0,
        },
        children: [],
      })
    }
  })
  return nodes
}

const tree = computed<TreeNode[]>(() => {
  if (!loaded.value) return []
  return stages.value.map((stage, si) => ({
    row: {
      id: `s${si}`,
      depth: 0,
      kind: "stage" as const,
      label: stage.name,
      badge: "stage",
      childCount: stage.items.length,
      truncated: 0,
    },
    children: buildItems(stage.items, `s${si}`, 1),
  }))
})

const visibleRows = computed<Row[]>(() => {
  const out: Row[] = []
  const walk = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      out.push(node.row)
      if (node.children.length > 0 && expanded.value.has(node.row.id)) walk(node.children)
    }
  }
  walk(tree.value)
  return out
})

const totalRules = computed(() => {
  // Group rows carry the full count even when their children are
  // truncated to maxPerGroup — sum those instead of visible rows.
  let n = 0
  const walk = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      if (node.row.kind === "rule") n++
      else if (node.row.kind === "group") {
        n += node.row.childCount
        continue
      } else {
        walk(node.children)
      }
    }
  }
  walk(tree.value)
  return n
})

function toggle(id: string) {
  const next = new Set(expanded.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expanded.value = next
}

function setAll(open: boolean) {
  const next = new Set<string>()
  if (open) {
    const walk = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.children.length > 0) {
          next.add(node.row.id)
          walk(node.children)
        }
      }
    }
    walk(tree.value)
  }
  expanded.value = next
}

const sourceUrl = `https://github.com/interscript/maps/blob/main/maps/${props.systemCode}.isc`

onMounted(async () => {
  try {
    const res = await fetch(`/maps/${props.systemCode}.isc`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text()
    const mod = await import("interscript")
    const doc = mod.parseIsc(text, `${props.systemCode}.isc`)
    stages.value = doc.stages.map((s) => ({
      name: s.name,
      items: [...s.body],
    }))
    aliasToTarget.value = new Map(doc.dependencies.map((d) => [d.aliasName ?? d.target, d.target]))
    loaded.value = true
    // Default: first stage open, everything else collapsed.
    if (stages.value.length > 0) expanded.value = new Set(["s0"])
  } catch {
    failed.value = true
  }
})
</script>

<template>
  <div class="rule-viewer">
    <div class="chart-header">
      <span class="head-from">{{ sourceScript ?? "From" }}</span>
      <span class="head-to">{{ destinationScript ?? "To" }}</span>
      <span class="head-context">Condition</span>
    </div>

    <div class="viewer-toolbar">
      <p class="viewer-meta">
        <span v-if="!loaded && !failed">Loading rules…</span>
        <span v-else-if="failed">
          Rules unavailable for this system —
          <a :href="sourceUrl" rel="noreferrer">read the map source on GitHub →</a>
        </span>
        <template v-else>
          {{ totalRules }} rules across {{ stages.length }}
          {{ stages.length === 1 ? "stage" : "stages" }}
        </template>
      </p>
      <div v-if="loaded" class="toolbar-actions">
        <button type="button" @click="setAll(true)">Expand all</button>
        <button type="button" @click="setAll(false)">Collapse all</button>
      </div>
    </div>

    <div v-if="loaded" class="tree" role="tree">
      <div
        v-for="row in visibleRows"
        :key="row.id"
        :class="['tree-row', `row-${row.kind}`]"
        :style="{ '--row-indent': `${1.5 + row.depth * 1.25}rem` }"
        role="treeitem"
        :aria-expanded="row.childCount > 0 ? expanded.has(row.id) : undefined"
      >
        <span
          :class="['row-gutter', { clickable: row.childCount > 0 }]"
          @click="row.childCount > 0 && toggle(row.id)"
        >
          <template v-if="row.childCount > 0">{{ expanded.has(row.id) ? "▾" : "▸" }}</template>
          <template v-else>·</template>
        </span>

        <template v-if="row.kind === 'stage'">
          <span class="node-label" @click="toggle(row.id)">
            <span class="kind-badge">{{ row.badge }}</span>
            <strong class="stage-name">{{ row.label }}</strong>
            <span class="node-count">{{ row.childCount }} items</span>
          </span>
        </template>

        <template v-else-if="row.kind === 'group'">
          <span class="node-label" @click="toggle(row.id)">
            <span :class="['kind-badge', `badge-${row.badge}`]">{{ row.badge }}</span>
            <span class="node-count">
              {{ row.childCount }} rules, applied
              {{ row.badge === "parallel" ? "simultaneously" : "in order" }}
            </span>
            <span v-if="row.truncated > 0" class="node-truncated">
              · first {{ row.childCount - row.truncated }} shown —
              <a :href="sourceUrl" rel="noreferrer">all on GitHub →</a>
            </span>
          </span>
        </template>

        <template v-else>
          <span :class="['kind-badge', `badge-${row.badge}`]">{{ row.badge }}</span>
          <code class="cell-from">
            <a v-if="row.docLink" :href="row.docLink">{{ row.from }}</a>
            <template v-else>{{ row.from }}</template>
          </code>
          <span class="cell-arrow" aria-hidden="true">→</span>
          <code class="cell-to">{{ row.to }}</code>
          <span class="cell-context">{{ row.context || "—" }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * Shared grid: [indent] [gutter] [badge] [from] [→] [to] [condition].
 * Header, rows, and ops all use the same tracks so the chart columns
 * line up vertically.
 */
.rule-viewer {
  --track-badge: 6.5rem;
  --track-from: minmax(0, 2.2fr);
  --track-to: minmax(0, 2.2fr);
  --track-context: minmax(0, 1.6fr);
  background: var(--color-vellum);
  border: 1px solid var(--color-rule);
  border-radius: 4px;
  overflow: hidden;
}
.chart-header {
  display: grid;
  grid-template-columns:
    var(--row-indent, 1.5rem) 1.5rem var(--track-badge)
    var(--track-from) 1.5rem var(--track-to) var(--track-context);
  gap: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--color-brand);
  color: var(--color-vellum);
  padding: 0.625rem 1rem;
}
.chart-header .head-from {
  grid-column: 4;
}
.chart-header .head-to {
  grid-column: 6;
}
.chart-header .head-context {
  grid-column: 7;
}

.viewer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--color-rule);
  background: color-mix(in srgb, var(--color-ink) 4%, transparent);
}
.viewer-meta {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-stone);
}
.viewer-meta a {
  color: var(--color-highlight);
}
.toolbar-actions {
  display: flex;
  gap: 0.5rem;
}
.toolbar-actions button {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: transparent;
  border: 1px solid var(--color-rule-strong);
  color: var(--color-stone);
  padding: 0.25rem 0.6rem;
  cursor: pointer;
  border-radius: 1px;
}
.toolbar-actions button:hover {
  border-color: var(--color-brand);
  color: var(--color-brand-deep, var(--color-brand));
}

.tree {
  max-height: 70vh;
  overflow: auto;
}
.tree-row {
  display: grid;
  grid-template-columns:
    var(--row-indent, 1.5rem) 1.5rem var(--track-badge)
    var(--track-from) 1.5rem var(--track-to) var(--track-context);
  gap: 0.75rem;
  align-items: baseline;
  padding: 0.3rem 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-rule) 55%, transparent);
  font-size: 0.875rem;
}
.tree-row:hover {
  background: color-mix(in srgb, var(--color-brand) 5%, transparent);
}
.row-gutter {
  grid-column: 2;
  font-family: var(--font-mono);
  color: var(--color-stone-light);
  text-align: center;
  user-select: none;
}
.row-gutter.clickable {
  cursor: pointer;
  color: var(--color-stone);
}

.row-stage {
  background: color-mix(in srgb, var(--color-ink) 5%, transparent);
}
.row-stage .node-label,
.row-group .node-label {
  grid-column: 3 / -1;
  display: inline-flex;
  align-items: baseline;
  gap: 0.6rem;
  flex-wrap: wrap;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-stone);
}
.stage-name {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  color: var(--color-ink);
  letter-spacing: 0;
}
.node-count {
  color: var(--color-stone-light);
}
.node-truncated a {
  color: var(--color-highlight);
}

.row-rule .kind-badge,
.row-op .kind-badge {
  grid-column: 3;
}
.cell-from {
  grid-column: 4;
}
.cell-arrow {
  grid-column: 5;
  text-align: center;
}
.cell-to {
  grid-column: 6;
}
.cell-context {
  grid-column: 7;
}

.cell-from,
.cell-to {
  background: transparent;
  color: var(--color-ink);
  padding: 0;
  font-size: 0.8125rem;
  word-break: break-word;
  white-space: pre-wrap;
}
.cell-from a {
  color: var(--color-highlight);
}
.cell-arrow {
  color: var(--color-highlight);
  font-family: var(--font-mono);
}
.cell-context {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--color-stone);
  word-break: break-word;
}

.kind-badge {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.1rem 0.35rem;
  border-radius: 2px;
  background: color-mix(in srgb, var(--color-ink) 8%, transparent);
  color: var(--color-stone);
  justify-self: start;
  align-self: baseline;
}
.badge-parallel {
  background: color-mix(in srgb, var(--color-brand) 14%, transparent);
  color: var(--color-brand-deep, var(--color-brand));
}
.badge-sequence {
  background: color-mix(in srgb, var(--color-brand) 8%, transparent);
  color: var(--color-brand-deep, var(--color-brand));
}
.badge-run {
  background: color-mix(in srgb, var(--color-highlight) 12%, transparent);
  color: var(--color-highlight);
}
.badge-funcall {
  background: color-mix(in srgb, #16a34a 12%, transparent);
  color: #16a34a;
}

@media (max-width: 900px) {
  .tree-row,
  .chart-header {
    grid-template-columns:
      var(--row-indent, 1.5rem) 1.5rem var(--track-badge)
      minmax(0, 1fr);
  }
  .cell-from {
    grid-column: 4;
    grid-row: 1;
  }
  .cell-arrow {
    display: none;
  }
  .cell-to {
    grid-column: 4;
    grid-row: 2;
  }
  .cell-context {
    grid-column: 4;
    grid-row: 3;
  }
  .row-rule,
  .row-op {
    row-gap: 0.15rem;
  }
}
</style>
