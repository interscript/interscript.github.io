<script setup lang="ts">
/**
 * DetectPanel — paste input + output, find which transliteration system
 * best explains the pair.
 *
 * Approach: user picks a script family, we test every system in that
 * family against the input and rank by Levenshtein distance to the
 * observed output. Smaller distance = better match.
 *
 * Uses the Web Worker so testing 5+ systems in parallel doesn't jank.
 */
import { ref, computed, onMounted, onUnmounted } from "vue"
import { createWorkerClient, type WorkerClient } from "../scripts/worker-client"

interface CandidateSystem {
  code: string
  authority: string
  note: string
}

interface ScriptFamily {
  id: string
  label: string
  sourceScript: string
  sampleInput: string
  sampleOutput: string
  systems: CandidateSystem[]
}

const families: ScriptFamily[] = [
  {
    id: "cyrillic",
    label: "Cyrillic → Latin",
    sourceScript: "Cyrl",
    sampleInput: "Щербакова",
    sampleOutput: "Shcherbakova",
    systems: [
      { code: "bgnpcgn-rus-Cyrl-Latn-1947", authority: "BGN/PCGN", note: "Russian · 1947" },
      { code: "odni-rus-Cyrl-Latn-2015", authority: "ODNI", note: "Russian · 2015" },
      { code: "iso-rus-Cyrl-Latn-9-1995", authority: "ISO", note: "ISO 9 · 1995" },
      { code: "alalc-rus-Cyrl-Latn-2012", authority: "ALA-LC", note: "Russian · 2012" },
      { code: "un-rus-Cyrl-Latn-1987", authority: "UN", note: "Russian · 1987" },
    ],
  },
  {
    id: "arabic",
    label: "Arabic → Latin",
    sourceScript: "Arab",
    sampleInput: "القاهرة",
    sampleOutput: "Cairo",
    systems: [
      { code: "bgnpcgn-ara-Arab-Latn-1956", authority: "BGN/PCGN", note: "Arabic · 1956" },
      { code: "iso-ara-Arab-Latn-233-1984", authority: "ISO", note: "Arabic · 233" },
      { code: "alalc-ara-Arab-Latn-1997", authority: "ALA-LC", note: "Arabic · 1997" },
      { code: "odni-ara-Arab-Latn-2015", authority: "ODNI", note: "Arabic · 2015" },
    ],
  },
  {
    id: "greek",
    label: "Greek → Latin",
    sourceScript: "Grek",
    sampleInput: "Ελευθερίου",
    sampleOutput: "Eleutheriou",
    systems: [
      { code: "iso-ell-Grek-Latn-843-1997-t1", authority: "ISO", note: "843 · t1" },
      { code: "iso-ell-Grek-Latn-843-1997-t2", authority: "ISO", note: "843 · t2" },
      { code: "alalc-ell-Grek-Latn-1997", authority: "ALA-LC", note: "Greek · 1997" },
      { code: "bgnpcgn-ell-Grek-Latn-1962", authority: "BGN/PCGN", note: "Greek · 1962" },
    ],
  },
  {
    id: "hindi",
    label: "Devanagari → Latin",
    sourceScript: "Deva",
    sampleInput: "महात्मा",
    sampleOutput: "mahātmā",
    systems: [
      { code: "un-hin-Deva-Latn-2016", authority: "UN", note: "Hindi · 2016" },
      { code: "iso-hin-Deva-Latn-15919-2001", authority: "ISO", note: "15919" },
      { code: "alalc-hin-Deva-Latn-2011", authority: "ALA-LC", note: "Hindi · 2011" },
      { code: "var-pra-Deva-Latn-iast-1912", authority: "IAST", note: "1912" },
    ],
  },
]

// Permalink state — read once on mount, sync on change.
const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
const initialFamily = urlParams.get("f") ?? families[0]!.id
const initialFamilyObj = families.find((f) => f.id === initialFamily) ?? families[0]!
const initialInput = urlParams.get("i") ?? initialFamilyObj.sampleInput
const initialObserved = urlParams.get("o") ?? initialFamilyObj.sampleOutput

const familyId = ref(initialFamily)
const input = ref(initialInput)
const observed = ref(initialObserved)
const candidates = ref<{ system: CandidateSystem; output: string; distance: number; error?: string }[]>([])
const running = ref(false)

let client: WorkerClient | null = null

async function ensureEngine() {
  if (client) return
  client = createWorkerClient()
}

const currentFamily = computed(() => families.find((f) => f.id === familyId.value)!)

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  let prev = new Array<number>(b.length + 1)
  let curr = new Array<number>(b.length + 1)
  for (let j = 0; j <= b.length; j++) prev[j] = j
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j]! + 1, curr[j - 1]! + 1, prev[j - 1]! + cost)
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[b.length]!
}

async function detect() {
  if (!client) return
  running.value = true
  candidates.value = []
  const out: typeof candidates.value = []
  await Promise.all(
    currentFamily.value.systems.map(async (sys) => {
      try {
        const output = await client!.transliterate(sys.code, input.value)
        const distance = levenshtein(output, observed.value)
        out.push({ system: sys, output, distance })
      } catch (e) {
        out.push({ system: sys, output: "", distance: Number.MAX_SAFE_INTEGER, error: (e as Error).message })
      }
      candidates.value = [...out].sort((a, b) => a.distance - b.distance)
    }),
  )
  running.value = false
}

function selectFamily(id: string) {
  familyId.value = id
  const f = families.find((x) => x.id === id)
  if (f) {
    input.value = f.sampleInput
    observed.value = f.sampleOutput
  }
  syncUrl()
}

function syncUrl() {
  if (typeof window === "undefined") return
  const params = new URLSearchParams()
  if (familyId.value) params.set("f", familyId.value)
  if (input.value) params.set("i", input.value)
  if (observed.value) params.set("o", observed.value)
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`)
}

const bestMatch = computed(() => candidates.value[0])
const worstDistance = computed(() =>
  Math.max(1, ...candidates.value.map((c) => c.distance)),
)

onMounted(async () => {
  await ensureEngine()
  await detect()
})

onUnmounted(() => client?.terminate())
</script>

<template>
  <div class="detect">
    <div class="family-rail">
      <p class="rail-label">Script family</p>
      <div class="family-row">
        <button
          v-for="f in families"
          :key="f.id"
          :class="['family-pill', { active: f.id === familyId }]"
          @click="selectFamily(f.id)"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <div class="io-grid">
      <div class="io-field">
        <label>Source ({{ currentFamily.sourceScript }})</label>
        <input v-model="input" type="text" spellcheck="false" />
      </div>
      <div class="io-arrow" aria-hidden="true">→</div>
      <div class="io-field">
        <label>Observed romanization</label>
        <input v-model="observed" type="text" spellcheck="false" />
      </div>
    </div>

    <div class="actions">
      <button class="detect-btn" :disabled="running" @click="detect">
        {{ running ? "Detecting…" : "Find matching system" }}
      </button>
      <p v-if="bestMatch && !running" class="verdict">
        Best match:
        <strong>{{ bestMatch.system.authority }}</strong>
        ({{ bestMatch.system.note }})
        <span v-if="bestMatch.distance === 0" class="exact">— exact</span>
      </p>
    </div>

    <ul class="rank">
      <li v-for="c in candidates" :key="c.system.code" :class="{ top: c === bestMatch }">
        <div class="rank-meta">
          <span class="rank-auth">{{ c.system.authority }}</span>
          <span class="rank-note">{{ c.system.note }}</span>
        </div>
        <div class="rank-output">
          <span class="rank-text">{{ c.error ? "⚠ " + c.error : c.output }}</span>
        </div>
        <div class="rank-distance">
          <div class="distance-bar">
            <div class="distance-fill" :style="{ width: `${100 - (c.distance / worstDistance) * 100}%` }"></div>
          </div>
          <span class="distance-num tnum">{{ c.distance }}</span>
        </div>
        <a class="rank-link" :href="`/maps/${c.system.code}`" title="View system">↗</a>
      </li>
    </ul>

    <p class="detect-deck">
      The detector transliterates your source text through every system
      in the family, then ranks by Levenshtein distance between each
      output and your observed romanization. Distance 0 means the
      system produced your observed output exactly.
    </p>
  </div>
</template>

<style scoped>
.detect {
  display: grid;
  gap: 1.5rem;
}

.family-rail .rail-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-stone);
  margin: 0 0 0.625rem;
}
.family-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.family-pill {
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
.family-pill:hover { border-color: var(--color-brand); }
.family-pill.active {
  background: var(--color-brand);
  border-color: var(--color-brand);
  color: var(--color-vellum);
}

.io-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.875rem;
  align-items: end;
}
@media (min-width: 900px) {
  .io-grid { grid-template-columns: 1fr auto 1fr; }
}
.io-field { display: grid; gap: 0.4rem; }
.io-field label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-stone);
}
.io-field input {
  font-family: var(--font-display);
  font-size: 1.5rem;
  padding: 0.75rem 0.9rem;
  border: 1.5px solid var(--color-rule);
  background: var(--color-vellum);
  color: var(--color-ink);
  border-radius: 1px;
  outline: none;
}
.io-field input:focus { border-color: var(--color-brand); }
.io-arrow {
  color: var(--color-highlight);
  font-family: var(--font-mono);
  font-size: 1.25rem;
  text-align: center;
  padding-bottom: 0.5rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}
.detect-btn {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.7rem 1.4rem;
  background: var(--color-highlight);
  color: var(--color-vellum);
  border: 1.5px solid var(--color-highlight);
  cursor: pointer;
  border-radius: 1px;
  transition: all 0.15s ease;
}
.detect-btn:hover:not(:disabled) {
  background: var(--color-highlight-deep);
  border-color: var(--color-highlight-deep);
}
.detect-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.verdict {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-stone);
}
.verdict strong {
  color: var(--color-ink);
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 500;
}
.verdict .exact {
  color: var(--color-brand-deep);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.rank {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 2px solid var(--color-ink);
}
.rank li {
  display: grid;
  grid-template-columns: 160px 1fr 180px 30px;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-rule);
}
@media (max-width: 768px) {
  .rank li {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }
}
.rank li.top {
  background: color-mix(in srgb, var(--color-brand) 8%, transparent);
  padding-inline: 0.5rem;
  margin-inline: -0.5rem;
}
.rank-meta { display: flex; flex-direction: column; gap: 0.15rem; }
.rank-auth {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-brand-deep);
  font-weight: 500;
}
.rank-note {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-stone-light);
}
.rank-output {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-style: italic;
  color: var(--color-highlight);
  letter-spacing: -0.01em;
}
.rank-distance {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
.distance-bar {
  flex: 1;
  height: 4px;
  background: var(--color-rule);
  border-radius: 1px;
  overflow: hidden;
}
.distance-fill {
  height: 100%;
  background: var(--color-brand);
  transition: width 0.3s ease;
}
.distance-num {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-stone);
  min-width: 2rem;
  text-align: right;
}
.rank-link {
  color: var(--color-stone-light);
  text-decoration: none;
  font-size: 0.85rem;
  text-align: center;
}
.rank-link:hover { color: var(--color-highlight); }

.detect-deck {
  font-size: 0.9375rem;
  color: var(--color-stone);
  line-height: 1.6;
  margin: 0;
  padding-top: 1rem;
  border-top: 1px solid var(--color-rule);
}
</style>
