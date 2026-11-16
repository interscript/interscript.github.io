# Benchmarks

Reproducible runtime benchmarks behind the `/benchmarks` page. Every
number on the page comes out of these scripts; the generated data file
(`src/data/benchmarks.json`) is committed but **never hand-edited** —
regenerate it and commit the result.

## Requirements: sibling checkouts

The scripts read the four runtime engines and the map corpus from
sibling checkouts in the monorepo layout (`~/src/interscript/` by
default, one directory above this repo). This is a hard requirement —
the engines under test are the actual runtime trees, not npm installs:

| Tree             | Default sibling path    | State required                                                                                                            |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| map corpus       | `../maps`               | `maps/maps/*.isc` + `maps/libs/*.isc`                                                                                     |
| interscript-rs   | `../interscript-rs`     | release build: `cargo build --release`                                                                                    |
| interscript-ts   | `../interscript-ts`     | built dist: `npm ci && npm run build`                                                                                     |
| interscript-ruby | `../interscript-ruby`   | lib tree (run with `ruby -I <tree>/lib`)                                                                                  |
| py ISC engine    | `../interscript-py-isc` | the `wo17/py-override-placement` branch of the interscript-ruby repo (the py package sits at `interscript-py/` inside it) |

Every location can be overridden with `INTERSCRIPT_MAPS`,
`INTERSCRIPT_RS`, `INTERSCRIPT_TS`, `INTERSCRIPT_RUBY`, and
`INTERSCRIPT_PY` environment variables. The ruby legs use the `ruby`
interpreter by default; override with `RUBY_BIN` when the engine under
test requires a specific toolchain (the interscript-ruby CI matrix
covers 3.3 and 3.4 — run the ruby legs on a covered version; the
machine profile in the generated data records which binary ran).

> The py ISC engine ships on an unmerged branch of the interscript-ruby
> repo; `interscript-py` main still carries the legacy `.imp` engine and
> cannot run the ISC corpus. The generated data records the exact tree
> and commit for every runtime.

Note on rs's engine dependency: the rs checkout pins `parsanol` by an
absolute path to a local checkout. If that checkout does not satisfy the
version requirement, point the dependency at the matching crates.io
release (code-identical) and record the deviation when publishing.

## Methodology

Follows the parity audit's timing protocol
(`maps/docs/parity/README.md` §A.8): median-of-3 runs, **clean serial
execution** — one runtime at a time, nothing else running on the
machine. In-process timing for ruby/ts/py (`Process.clock_gettime` /
`performance.now()` / `perf_counter` around the sweep), wall clock for
the rs CLI legs (`iscrs parse`, `iscrs capture` — adds ~20 ms process
startup). Replay legs do one unmeasured warmup pass before the measured
passes so lazy compilation settles.

Legs:

1. **Corpus parse** — each runtime's native parse entry over every
   `maps/maps/*.isc` (py with a dependency resolver over maps+libs, its
   bare entry cannot take the corpus alone — parity README G12).
2. **Golden replay** — every row of the RS golden capture
   (`interscript-rs/tests/golden/isc-wf0.jsonl`) through each runtime.
   rs's number is `iscrs capture` (load + transliterate every corpus
   map's embedded tests in one process, includes parse).
3. **Fixed-input throughput** — the committed fixture
   (`fixtures/input-set.jsonl`, every 25th golden row, sampled once and
   frozen) through each runtime. rs has no batch transliteration CLI, so
   its throughput is derived from the capture leg and marked as such.

## Files

- `config.mjs` — sibling-path resolution, machine profile, medians
- `parse-ruby.rb` / `parse-ts.mjs` / `parse-py.py` — corpus parse legs
- `replay-ruby.rb` / `replay-ts.mjs` / `replay-py.py` — jsonl replay
  legs (golden + fixture via argument)
- `make-fixture.mjs` — regenerate the fixed input set from the golden
  capture (run once; the fixture is committed)
- `generate.mjs` — the orchestrator: runs every leg serially, aggregates
  medians, writes `src/data/benchmarks.json`
- `fixtures/input-set.jsonl` — the frozen fixed input set

## Run

```sh
# one-time (or when deliberately re-freezing the input set):
node scripts/benchmarks/make-fixture.mjs

# full regeneration (~30-60 min of clean serial runs):
node scripts/benchmarks/generate.mjs
```

Then commit `src/data/benchmarks.json` together with the runtime
changes it measures. CI runs `astro check` + build, which fail if the
page references data that does not exist.
