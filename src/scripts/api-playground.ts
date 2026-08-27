/**
 * API playground — interactive try-it-now for the Interscript API.
 *
 * Mounts into #playground-root on /api. Lets users pick a system,
 * type input, see output, and copy the equivalent curl/JS/Ruby call.
 */

import { configure, reset, transliterateAsync, httpStrategy } from "interscript"

interface System {
  code: string
  label: string
}

const rootOrNull = document.getElementById("playground-root")
if (!rootOrNull) throw new Error("playground root missing")
// Hoisted function bodies don't inherit the guard's narrowing, so bind
// a non-null alias for them.
const root: HTMLElement = rootOrNull

const systems = JSON.parse(root.dataset.systems ?? "[]") as System[]

reset()
configure({
  strategies: [httpStrategy({ baseUrl: "/maps", cacheKeyPrefix: "isx-api:" })],
})

interface State {
  system: string
  input: string
  output: string
  loading: boolean
  error: string | null
}

const state: State = {
  system: systems[0]?.code ?? "",
  input: "Антон",
  output: "",
  loading: false,
  error: null,
}

function snippetJs(s: State): string {
  return `import { transliterate } from "interscript"

const result = transliterate(
  "${s.system}",
  ${JSON.stringify(s.input)}
)
console.log(result)
// → ${JSON.stringify(s.output)}`
}

function snippetRuby(s: State): string {
  return `require "interscript"

result = Interscript.transliterate(
  "${s.system}",
  ${JSON.stringify(s.input)}
)
puts result
# → ${JSON.stringify(s.output)}`
}

function snippetCurl(s: State): string {
  return `# GET request — easy to test in any terminal
curl -G 'https://interscript.org/api/transliterate' \\
  --data-urlencode 'system=${s.system}' \\
  --data-urlencode 'input=${s.input}'

# Or POST a JSON body:
curl -X POST 'https://interscript.org/api/transliterate' \\
  -H 'Content-Type: application/json' \\
  -d '{"system": "${s.system}", "input": ${JSON.stringify(s.input)}}'`
}

function render() {
  root.innerHTML = `
    <style>
      .pg-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
      @media (min-width: 720px) {
        .pg-grid { grid-template-columns: 1fr 1fr; }
      }
      .pg-field { display: grid; gap: 0.4rem; }
      .pg-label {
        font-family: "JetBrains Mono", monospace;
        font-size: 0.65rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #5c5852;
      }
      .pg-select, .pg-input, .pg-output {
        font-family: "Inter Tight", Inter, system-ui, sans-serif;
        font-size: 1.125rem;
        padding: 0.625rem 0.75rem;
        border: 1px solid #d8d0bc;
        border-radius: 1px;
        background: white;
        color: #1a1d1f;
        outline: none;
        min-height: 2.5rem;
      }
      .pg-select { font-family: "Inter Tight Variable", "Inter Tight", system-ui, sans-serif; font-size: 0.9rem; }
      .pg-input:focus, .pg-select:focus { border-color: #008075; }
      .pg-output {
        background: #f6f3ec;
        color: #b8462e;
        font-style: italic;
        min-height: 4.5rem;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .pg-output.loading { color: #5c5852; font-style: normal; font-size: 0.85rem; }
      .pg-output.error { color: #b8462e; font-style: normal; font-size: 0.85rem; }
      .pg-tabs {
        display: flex;
        gap: 0;
        border-bottom: 1px solid #d8d0bc;
        margin-top: 1.5rem;
      }
      .pg-tab {
        font-family: "JetBrains Mono", monospace;
        font-size: 0.75rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 0.5rem 0.95rem;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        color: #5c5852;
        cursor: pointer;
      }
      .pg-tab.active {
        color: #008075;
        border-bottom-color: #008075;
      }
      .pg-snippet {
        position: relative;
        margin: 0.875rem 0 0;
      }
      .pg-snippet pre {
        margin: 0;
        font-size: 0.78rem;
      }
      .pg-copy {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        font-family: "JetBrains Mono", monospace;
        font-size: 0.65rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        background: rgba(252, 250, 244, 0.9);
        color: #1a1d1f;
        border: 1px solid #d8d0bc;
        padding: 0.3rem 0.55rem;
        cursor: pointer;
        border-radius: 1px;
      }
      .pg-copy:hover { background: #008075; color: white; border-color: #008075; }
    </style>
    <div class="pg-grid">
      <div class="pg-field">
        <label class="pg-label" for="pg-system">System</label>
        <select id="pg-system" class="pg-select">
          ${systems.map((s) => `<option value="${s.code}" ${s.code === state.system ? "selected" : ""}>${s.label}</option>`).join("")}
        </select>
      </div>
      <div class="pg-field">
        <label class="pg-label" for="pg-input">Input</label>
        <input id="pg-input" class="pg-input" type="text" value="${escapeAttr(state.input)}" spellcheck="false" />
      </div>
    </div>
    <div class="pg-field" style="margin-top: 1.25rem;">
      <label class="pg-label">Output</label>
      <div class="pg-output ${state.loading ? "loading" : ""} ${state.error ? "error" : ""}">
        ${state.error ? "⚠ " + escapeHtml(state.error) : state.loading ? "Loading…" : escapeHtml(state.output)}
      </div>
    </div>

    <div class="pg-tabs">
      <button class="pg-tab active" data-tab="js">JavaScript</button>
      <button class="pg-tab" data-tab="ruby">Ruby</button>
      <button class="pg-tab" data-tab="curl">curl</button>
    </div>
    <div class="pg-snippet">
      <button class="pg-copy">Copy</button>
      <pre><code id="pg-snippet-code">${escapeHtml(currentSnippet())}</code></pre>
    </div>
  `

  const select = root.querySelector("#pg-system") as HTMLSelectElement
  select.addEventListener("change", () => {
    state.system = select.value
    void run()
  })

  const input = root.querySelector("#pg-input") as HTMLInputElement
  input.addEventListener("input", () => {
    state.input = input.value
    void run()
  })

  root.querySelectorAll<HTMLButtonElement>(".pg-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      root!.querySelectorAll(".pg-tab").forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")
      currentTab = tab.dataset.tab as TabKind
      updateSnippet()
    })
  })

  root.querySelector(".pg-copy")?.addEventListener("click", () => {
    void navigator.clipboard.writeText(currentSnippet())
  })
}

type TabKind = "js" | "ruby" | "curl"
let currentTab: TabKind = "js"

function currentSnippet(): string {
  if (currentTab === "ruby") return snippetRuby(state)
  if (currentTab === "curl") return snippetCurl(state)
  return snippetJs(state)
}

function updateSnippet() {
  const code = document.getElementById("pg-snippet-code")
  if (code) code.textContent = currentSnippet()
}

async function run() {
  if (!state.system || !state.input) {
    state.output = ""
    state.error = null
    render()
    return
  }
  state.loading = true
  state.error = null
  // Don't re-render the whole thing for the output area — patch just that
  const out = root.querySelector(".pg-output") as HTMLElement
  if (out) {
    out.classList.add("loading")
    out.classList.remove("error")
    out.textContent = "Loading…"
  }
  try {
    state.output = await transliterateAsync(state.system, state.input)
    state.loading = false
  } catch (e) {
    state.error = (e as Error).message
    state.output = ""
    state.loading = false
  }
  render()
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, "&quot;")
}

void run()
render()
