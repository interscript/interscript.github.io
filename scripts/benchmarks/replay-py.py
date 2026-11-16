#!/usr/bin/env python
"""Transliteration replay (py leg): execute every row of a jsonl row
set ({"map", "src", "out"}) through the engine, in-process, RUNS runs.
Corpus parse+compile is setup (unmeasured); only the transliteration
loop is timed. Reports rows/sec and the exact-match count.

Usage: python3 replay-py.py <py_src_dir> <maps_dir> <libs_dir> <rows.jsonl>

Protocol mirrors the py golden additivity test (tests/test_golden_capture.py):
parse + compile the whole corpus in memory, resolve dependencies and
WF-1 ruleuset expansion lazily against the same corpus.
"""

import json
import sys
import time
from pathlib import Path

RUNS = 3

py_src, maps_dir, libs_dir, rows_path = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
sys.path.insert(0, py_src)

from interscript.executor import execute_stage  # noqa: E402
from interscript.isc import isc_to_compiled_map, parse_isc  # noqa: E402

rows = [
    json.loads(line)
    for line in Path(rows_path).read_text(encoding="utf-8").splitlines()
    if line.strip()
]
assert rows, f"no rows in {rows_path}"

d = Path(maps_dir)
libd = Path(libs_dir)

# Setup (unmeasured): parse + compile every corpus .isc; dependencies
# resolve lazily against the same corpus (libs first — system maps
# declare dependencies on the libraries).
docs: dict[str, object] = {}


def resolve_dependency(target: str):
    return docs.get(target)


for directory in (libd, d):
    if not directory.is_dir():
        continue
    for path in sorted(directory.glob("*.isc")):
        docs[path.stem] = parse_isc(
            path.read_text(encoding="utf-8"),
            filename=str(path),
            resolve_dependency=resolve_dependency,
        )
compiled = {stem: isc_to_compiled_map(doc) for stem, doc in docs.items()}


class _Resolver:
    """MapResolver over the in-memory corpus (the MapLoader protocol)."""

    def load(self, system_code: str):
        cm = compiled.get(system_code)
        if cm is None:
            raise KeyError(system_code)
        return cm


resolver = _Resolver()

# Unmeasured warmup pass (first-touch execution paths settle here).
for row in rows:
    try:
        execute_stage(compiled[row["map"]], "main", row["src"], resolver)
    except Exception:  # noqa: BLE001
        continue

for run in range(RUNS):
    matched = 0
    errors = 0
    t0 = time.perf_counter()
    for row in rows:
        try:
            cm = compiled[row["map"]]
            out = execute_stage(cm, "main", row["src"], resolver, None)
        except Exception:  # noqa: BLE001 - unexecutable rows still cost the attempt
            errors += 1
            continue
        if out == row["out"]:
            matched += 1
    t1 = time.perf_counter()
    ms = (t1 - t0) * 1000
    print(
        f"py replay {matched}/{len(rows)} rows in {ms:.1f} ms ({len(rows) / (ms / 1000):.0f} rows/s)"
    )
    divergent = len(rows) - matched - errors
    if divergent or errors:
        print(
            f"divergent {divergent} exec_errors {errors}",
            file=sys.stderr,
        )
