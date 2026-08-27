/**
 * Vitest component tests for MapCatalogue — filtering, sorting,
 * search, sample rendering.
 */

import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import MapCatalogue from "../src/components/MapCatalogue.vue"

vi.mock("interscript", () => ({
  reset: vi.fn(),
  configure: vi.fn(),
  transliterate: vi.fn(),
  bundledStrategy: vi.fn(),
}))

const sampleEntries = [
  {
    code: "bgnpcgn-ukr-Cyrl-Latn-2019",
    authority: "bgnpcgn",
    name: "Romanization of Ukrainian (2019)",
    sourceScript: "Cyrl",
    destinationScript: "Latn",
    year: "2019",
    hasTest: true,
    testInput: "Антон",
    testExpected: "Anton",
  },
  {
    code: "alalc-amh-Ethi-Latn-2011",
    authority: "alalc",
    name: "ALA-LC Amharic (2011)",
    sourceScript: "Ethi",
    destinationScript: "Latn",
    year: "2011",
    hasTest: true,
    testInput: "ኢትዮጵያ",
    testExpected: "ʼiteyop̣eyā",
  },
  {
    code: "iso-rus-Cyrl-Latn-1995-no-test",
    authority: "iso",
    name: "ISO Russian (no test vector)",
    sourceScript: "Cyrl",
    destinationScript: "Latn",
    year: "1995",
    hasTest: false,
    testInput: null,
    testExpected: null,
  },
]

const defaultProps = {
  entries: sampleEntries,
  authorities: ["bgnpcgn", "alalc", "iso"],
  sourceScripts: ["Cyrl", "Ethi"],
  destinationScripts: ["Latn"],
}

describe("MapCatalogue", () => {
  it("renders all entries by default", () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    const cards = w.findAll(".card")
    expect(cards.length).toBe(3)
  })

  it("shows total count in footer", () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    expect(w.text()).toMatch(/3 of 3 maps/)
  })

  it("renders each entry's system code", () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    for (const e of sampleEntries) {
      expect(w.text()).toContain(e.code)
    }
  })

  it("filters by authority", async () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    await w.find("select").setValue("alalc")
    // The first select is search; the second is authority. Use direct.
    const selects = w.findAll("select")
    await selects[1]!.setValue("alalc")
    const cards = w.findAll(".card")
    expect(cards.length).toBe(1)
    expect(cards[0]!.text()).toContain("alalc-amh")
  })

  it("filters by 'with tests only'", async () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    const checkbox = w.find('input[type="checkbox"]')
    await checkbox.setValue(true)
    const cards = w.findAll(".card")
    expect(cards.length).toBe(2)
  })

  it("filters by search query (code)", async () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    const search = w.find('input[type="search"]')
    // "ukr" matches the system code only.
    await search.setValue("ukr")
    expect(w.findAll(".card").length).toBe(1)
    // "amharic" matches the entry name (case-insensitive).
    await search.setValue("amharic")
    expect(w.findAll(".card").length).toBe(1)
    // "zzz" matches nothing.
    await search.setValue("zzz")
    expect(w.findAll(".card").length).toBe(0)
  })

  it("shows empty state when no matches", async () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    await w.find('input[type="search"]').setValue("zzzzz-no-match")
    expect(w.find(".empty").exists()).toBe(true)
  })

  it("shows clear button when filters active", async () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    expect(w.find(".clear-btn").exists()).toBe(false)
    await w.find('input[type="search"]').setValue("ukr")
    expect(w.find(".clear-btn").exists()).toBe(true)
  })

  it("links each card to its detail page", () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    for (const e of sampleEntries) {
      const link = w.find(`a[href="/maps/${e.code}"]`)
      expect(link.exists()).toBe(true)
    }
  })

  it("renders test vector when present", () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    expect(w.text()).toContain("Антон")
    expect(w.text()).toContain("Anton")
    expect(w.text()).toContain("ኢትዮጵያ")
    expect(w.text()).toContain("ʼiteyop̣eyā")
  })

  it("shows 'No reference vector' for entries without test", () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    expect(w.text()).toContain("No reference vector")
  })

  it("shows script flow with arrow on each card", () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    const flows = w.findAll(".card-flow")
    expect(flows.length).toBe(3)
    // All flows contain a script pair and the arrow span exists.
    for (const f of flows) {
      expect(f.find(".arrow").exists()).toBe(true)
      expect(f.text()).toContain("Latn")
    }
    // At least one of the entries is Cyrl→Latn
    const texts = flows.map((f) => f.text())
    expect(texts.some((t) => t.includes("Cyrl"))).toBe(true)
  })

  it("clear button resets all filters", async () => {
    const w = mount(MapCatalogue, { props: defaultProps })
    await w.find('input[type="search"]').setValue("ukr")
    expect(w.findAll(".card").length).toBe(1)
    await w.find(".clear-btn").trigger("click")
    expect(w.findAll(".card").length).toBe(3)
  })
})
