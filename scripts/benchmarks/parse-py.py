#!/usr/bin/env python
"""Corpus parse timing (py leg): parse_isc over every corpus .isc with
a dependency resolver over maps/ + libs/, in-process, RUNS runs.
Methodology follows maps/docs/parity/README.md §A.8 (median-of-3,
clean serial runs).

Usage: python3 parse-py.py <py_src_dir> <maps_dir> <libs_dir>

(py's bare parse entry cannot take the corpus alone — see parity README
G12 — so this measures the corpus-complete form, same as the audit.)
"""

import sys
import time
from pathlib import Path

RUNS = 3

py_src, maps_dir, libs_dir = sys.argv[1], sys.argv[2], sys.argv[3]
sys.path.insert(0, py_src)

from interscript import parse_isc  # noqa: E402

d = Path(maps_dir)
libd = Path(libs_dir)
files = sorted(d.glob("*.isc"))
assert files, f"no .isc files under {maps_dir}"

_cache: dict[str, object] = {}


def resolve(target: str):
    """Dependency resolver over the corpus + libs dirs (mirrors the
    load-path resolution ruby/rs do natively)."""
    if target in _cache:
        return _cache[target]
    for base in (d, libd):
        p = base / f"{target}.isc"
        if p.exists():
            doc = parse_isc(p.read_text(encoding="utf-8"), p.name, resolve_dependency=resolve)
            _cache[target] = doc
            return doc
    return None


for run in range(RUNS):
    _cache.clear()
    t0 = time.perf_counter()
    ok = 0
    for f in files:
        try:
            parse_isc(f.read_text(encoding="utf-8"), f.name, resolve_dependency=resolve)
            ok += 1
        except Exception as e:  # noqa: BLE001 - report and continue
            print(f"FAIL {f.name}: {str(e).splitlines()[0]}", file=sys.stderr)
    t1 = time.perf_counter()
    print(f"py parse {ok}/{len(files)} maps in {(t1 - t0) * 1000:.1f} ms")
