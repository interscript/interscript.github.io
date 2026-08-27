<script setup lang="ts">
/**
 * MapCatalogue — searchable, filterable browser for all 287 maps.
 *
 * Visual metaphor: library card catalogue. Each map is a card with an
 * authority "stamp", script flow (source → destination), and a sample
 * test vector. Cards link to /maps/[systemCode] for full detail.
 *
 * Filter rail: by authority, source script, destination script.
 * Search: matches system code or name (fuzzy on lowercase).
 */
import { ref, computed, defineProps } from "vue"

interface CatalogueEntry {
  code: string
  authority: string
  name: string
  sourceScript: string
  destinationScript: string
  year: string
  language?: string
  description?: string
  hasTest: boolean
  testInput: string | null
  testExpected: string | null
  liveDemoable: boolean
}

const props = defineProps<{
  entries: CatalogueEntry[]
  authorities: string[]
  sourceScripts: string[]
  destinationScripts: string[]
}>()

const search = ref("")
const authorityFilter = ref<string>("")
const sourceFilter = ref<string>("")
const destFilter = ref<string>("")
const onlyWithTests = ref(false)
const onlyLiveDemoable = ref(false)
const sortBy = ref<"authority" | "code" | "name">("authority")

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  let list = props.entries.filter((e) => {
    if (authorityFilter.value && e.authority !== authorityFilter.value) return false
    if (sourceFilter.value && e.sourceScript !== sourceFilter.value) return false
    if (destFilter.value && e.destinationScript !== destFilter.value) return false
    if (onlyWithTests.value && !e.hasTest) return false
    if (onlyLiveDemoable.value && !e.liveDemoable) return false
    if (q) {
      const hay = `${e.code} ${e.name} ${e.authority}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  list = [...list].sort((a, b) => {
    if (sortBy.value === "code") return a.code.localeCompare(b.code)
    if (sortBy.value === "name") return a.name.localeCompare(b.name)
    // authority sort: by authority, then code
    if (a.authority !== b.authority) return a.authority.localeCompare(b.authority)
    return a.code.localeCompare(b.code)
  })

  return list
})

function clearFilters() {
  search.value = ""
  authorityFilter.value = ""
  sourceFilter.value = ""
  destFilter.value = ""
  onlyWithTests.value = false
  onlyLiveDemoable.value = false
}

const hasActiveFilters = computed(
  () =>
    search.value !== "" ||
    authorityFilter.value !== "" ||
    sourceFilter.value !== "" ||
    destFilter.value !== "" ||
    onlyWithTests.value ||
    onlyLiveDemoable.value,
)
</script>

<template>
  <div class="catalogue">
    <aside class="filter-rail">
      <div class="rail-section">
        <label class="field">
          <span class="field-label">Search</span>
          <input
            v-model="search"
            type="search"
            class="field-input"
            placeholder="System code or name…"
          />
        </label>
      </div>

      <div class="rail-section">
        <label class="field">
          <span class="field-label">Authority</span>
          <select v-model="authorityFilter" class="field-input">
            <option value="">All ({{ authorities.length }})</option>
            <option v-for="a in authorities" :key="a" :value="a">{{ a }}</option>
          </select>
        </label>
      </div>

      <div class="rail-section">
        <label class="field">
          <span class="field-label">Source script</span>
          <select v-model="sourceFilter" class="field-input">
            <option value="">All ({{ sourceScripts.length }})</option>
            <option v-for="s in sourceScripts" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
      </div>

      <div class="rail-section">
        <label class="field">
          <span class="field-label">Destination script</span>
          <select v-model="destFilter" class="field-input">
            <option value="">All ({{ destinationScripts.length }})</option>
            <option v-for="s in destinationScripts" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
      </div>

      <div class="rail-section rail-checkbox">
        <label>
          <input type="checkbox" v-model="onlyWithTests" />
          <span>With test vectors only</span>
        </label>
        <label>
          <input type="checkbox" v-model="onlyLiveDemoable" />
          <span>Live-demoable in browser</span>
        </label>
      </div>

      <div class="rail-section">
        <label class="field">
          <span class="field-label">Sort by</span>
          <select v-model="sortBy" class="field-input">
            <option value="authority">Authority</option>
            <option value="code">System code</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <button v-if="hasActiveFilters" class="clear-btn" type="button" @click="clearFilters">
        Clear filters
      </button>

      <p class="rail-count">{{ filtered.length }} of {{ entries.length }} maps</p>
    </aside>

    <div class="results">
      <ol class="cards" v-if="filtered.length > 0">
        <li v-for="entry in filtered" :key="entry.code" class="card">
          <a :href="`/maps/${entry.code}`" class="card-link">
            <div class="card-head">
              <span class="card-auth">{{ entry.authority }}</span>
              <div class="card-head-tags">
                <span v-if="entry.liveDemoable" class="tag tag-live" title="Runs live in browser">
                  <span class="dot" aria-hidden="true"></span>LIVE
                </span>
                <span class="card-year">{{ entry.year }}</span>
              </div>
            </div>
            <h3 class="card-name">{{ entry.name }}</h3>
            <code class="card-code">{{ entry.code }}</code>
            <div class="card-flow">
              <span class="script">{{ entry.sourceScript }}</span>
              <span class="arrow" aria-hidden="true">→</span>
              <span class="script">{{ entry.destinationScript }}</span>
            </div>
            <div v-if="entry.hasTest && entry.testInput && entry.testExpected" class="card-sample">
              <span class="sample-input">{{ entry.testInput }}</span>
              <span class="sample-arrow" aria-hidden="true">⇒</span>
              <span class="sample-output">{{ entry.testExpected }}</span>
            </div>
            <div v-else class="card-sample card-sample-empty">
              <span>No reference vector</span>
            </div>
          </a>
        </li>
      </ol>
      <div v-else class="empty">
        <p>No maps match these filters.</p>
        <button class="clear-btn" type="button" @click="clearFilters">Clear filters</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalogue {
  display: grid;
  grid-template-columns: 16rem 1fr;
  gap: 2.5rem;
  align-items: start;
}
@media (max-width: 1024px) {
  .catalogue {
    grid-template-columns: 1fr;
  }
}

/* Filter rail */
.filter-rail {
  position: sticky;
  top: 5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--color-vellum);
  border: 1px solid var(--color-rule);
  border-radius: 4px;
}
@media (max-width: 1024px) {
  .filter-rail {
    position: static;
  }
}
.rail-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.rail-checkbox label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-ink);
  cursor: pointer;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.field-label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-stone);
}
.field-input {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--color-rule);
  border-radius: 3px;
  background: var(--color-parchment);
  color: var(--color-ink);
  width: 100%;
}
.field-input:focus-visible {
  outline: 2px solid var(--color-ochre);
  outline-offset: 1px;
  border-color: var(--color-ochre);
}
.clear-btn {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--color-ink);
  background: transparent;
  color: var(--color-ink);
  border-radius: 3px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
  align-self: flex-start;
}
.clear-btn:hover {
  background: var(--color-ink);
  color: var(--color-vellum);
}
.rail-count {
  margin: 0;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-rule);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-stone);
}

/* Results */
.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1rem;
}
.card {
  background: var(--color-vellum);
  border: 1px solid var(--color-rule);
  border-radius: 4px;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;
  position: relative;
}
.card:hover {
  border-color: var(--color-ochre);
  transform: translateY(-1px);
}
.card-link {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.25rem;
  text-decoration: none;
  color: var(--color-ink);
  height: 100%;
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.card-head-tags {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.tag-live {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1rem 0.4rem;
  background: color-mix(in srgb, #16a34a 12%, transparent);
  color: #16a34a;
  border-radius: 2px;
  font-weight: 500;
}
.tag-live .dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: currentColor;
}
.card-auth {
  color: var(--color-ochre);
  font-weight: 500;
}
.card-year {
  color: var(--color-stone);
}
.card-name {
  font-family: var(--font-display);
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.25;
  margin: 0;
  color: var(--color-ink);
}
.card:hover .card-name {
  color: var(--color-ochre);
}
.card-code {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-stone);
  background: transparent;
  padding: 0;
  word-break: break-all;
}
.card-flow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-stone);
  margin-top: 0.25rem;
}
.card-flow .script {
  color: var(--color-ink);
}
.card-flow .arrow {
  color: var(--color-stone-light);
}

.card-sample {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--color-rule);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.5rem;
  align-items: baseline;
  font-family: var(--font-display);
  font-size: 0.9375rem;
}
.sample-input {
  color: var(--color-stone);
  word-break: break-word;
}
.sample-arrow {
  color: var(--color-ochre);
  font-family: var(--font-mono);
}
.sample-output {
  color: var(--color-ochre);
  font-style: italic;
  word-break: break-word;
}
.card-sample-empty {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-style: italic;
  color: var(--color-stone-light);
  display: block;
}

.empty {
  padding: 4rem 2rem;
  text-align: center;
  background: var(--color-vellum);
  border: 1px dashed var(--color-rule);
  border-radius: 4px;
}
.empty p {
  color: var(--color-stone);
  margin: 0 0 1rem;
}
</style>
