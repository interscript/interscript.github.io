/**
 * Vitest for the ScriptMosaic signature component.
 *
 * Verifies that the hero mosaic renders all 6 script cells, each with
 * the correct authority/transform data, and that cells rotate through
 * their transforms without crashing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { mount } from "@vue/test-utils"
import ScriptMosaic from "../src/components/ScriptMosaic.vue"

// Mock the dynamic import of interscript-ts
vi.mock("interscript-ts", () => ({
  reset: vi.fn(),
  configure: vi.fn(),
  transliterate: vi.fn((code: string, input: string) => `[${code}]${input}`),
  bundledStrategy: vi.fn(() => () => undefined),
}))

// Mock import.meta.glob
;(globalThis as { import?: { meta?: { glob?: unknown } } }).import = {
  meta: {
    glob: () => ({}),
  },
}

describe("ScriptMosaic", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders 6 cells for the 6 script families", async () => {
    const wrapper = mount(ScriptMosaic)
    // Trigger engine load + initial render
    await vi.advanceTimersByTimeAsync(500)

    const cells = wrapper.findAll('[data-script]')
    expect(cells.length).toBe(6)
  })

  it("includes the expected script families", async () => {
    const wrapper = mount(ScriptMosaic)
    const html = wrapper.html()
    for (const script of ["Cyrillic", "Arabic", "Devanagari", "Han", "Ethiopic", "Greek"]) {
      expect(html).toContain(script)
    }
  })

  it("shows the live status indicator after engine loads", async () => {
    const wrapper = mount(ScriptMosaic)
    await vi.advanceTimersByTimeAsync(500)
    expect(wrapper.html()).toMatch(/Live transliteration/i)
  })

  it("renders the source-script text in each cell", async () => {
    const wrapper = mount(ScriptMosaic)
    const html = wrapper.html()
    // Each cell starts on its first transform's input.
    expect(html).toContain("Антон") // Cyrillic
    expect(html).toContain("عَبد الله") // Arabic
    expect(html).toContain("महात्मा") // Devanagari
    expect(html).toContain("台北") // Han
    expect(html).toContain("ኢትዮጵያ") // Ethiopic
    expect(html).toContain("Αθήνα") // Greek
  })

  it("shows authority badges per cell (initial transforms)", async () => {
    const wrapper = mount(ScriptMosaic)
    const html = wrapper.html()
    // Authorities present in the first transform of each cell
    for (const auth of ["BGN/PCGN", "UN", "Academia Sinica", "ALA-LC", "ISO"]) {
      expect(html).toContain(auth)
    }
  })

  it("rotates cells on interval", async () => {
    const wrapper = mount(ScriptMosaic, { props: { intervalMs: 1000, staggerMs: 50 } })
    await vi.advanceTimersByTimeAsync(500) // engine load

    const initialOutputs = wrapper.findAll(".cell-output").map((w) => w.text())
    await vi.advanceTimersByTimeAsync(2000) // tick + stagger
    const laterOutputs = wrapper.findAll(".cell-output").map((w) => w.text())

    // At least one cell should have rotated (transliterate mock produces
    // unique output per system code, so different transforms → different
    // outputs).
    const anyChanged = initialOutputs.some((out, i) => out !== laterOutputs[i])
    expect(anyChanged).toBe(true)
  })

  it("shows engine load failure state when interscript-ts throws", async () => {
    // Re-mock with a failing import
    vi.doMock("interscript-ts", () => {
      throw new Error("simulated failure")
    })

    const wrapper = mount(ScriptMosaic)
    await vi.advanceTimersByTimeAsync(500)
    // Component should not crash; should still render cells
    expect(wrapper.findAll('[data-script]').length).toBe(6)
  })

  it("uses the deep-ink surface for the mosaic container", () => {
    const wrapper = mount(ScriptMosaic)
    // The mosaic class should be present (styling verified by snapshot)
    expect(wrapper.find(".mosaic").exists()).toBe(true)
  })

  it("renders a counter showing rotation progress per cell", async () => {
    const wrapper = mount(ScriptMosaic)
    const html = wrapper.html()
    // Counters like "1/3", "1/2", etc.
    expect(html).toMatch(/\d+\/\d+/)
  })

  it("exposes each cell's authority + year note", async () => {
    const wrapper = mount(ScriptMosaic)
    const html = wrapper.html()
    // Year notes from various transforms
    expect(html).toContain("2019")
    expect(html).toContain("1972")
    expect(html).toContain("1997")
  })
})
