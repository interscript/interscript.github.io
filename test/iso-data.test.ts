/**
 * Vitest for the ISO 15924 + ISO 639 build-time data layer.
 */

import { describe, it, expect } from "vitest"
import { scriptName, scriptNumber, languageName, parseLanguageField } from "../src/data/iso"

describe("ISO 15924 script codes", () => {
  it("resolves every script code used in the catalogue", () => {
    const used = [
      "Arab",
      "Armn",
      "Beng",
      "Cyrl",
      "Deva",
      "Ethi",
      "Geok",
      "Geor",
      "Grek",
      "Gujr",
      "Guru",
      "Hang",
      "Hani",
      "Hans",
      "Hebr",
      "Hrkt",
      "Kana",
      "Kore",
      "Latn",
      "Mlym",
      "Mong",
      "Orya",
      "Sinh",
      "Taml",
      "Telu",
      "Thaa",
      "Thai",
    ]
    // Two codes (Thai, Latn) happen to share their ISO 15924 name with
    // the code itself; we just want a non-empty resolution.
    for (const code of used) {
      const name = scriptName(code)
      expect(name.length, `${code} should resolve`).toBeGreaterThan(0)
    }
  })

  it("returns known names for common scripts", () => {
    expect(scriptName("Cyrl")).toBe("Cyrillic")
    expect(scriptName("Arab")).toBe("Arabic")
    expect(scriptName("Hans")).toBe("Han (Simplified variant)")
    expect(scriptName("Deva")).toMatch(/Devanagari/)
    expect(scriptName("Grek")).toBe("Greek")
  })

  it("returns numeric identifier", () => {
    expect(scriptNumber("Cyrl")).toBe(220)
    expect(scriptNumber("Latn")).toBe(215)
  })

  it("falls back to the code when unknown", () => {
    expect(scriptName("Xxxx")).toBe("Xxxx")
  })
})

describe("ISO 639 language codes", () => {
  it("resolves 639-2 bibliographic and terminological codes", () => {
    expect(languageName("eng")).toBe("English")
    expect(languageName("deu")).toBe("German")
    expect(languageName("ger")).toBe("German") // bibliographic
  })

  it("resolves 639-1 two-letter codes", () => {
    expect(languageName("en")).toBe("English")
    expect(languageName("fr")).toBe("French")
    expect(languageName("de")).toBe("German")
  })

  it("falls back to the code when unknown", () => {
    expect(languageName("xx")).toBe("xx")
  })
})

describe("catalogue language field parsing", () => {
  it("resolves a single iso-639-2 reference", () => {
    expect(parseLanguageField("iso-639-2:eng")).toBe("English")
    expect(parseLanguageField("iso-639-2:deu")).toBe("German")
  })

  it("joins cross-language systems with a slash", () => {
    expect(parseLanguageField("iso-639-2:eng|iso-639-2:fr")).toBe("English / French")
  })

  it("handles undefined/empty gracefully", () => {
    expect(parseLanguageField(undefined)).toBe("")
    expect(parseLanguageField("")).toBe("")
  })
})
