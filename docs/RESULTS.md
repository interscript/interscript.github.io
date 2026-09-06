
## ara-diac-small-2-gkd — on-policy distillation NEGATIVE: 6.0036 (2026-09-06)

The on-policy rung (GKD: student-generated mistakes scored by the
teacher, a120384 wiring, 10,995 steps, labels sha e70ce991): teacher
reproduces 2.289, student **6.0036** full-set, paired bootstrap delta
3.4083 [3.109, 3.743], p=0 — gate FAILED, and 1.43pp WORSE than the
off-policy sequence-KD rung it was meant to improve (G2a 4.5701).

This completes the residual-attribution program with a clean pattern:
every lever tested fails to close the teacher-student gap —
* classical corpus add (G2b): flat-negative
* register swap (E6): negative
* on-policy distillation (GKD): negative, worse than off-policy
* memory layers (PKM): real but small (0.70pp), below bar
* epochs: small (0.25pp)
The residual is not data, not domain coverage, not an off/on-policy
deficit. It is a property of the compression itself at this rung —
the honest open question for the paper. On-policy stays listed in
Paper B's future work with its measured negative attached.
