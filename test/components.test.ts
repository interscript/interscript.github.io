/**
 * Vitest component tests for Vue islands — mount + behavior verification.
 *
 * Uses @vue/test-utils for component-level testing without going
 * through the full Astro build pipeline.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount } from "@vue/test-utils"
import QuickBox from "../src/components/QuickBox.vue"

// Mock the dynamic import of interscript-ts so tests don't need
// Vite's import.meta.glob polyfill.
vi.mock("interscript-ts", () => ({
  reset: vi.fn(),
  configure: vi.fn(),
  transliterate: vi.fn((code: string, input: string) => `[${code}]${input}`),
  bundledStrategy: vi.fn(() => () => undefined),
}))

// Mock import.meta.glob — Vue test utils doesn't have it.
;(globalThis as { import?: { meta?: { glob?: unknown } } }).import = {
  meta: {
    glob: () => ({}),
  },
}

describe("QuickBox", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders with default system", () => {
    const wrapper = mount(QuickBox)
    expect(wrapper.find("select").exists()).toBe(true)
    expect(wrapper.find("input").exists()).toBe(true)
  })

  it("honours defaultSystem prop", () => {
    const wrapper = mount(QuickBox, {
      props: { defaultSystem: "bgnpcgn-deu-Latn-Latn-2000" },
    })
    const select = wrapper.find("select")
    expect((select.element as HTMLSelectElement).value).toBe("bgnpcgn-deu-Latn-Latn-2000")
  })

  it("honours defaultInput prop", () => {
    const wrapper = mount(QuickBox, {
      props: { defaultInput: "Tschüß!" },
    })
    expect(wrapper.find("input").element.value).toBe("Tschüß!")
  })

  it("renders 5 system options", () => {
    const wrapper = mount(QuickBox)
    const options = wrapper.findAll("option")
    expect(options.length).toBe(5)
  })

  it("applies compact class when compact=true", () => {
    const wrapper = mount(QuickBox, { props: { compact: true } })
    expect(wrapper.classes()).toContain("compact")
  })

  it("shows loading placeholder before engine is ready", () => {
    const wrapper = mount(QuickBox)
    expect(wrapper.text()).toMatch(/Loading|—|Type text/)
  })
})
