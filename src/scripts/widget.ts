/**
 * Interscript embeddable widget.
 *
 * Lightweight custom element designed for third-party embedding via
 * <iframe src="https://interscript.org/embed">. Reads initial system
 * and input from URL params; renders a minimal transliteration UI.
 *
 * Maps load on demand via the shared ISC-first strategy stack —
 * no full catalogue bundle, no main-thread jank.
 */

import { configure, reset, transliterateAsync } from "interscript-ts"
import { mapStrategies } from "./map-strategies"

// Configure once with HTTP loader + persistent cache.
reset()
configure({ strategies: mapStrategies() })

interface WidgetSystem {
  code: string
  name: string
  authority: string
  sourceScript: string
  destinationScript: string
  language: string
}

class InterscriptWidget extends HTMLElement {
  private systems: WidgetSystem[] = []
  private selected = ""
  private input = ""
  private output = ""
  private loading = false
  private error: string | null = null

  connectedCallback() {
    const raw = this.getAttribute("data-systems")
    if (raw) {
      try {
        this.systems = JSON.parse(raw) as WidgetSystem[]
      } catch {
        this.systems = []
      }
    }

    // Read URL params for initial state (iframe embed)
    const params = new URLSearchParams(window.location.search)
    const initialSystem = params.get("system") ?? this.systems[0]?.code ?? ""
    const initialInput = params.get("input") ?? ""
    this.selected = initialSystem
    this.input = initialInput

    this.render()
    if (this.input) void this.transliterate()
  }

  private async transliterate() {
    if (!this.selected || !this.input) {
      this.output = ""
      this.render()
      return
    }
    this.loading = true
    this.error = null
    this.render()
    try {
      this.output = await transliterateAsync(this.selected, this.input)
    } catch (e) {
      this.error = (e as Error).message
      this.output = ""
    }
    this.loading = false
    this.render()
  }

  private render() {
    const selected = this.systems.find((s) => s.code === this.selected)
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" })
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "Inter Tight Variable", "Inter Tight", system-ui, sans-serif;
          background: #fcfaf4;
          color: #1a1d1f;
          padding: 1.25rem;
          border: 1px solid #d8d0bc;
          border-radius: 2px;
          --brand: #008075;
          --highlight: #b8462e;
          --stone: #5c5852;
          --rule: #d8d0bc;
          --vellum: #fcfaf4;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.875rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--rule);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          text-decoration: none;
          color: inherit;
          font-family: "Fraunces", Georgia, serif;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: -0.015em;
        }
        .brand img { width: 16px; height: 16px; transform: skewY(-2deg); }
        .system-select {
          font-family: inherit;
          font-size: 0.8125rem;
          padding: 0.4rem 0.625rem;
          background: white;
          border: 1px solid var(--rule);
          border-radius: 1px;
          color: inherit;
          max-width: 60%;
        }
        .pair {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 480px) {
          .pair { grid-template-columns: 1fr 1fr; }
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        label {
          font-family: "JetBrains Mono", ui-monospace, monospace;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--stone);
        }
        textarea, .output {
          font-family: "Fraunces", Georgia, serif;
          font-size: 1rem;
          padding: 0.625rem;
          border: 1px solid var(--rule);
          border-radius: 1px;
          background: white;
          min-height: 4.5rem;
          resize: vertical;
          color: inherit;
          line-height: 1.4;
        }
        textarea { outline: none; }
        textarea:focus { border-color: var(--brand); }
        .output {
          background: #f6f3ec;
          color: var(--highlight);
          font-style: italic;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .output.loading { color: var(--stone); font-style: normal; font-size: 0.85rem; }
        .output.error { color: var(--highlight); font-style: normal; font-size: 0.85rem; }
        .footer {
          margin-top: 0.75rem;
          font-size: 0.7rem;
          font-family: "JetBrains Mono", monospace;
          letter-spacing: 0.06em;
          color: var(--stone);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .footer a {
          color: var(--brand);
          text-decoration: none;
        }
        .footer a:hover { text-decoration: underline; }
      </style>
      <div class="header">
        <a class="brand" href="https://interscript.org" target="_blank" rel="noreferrer">
          <img src="/symbol.svg" alt="" />
          Interscript
        </a>
        <select class="system-select">
          ${this.systems
            .map(
              (s) =>
                `<option value="${this.escapeHtml(s.code)}" ${s.code === this.selected ? "selected" : ""}>${this.escapeHtml(s.authority.toUpperCase())} · ${this.escapeHtml(s.name)}</option>`,
            )
            .join("")}
        </select>
      </div>
      <div class="pair">
        <div class="field">
          <label>${this.escapeHtml(selected?.sourceScript ?? "Source")} ${selected?.language ? `· ${this.escapeHtml(selected.language)}` : ""}</label>
          <textarea rows="3" placeholder="Type here…">${this.escapeHtml(this.input)}</textarea>
        </div>
        <div class="field">
          <label>${this.escapeHtml(selected?.destinationScript ?? "Latin")}</label>
          <div class="output ${this.loading ? "loading" : ""} ${this.error ? "error" : ""}">
            ${this.error ? "⚠ " + this.escapeHtml(this.error) : this.loading ? "Loading…" : this.escapeHtml(this.output)}
          </div>
        </div>
      </div>
      <div class="footer">
        <span>Powered by <a href="https://interscript.org" target="_blank" rel="noreferrer">Interscript</a> · BSD-2-Clause</span>
        <span><a href="https://interscript.org/maps/${this.selected}" target="_blank" rel="noreferrer">View system →</a></span>
      </div>
    `

    const textarea = shadow.querySelector("textarea") as HTMLTextAreaElement
    textarea.addEventListener("input", (e) => {
      this.input = (e.target as HTMLTextAreaElement).value
      void this.transliterate()
    })

    const select = shadow.querySelector("select") as HTMLSelectElement
    select.addEventListener("change", (e) => {
      this.selected = (e.target as HTMLSelectElement).value
      void this.transliterate()
    })
  }

  private escapeHtml(s: string): string {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  }
}

customElements.define("interscript-widget", InterscriptWidget)
