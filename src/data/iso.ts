/**
 * Build-time helpers for ISO 15924 (script) and ISO 639 (language)
 * code resolution. Powered by @iso24229/iso15924-data and
 * @iso24229/iso639-data — the canonical ISO registries, kept in sync
 * with the upstream sources via npm.
 *
 * Server-only: imports `node:fs`. Used in Astro frontmatter, not in
 * browser islands.
 */

import { codes as scriptCodes } from "@iso24229/iso15924-data"
import { parts as langParts } from "@iso24229/iso639-data"

const langIndex = new Map<string, string>()
for (const part of ["639-1", "639-2", "639-3", "639-5"] as const) {
  for (const [code, entry] of Object.entries(langParts[part] ?? {})) {
    const name = (entry as { name?: { en?: string } }).name?.en
    if (name && !langIndex.has(code)) langIndex.set(code, name)
  }
}

const scriptIndex = new Map<string, { name: string; number: string | number }>()
for (const [code, entry] of Object.entries(scriptCodes)) {
  const name = (entry as { name?: { en?: string }; pva?: string }).name?.en
    ?? (entry as { pva?: string }).pva
    ?? code
  scriptIndex.set(code, { name, number: (entry as { number: string | number }).number })
}

/**
 * Resolve an ISO 15924 script code (e.g. "Cyrl", "Arab") to its
 * English display name. Falls back to the code itself if unknown.
 */
export function scriptName(code: string): string {
  return scriptIndex.get(code)?.name ?? code
}

/**
 * Resolve an ISO 15924 script code to its numeric identifier.
 */
export function scriptNumber(code: string): string | number | undefined {
  return scriptIndex.get(code)?.number
}

/**
 * Resolve an ISO 639 language code (any of 639-1/2/3/5 — e.g. "en",
 * "eng", "deu", "ger") to its English display name.
 */
export function languageName(code: string): string {
  return langIndex.get(code) ?? code
}

/**
 * Parse a catalogue `language` field which may take the form
 * `iso-639-2:eng` or `iso-639-2:eng|iso-639-2:en` (cross-language).
 * Returns the resolved display name(s), comma-separated.
 */
export function parseLanguageField(field: string | undefined): string {
  if (!field) return ""
  const parts = field.split("|").map((p) => p.trim())
  const names = parts
    .map((p) => {
      const m = p.match(/^iso-639-\d:(.+)$/)
      if (!m) return p
      return languageName(m[1]!)
    })
    .filter(Boolean)
  return names.join(" / ")
}

export interface ScriptInfo {
  code: string
  name: string
  number?: string | number
}

export interface LanguageInfo {
  code: string
  name: string
}

/** All known script codes — used to populate filter facets. */
export function allScripts(): ScriptInfo[] {
  return [...scriptIndex.entries()]
    .map(([code, { name, number }]) => ({ code, name, number }))
    .sort((a, b) => a.code.localeCompare(b.code))
}
