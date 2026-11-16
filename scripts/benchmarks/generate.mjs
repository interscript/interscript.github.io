#!/usr/bin/env node
// Orchestrates every benchmark leg SERIALLY (one runtime at a time —
// the parity-README methodology: clean serial runs, nothing else
// executing), aggregates medians, and writes src/data/benchmarks.json.
//
// NEVER hand-edit src/data/benchmarks.json — regenerate it:
//
//   npm run generate:benchmarks
//   (node scripts/benchmarks/generate.mjs)
//
// Legs (all median-of-3 unless noted):
//   corpus parse    ruby / ts / py in-process; rs via the iscrs binary
//                   (wall clock, includes ~20 ms process startup)
//   golden replay   the interscript-rs golden capture (isc-wf0.jsonl)
//                   through ruby / ts / py in-process; rs via iscrs
//                   capture (native single-process capture, includes
//                   corpus parse)
//   fixture         the committed fixed input set
//                   (fixtures/input-set.jsonl) through ruby / ts / py;
//                   rs throughput derived from its capture leg (rs has
//                   no batch transliteration CLI)

import { spawnSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  readFileSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import os from "node:os"
import { resolve } from "node:path"
import {
  FIXTURE,
  GOLDEN_JSONL,
  LIBS_DIR,
  MAPS_DIR,
  PY_SRC,
  REPO_ROOT,
  RUBY_BIN,
  RUBY_LIB,
  RS_BINARY,
  SIBLINGS,
  TS_DIST,
  headSha,
  machineProfile,
  median,
  requireSiblings,
  runtimeVersions,
} from "./config.mjs"

const RUNS = 3
const OUT = resolve(REPO_ROOT, "src", "data", "benchmarks.json")

const log = (...a) => console.log("[bench]", ...a)

function runAndCapture(cmd, args) {
  const t0 = Date.now()
  const res = spawnSync(cmd, args, { encoding: "utf8" })
  const wallMs = Date.now() - t0
  if (res.error) throw res.error
  return { stdout: res.stdout ?? "", stderr: res.stderr ?? "", wallMs, status: res.status }
}

/** Parse "… <ok>/<total> … in <ms> ms …" driver lines. */
function parseDriverLine(line) {
  const m = line.match(/(\w+) (\w+) (\d+)\/(\d+) (?:maps|rows) in ([\d.]+) ms/)
  if (!m) return null
  return { runtime: m[1], kind: m[2], ok: Number(m[3]), total: Number(m[4]), ms: Number(m[5]) }
}

function runDriverLegs(name, cmd, args, expected = RUNS) {
  log(`${name}: start`)
  const { stdout, stderr, wallMs } = runAndCapture(cmd, args)
  const lines = stdout.split("\n").filter((l) => l.includes(" in "))
  if (lines.length !== expected) {
    console.error(stderr)
    throw new Error(`${name}: expected ${expected} result lines, got ${lines.length}`)
  }
  const parsed = lines.map(parseDriverLine)
  if (parsed.some((p) => !p || p.total === 0)) {
    console.error(stderr)
    throw new Error(`${name}: unparseable driver output: ${lines.join(" | ")}`)
  }
  const mss = parsed.map((p) => p.ms)
  const med = median(mss)
  // Every row/map must EXECUTE (an execution error is a harness or
  // engine failure — refuse to publish). Output divergence on replay
  // legs is a runtime finding, not a harness failure: record it and
  // surface it on the page. Parse legs must be corpus-complete.
  const failed = Math.min(...parsed.map((p) => p.ok))
  const errMatch = stderr.match(/exec_errors (\d+)/)
  const execErrors = errMatch ? Number(errMatch[1]) : 0
  const divMatch = stderr.match(/divergent (\d+)/)
  const divergent = divMatch ? Number(divMatch[1]) : 0
  if (failed + execErrors + divergent !== parsed[0].total) {
    console.error(stderr)
    throw new Error(
      `${name}: row accounting mismatch (${failed} matched + ${execErrors} exec errors + ${divergent} divergent != ${parsed[0].total})`,
    )
  }
  if (execErrors > 0) {
    console.error(stderr)
    throw new Error(`${name}: ${execErrors} row execution error(s) — refusing to publish`)
  }
  if (parsed[0].kind === "parse" && failed !== parsed[0].total) {
    console.error(stderr)
    throw new Error(
      `${name}: only ${failed}/${parsed[0].total} maps parsed — fix the leg before publishing numbers`,
    )
  }
  log(
    `${name}: median ${med.toFixed(0)} ms (${parsed.map((p) => `${p.ok}/${p.total}`).join(", ")})${
      divergent > 0 ? ` [${divergent} divergent rows]` : ""
    } [${wallMs} ms total]`,
  )
  return {
    runs: mss,
    medianMs: Math.round(med * 10) / 10,
    matched: failed,
    total: parsed[0].total,
    ...(divergent > 0 ? { divergent } : {}),
    rowsPerSec: Math.round((parsed[0].total / (med / 1000)) * 10) / 10,
  }
}

function rsParseLeg() {
  const results = []
  for (let i = 0; i < RUNS; i++) {
    const { stdout, stderr, wallMs, status } = runAndCapture(RS_BINARY(), [
      "parse",
      MAPS_DIR(),
      "--maps",
      MAPS_DIR(),
    ])
    if (status !== 0) throw new Error(`rs parse failed: ${stderr}`)
    const m = stdout.match(/(\d+)\/(\d+)\/(\d+) files parsed/)
    if (!m) throw new Error(`rs parse: unparseable output: ${stdout.trim()}`)
    if (Number(m[1]) !== Number(m[3])) {
      throw new Error(
        `rs parse: only ${m[1]}/${m[3]} maps parsed — refusing to publish partial numbers`,
      )
    }
    results.push({ wallMs, ok: Number(m[1]), total: Number(m[3]) })
    log(`rs parse run ${i + 1}: ${wallMs} ms (${m[1]}/${m[3]})`)
  }
  const mss = results.map((r) => r.wallMs)
  const med = median(mss)
  const total = results[0].total
  return {
    runs: mss,
    medianMs: Math.round(med),
    matched: Math.min(...results.map((r) => r.ok)),
    total,
    perMapMeanMs: Math.round((med / total) * 100) / 100,
    note: "wall clock of the iscrs process (includes ~20 ms startup)",
  }
}

function rsCaptureLeg() {
  const tmpDir = mkdtempSync(resolve(os.tmpdir(), "wo20-capture-"))
  const outFile = resolve(tmpDir, "capture.jsonl")
  const runs = []
  let rows = 0
  let maps = 0
  let loadErrors = 0
  for (let i = 0; i < RUNS; i++) {
    const { stdout, stderr, wallMs, status } = runAndCapture(RS_BINARY(), [
      "capture",
      "--root",
      MAPS_DIR(),
      "-o",
      outFile,
    ])
    if (status !== 0) throw new Error(`rs capture failed: ${stderr}`)
    const m = stdout.match(/captured (\d+) rows from (\d+) maps \((\d+) load errors\)/)
    if (!m) throw new Error(`rs capture: unparseable output: ${stdout.trim()}`)
    rows = Number(m[1])
    maps = Number(m[2])
    loadErrors = Number(m[3])
    runs.push(wallMs)
    log(`rs capture run ${i + 1}: ${wallMs} ms (${rows} rows)`)
  }
  rmSync(tmpDir, { recursive: true, force: true })
  const med = median(runs)
  return {
    runs,
    medianMs: Math.round(med),
    rows,
    maps,
    loadErrors,
    rowsPerSec: Math.round((rows / (med / 1000)) * 10) / 10,
    note: "iscrs capture wall clock: load + transliterate every corpus map's embedded tests in one process (includes corpus parse)",
  }
}

function corpusCount() {
  return readdirSync(MAPS_DIR()).filter((f) => f.endsWith(".isc")).length
}

function goldenRows() {
  return readFileSync(GOLDEN_JSONL(), "utf8")
    .split("\n")
    .filter((l) => l.trim().length > 0).length
}

function fixtureRows() {
  return readFileSync(FIXTURE, "utf8")
    .split("\n")
    .filter((l) => l.trim().length > 0).length
}

function main() {
  requireSiblings()
  if (!existsSync(FIXTURE)) {
    throw new Error(`fixture missing (${FIXTURE}) — run: node scripts/benchmarks/make-fixture.mjs`)
  }

  const legs = {
    // ---- corpus parse (B1) ----
    parse: {
      rs: rsParseLeg(),
      ruby: runDriverLegs("ruby parse", RUBY_BIN, [
        "-I",
        RUBY_LIB(),
        resolve(import.meta.dirname, "parse-ruby.rb"),
        MAPS_DIR(),
      ]),
      ts: runDriverLegs("ts parse", process.execPath, [
        resolve(import.meta.dirname, "parse-ts.mjs"),
        TS_DIST(),
        MAPS_DIR(),
      ]),
      py: runDriverLegs("py parse", "python3", [
        resolve(import.meta.dirname, "parse-py.py"),
        PY_SRC(),
        MAPS_DIR(),
        LIBS_DIR(),
      ]),
    },
    // ---- golden replay (B3) ----
    goldenReplay: {
      rs: rsCaptureLeg(),
      ruby: runDriverLegs("ruby replay golden", RUBY_BIN, [
        "-I",
        RUBY_LIB(),
        resolve(import.meta.dirname, "replay-ruby.rb"),
        MAPS_DIR(),
        LIBS_DIR(),
        GOLDEN_JSONL(),
      ]),
      ts: runDriverLegs("ts replay golden", process.execPath, [
        resolve(import.meta.dirname, "replay-ts.mjs"),
        TS_DIST(),
        MAPS_DIR(),
        LIBS_DIR(),
        GOLDEN_JSONL(),
      ]),
      py: runDriverLegs("py replay golden", "python3", [
        resolve(import.meta.dirname, "replay-py.py"),
        PY_SRC(),
        MAPS_DIR(),
        LIBS_DIR(),
        GOLDEN_JSONL(),
      ]),
    },
    // ---- fixed-input-set throughput (B2) ----
    fixtureThroughput: {
      ruby: runDriverLegs("ruby replay fixture", RUBY_BIN, [
        "-I",
        RUBY_LIB(),
        resolve(import.meta.dirname, "replay-ruby.rb"),
        MAPS_DIR(),
        LIBS_DIR(),
        FIXTURE,
      ]),
      ts: runDriverLegs("ts replay fixture", process.execPath, [
        resolve(import.meta.dirname, "replay-ts.mjs"),
        TS_DIST(),
        MAPS_DIR(),
        LIBS_DIR(),
        FIXTURE,
      ]),
      py: runDriverLegs("py replay fixture", "python3", [
        resolve(import.meta.dirname, "replay-py.py"),
        PY_SRC(),
        MAPS_DIR(),
        LIBS_DIR(),
        FIXTURE,
      ]),
    },
  }

  // rs fixture throughput derives from the capture leg (documented).
  legs.fixtureThroughput.rs = {
    rowsPerSec: legs.goldenReplay.rs.rowsPerSec,
    derivedFrom: "goldenReplay.rs (iscrs capture); rs has no batch transliteration CLI",
  }

  for (const leg of Object.values(legs.parse)) {
    if (leg.perMapMeanMs === undefined) {
      leg.perMapMeanMs = Math.round((leg.medianMs / leg.total) * 100) / 100
    }
  }

  const versions = runtimeVersions()
  const data = {
    schema: 1,
    generatedAt: new Date().toISOString(),
    methodology: {
      runs: RUNS,
      aggregation: "median",
      serial: true,
      note: "clean serial runs — one runtime at a time, nothing else executing (maps/docs/parity/README.md §A.8)",
    },
    machine: machineProfile(),
    runtimeHeads: {
      rs: {
        repo: "interscript/interscript-rs",
        ref: "main",
        sha: headSha(SIBLINGS.rs),
        version: versions.rs,
        path: SIBLINGS.rs,
      },
      ts: {
        repo: "interscript/interscript-ts",
        ref: "main",
        sha: headSha(SIBLINGS.ts),
        version: versions.ts,
        path: SIBLINGS.ts,
      },
      ruby: {
        repo: "interscript/interscript-ruby",
        ref: "main",
        sha: headSha(SIBLINGS.ruby),
        version: versions.ruby,
        path: SIBLINGS.ruby,
      },
      py: {
        repo: "interscript/interscript-ruby (py ISC engine tree)",
        ref: "wo17/py-override-placement",
        sha: headSha(SIBLINGS.py),
        version: versions.py,
        path: SIBLINGS.py,
        note: "the py ISC engine ships on this unmerged branch of the interscript-ruby repo; interscript-py main still carries the legacy .imp engine and cannot run the ISC corpus",
      },
    },
    corpus: {
      maps: corpusCount(),
      goldenRows: goldenRows(),
      fixtureRows: fixtureRows(),
      sha: headSha(SIBLINGS.maps),
    },
    ...legs,
  }

  mkdirSync(resolve(REPO_ROOT, "src", "data"), { recursive: true })
  writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n")
  console.log(`[bench] wrote ${OUT}`)
}

try {
  main()
} catch (e) {
  console.error("[bench] FAILED:", e.message)
  process.exit(1)
}
