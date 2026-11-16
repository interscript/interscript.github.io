/**
 * Shared configuration for the /benchmarks scripts.
 *
 * All legs read the four runtime engines and the map corpus from
 * SIBLING CHECKOUTS of the monorepo layout (see README.md). Paths are
 * env-overridable so the scripts stay reproducible on any machine with
 * the same layout:
 *
 *   INTERSCRIPT_MAPS   maps checkout (maps/maps + maps/libs)
 *   INTERSCRIPT_RS     interscript-rs checkout (release iscrs binary)
 *   INTERSCRIPT_TS     interscript-ts checkout (built dist/)
 *   INTERSCRIPT_RUBY   interscript-ruby checkout
 *   INTERSCRIPT_PY     interscript-py ISC-engine checkout
 *                      (the py/ISC line maintained inside the
 *                      interscript-ruby repo, branch
 *                      wo17/py-override-placement; its Python tree
 *                      sits at <checkout>/interscript-py)
 */

import { execFileSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import os from "node:os"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = resolve(HERE, "..", "..")

const sibling = (envVar, relative) => {
  const fromEnv = process.env[envVar]
  if (fromEnv) return resolve(fromEnv)
  return resolve(REPO_ROOT, "..", relative)
}

export const SIBLINGS = {
  maps: sibling("INTERSCRIPT_MAPS", "maps"),
  rs: sibling("INTERSCRIPT_RS", "interscript-rs"),
  ts: sibling("INTERSCRIPT_TS", "interscript-ts"),
  ruby: sibling("INTERSCRIPT_RUBY", "interscript-ruby"),
  py: sibling("INTERSCRIPT_PY", "interscript-py-isc"),
}

export const MAPS_DIR = (s) => resolve(s ?? SIBLINGS.maps, "maps")
export const LIBS_DIR = (s) => resolve(s ?? SIBLINGS.maps, "libs")
export const GOLDEN_JSONL = () => resolve(SIBLINGS.rs, "tests", "golden", "isc-wf0.jsonl")
export const RS_BINARY = () => resolve(SIBLINGS.rs, "target", "release", "iscrs")
export const TS_DIST = () => resolve(SIBLINGS.ts, "dist")
export const RUBY_LIB = () => resolve(SIBLINGS.ruby, "lib")
export const PY_SRC = () => resolve(SIBLINGS.py, "interscript-py", "src")
export const FIXTURE = resolve(HERE, "fixtures", "input-set.jsonl")
/**
 * The ruby binary for the ruby legs. Defaults to `ruby`; override when
 * the engine under test requires a specific toolchain (the
 * interscript-ruby CI matrix covers 3.3/3.4 — run the legs on a
 * covered version; the machine profile records which one ran).
 */
export const RUBY_BIN = process.env.RUBY_BIN ?? "ruby"

export function requireSiblings() {
  const missing = []
  if (!existsSync(MAPS_DIR())) missing.push(`maps corpus: ${MAPS_DIR()}`)
  if (!existsSync(RS_BINARY()))
    missing.push(`rs release binary (cargo build --release in ${SIBLINGS.rs}): ${RS_BINARY()}`)
  if (!existsSync(resolve(TS_DIST(), "isc", "index.js")))
    missing.push(`ts built dist (npm ci && npm run build in ${SIBLINGS.ts})`)
  if (!existsSync(RUBY_LIB())) missing.push(`ruby lib: ${RUBY_LIB()}`)
  if (!existsSync(PY_SRC())) missing.push(`py ISC src: ${PY_SRC()}`)
  if (!existsSync(GOLDEN_JSONL())) missing.push(`golden jsonl: ${GOLDEN_JSONL()}`)
  if (missing.length > 0) {
    console.error(
      "Missing sibling checkouts (set INTERSCRIPT_* env vars to point elsewhere):\n  " +
        missing.join("\n  "),
    )
    process.exit(2)
  }
}

/** `git rev-parse HEAD` of a checkout, or null outside a git repo. */
export function headSha(dir) {
  try {
    return execFileSync("git", ["-C", dir, "rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim()
  } catch {
    return null
  }
}

function firstFileLine(path, pattern) {
  try {
    const text = readFileSync(path, "utf8")
    for (const line of text.split("\n")) {
      const m = line.match(pattern)
      if (m) return m[1]
    }
    return null
  } catch {
    return null
  }
}

/** Versions carved out of each tree's own metadata (best effort). */
export function runtimeVersions() {
  const tsPkg = (() => {
    try {
      return JSON.parse(readFileSync(resolve(SIBLINGS.ts, "package.json"), "utf8"))
    } catch {
      return {}
    }
  })()
  return {
    rs: firstFileLine(resolve(SIBLINGS.rs, "Cargo.toml"), /^version = "(.+)"$/),
    ts: tsPkg.version ?? null,
    ruby: firstFileLine(
      resolve(SIBLINGS.ruby, "lib", "interscript", "version.rb"),
      /VERSION = "(.+)"$/,
    ),
    py: firstFileLine(
      resolve(SIBLINGS.py, "interscript-py", "pyproject.toml"),
      /^version = "(.+)"$/m,
    ),
  }
}

export function machineProfile() {
  const cpu = os.cpus()[0]
  return {
    os: `${os.type()} ${os.release()}`,
    arch: os.arch(),
    cpuModel: cpu?.model ?? "unknown",
    cores: os.cpus().length,
    memoryGb: Math.round(os.totalmem() / 1024 / 1024 / 1024),
    node: process.version,
    toolchains: {
      ruby: toolchainVersion(RUBY_BIN, ["-v"], /ruby (\S+)/),
      python: toolchainVersion("python3", ["--version"], /Python (\S+)/),
    },
  }
}

function toolchainVersion(cmd, args, pattern) {
  try {
    const out = execFileSync(cmd, args, { encoding: "utf8" })
    const m = out.match(pattern)
    return m ? m[1] : out.trim()
  } catch {
    return null
  }
}

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const odd = sorted.length % 2 === 1
  return odd ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}
