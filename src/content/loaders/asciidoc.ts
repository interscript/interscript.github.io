/**
 * Astro content loader for AsciiDoc files.
 *
 * Reads .adoc files from a directory, parses frontmatter (title, author,
 * date) from the AsciiDoc header manually, and converts the body to HTML
 * via @asciidoctor/core. The Astro page renders the HTML directly.
 *
 * Pure function; no global state. Adding new content types doesn't
 * modify the renderer (OCP).
 */

import { readFileSync, readdirSync } from "node:fs"
import { basename, join, resolve } from "node:path"
import * as asciidoctor from "@asciidoctor/core"

export interface AsciiDocEntry {
  id: string
  data: {
    title: string
    author: string
    date: string
    summary?: string
  }
  body: string
  filePath: string
}

interface ParsedHeader {
  title: string
  author: string
  date: string
  body: string
}

function parseAsciiDocHeader(raw: string): ParsedHeader {
  const lines = raw.split("\n")
  let title = ""
  let author = ""
  let date = ""

  // First non-empty `= ` line is the title
  const titleLine = lines.find((l) => l.startsWith("= "))
  if (titleLine) {
    title = titleLine.replace(/^=\s+/, "").trim()
  }

  // Subsequent non-attribute lines, before the first attribute (`:`):
  // - Line 2 (if present) is author(s)
  // - `v1.0, YYYY-MM-DD` line gives date
  const bodyStartIdx = lines.findIndex((l, i) => i > 0 && l.trim() === "")
  const headerLines = lines.slice(1, bodyStartIdx < 0 ? lines.length : bodyStartIdx)
  for (const l of headerLines) {
    const trimmed = l.trim()
    if (!trimmed || trimmed.startsWith(":")) continue
    const versionMatch = trimmed.match(/^v[\d.]+,\s*([\d-]+)/)
    if (versionMatch) {
      date = versionMatch[1]!
      continue
    }
    if (!author) author = trimmed
  }

  return { title, author, date, body: raw }
}

/**
 * Read every .adoc file in `dir` (relative to project root) and return
 * parsed entries sorted newest-first by date. Pure function; no global
 * state.
 */
export function renderAsciiDocDir(dir: string): AsciiDocEntry[] {
  const fullDir = resolve(process.cwd(), dir)
  const files = readdirSync(fullDir).filter((f) => f.endsWith(".adoc"))
  const entries: AsciiDocEntry[] = []

  for (const file of files) {
    const path = join(fullDir, file)
    const raw = readFileSync(path, "utf8")
    const header = parseAsciiDocHeader(raw)
    const body = asciidoctor.convert(raw, { standalone: false }) as unknown as string
    const id = basename(file, ".adoc")
    entries.push({
      id,
      data: {
        title: header.title || id,
        author: header.author,
        date: header.date,
        summary: extractSummary(raw),
      },
      body,
      filePath: path,
    })
  }

  return entries.sort((a, b) => b.data.date.localeCompare(a.data.date))
}

function extractSummary(raw: string): string | undefined {
  const lines = raw.split("\n")
  const bodyStart = lines.findIndex((l, i) => i > 0 && l.trim() === "")
  if (bodyStart < 0) return undefined
  const firstPara = lines
    .slice(bodyStart + 1)
    .filter((l) => l.trim() && !l.startsWith(":"))
    .slice(0, 3)
    .join(" ")
    .replace(/https?:\/\/\S+\[([^\]]+)\]/g, "$1")
    .replace(/\*+/g, "")
  if (firstPara.length === 0) return undefined
  return firstPara.slice(0, 200) + (firstPara.length > 200 ? "…" : "")
}
