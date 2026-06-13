# TB001 Page-5 Power Boundary

## Purpose

This is the first real TB001 simulation case. It tests a minimal but plausible
interpretation of the page-5/page-4 power-control boundary:

* a page-4-derived control signal enables one page-5 switched output branch
* a `DMN5L06DMK-AB`-class NMOS pulls the gate of an `FDS6574`-class PMOS
* the PMOS gates one representative `V1P8-*` UUT branch toward the connector
  boundary

The first engineering question is:

Does this provisional topology produce a clean and monotonic startup on a
representative UUT-facing 1.8 V branch, or does it immediately suggest gate,
load, or sequencing problems that should change our reconstruction?

## Evidence Basis

Primary evidence used:

* `../TB001/evidence/schematics/tb001/pages/page-04-serial-power-control.md`
* `../TB001/evidence/schematics/tb001/pages/page-05-power-outputs.md`
* `../TB001/evidence/schematics/tb001/power/v1p8-source-load-map.md`
* `../TB001/evidence/schematics/tb001/interfaces/power-output-boundary.md`
* `input/source.svg`

These sources support:

* page 4 as the strongest current control-boundary candidate
* page 5 as the strongest current switched power-output boundary candidate
* `DMN5L06DMK-AB` as the lower-risk already-placed transistor family
* `FDS6574` as the higher-risk unresolved switching family
* repeated `V1P8-Core/UUT`, `V1P8-IO/UUT`, `V1P8-Analog/UUT`, and
  `VddLo/UUT` labels on the page-5 boundary

## Current Abstraction

This case does **not** claim exact pin mapping yet.

Instead it captures one simulation-worthy hypothesis:

* upstream `V1P8` behaves like a low-impedance 1.8 V source
* a page-4 control line behaves like an active-high enable
* an NMOS pull-down turns on a PMOS high-side switch
* the switched node drives a connector-facing UUT branch with bulk and resistive
  load

That is enough to reason about:

* whether the control polarity makes sense
* whether the branch turns on cleanly
* whether the gate node is likely too weak or too slow
* whether the provisional load makes the branch collapse or ring

## Current Run Result

The current `ngspice` run produces a partial-turn-on result:

* `EN` rises to `3.3 V`
* `PGATE` is pulled down to about `0.2 mV`
* `VOUT` rises from `0 V` to about `1.10 V`
* the branch therefore turns on partially, but still does not reach the full
  `1.8 V` source level

Current interpretation:

* the control side of the hypothesis looks coherent
* the switched-power side is plausible enough to pass current
* the present single-pass interpretation may still under-represent the true
  strength or structure of the page-5 switching family

Most likely reasons for the limited output level:

* the unresolved `FDS6574` family may represent a stronger or composite switch
  than the single-pass abstraction used here
* the page-5 branch may include additional structure not yet modeled in this
  minimal slice
* the current simplified device and load assumptions may still be too weak or
  too incomplete for a realistic full-rail result

That means the case is now useful in a more specific way: it no longer says the
topology is simply dead wrong, but it does suggest the baseline single-pass
model is not yet strong enough.

## Known Limitations

* The imported SVG has path-only geometry, so `extract-svg` does not recover
  text labels from it yet.
* Exact `J18/J19`, `J4-J6`, and `J11/J12` connector mapping is still unknown.
* Exact device identity and sizing for the `FDS6574` family is still unresolved.
* The case models one representative branch, not the full transistor bank.

## Workflow

Generate artifacts and attempt the full pipeline:

```bash
cd toolbox/enrichment
./dist/pcb-sim pipeline --case-dir examples/pcb/cases/tb001-page5-power-boundary
```

Or run the stages separately:

```bash
cd toolbox/enrichment
./dist/pcb-sim extract-svg --svg examples/pcb/cases/tb001-page5-power-boundary/input/source.svg --out examples/pcb/cases/tb001-page5-power-boundary/artifacts/svg-summary.json
./dist/pcb-sim render --spec examples/pcb/cases/tb001-page5-power-boundary/circuit.json --out examples/pcb/cases/tb001-page5-power-boundary/artifacts/schematic.svg
./dist/pcb-sim build-deck --spec examples/pcb/cases/tb001-page5-power-boundary/circuit.json --out examples/pcb/cases/tb001-page5-power-boundary/artifacts/circuit.cir --data-file ../outputs/sim.dat
./dist/pcb-sim run --deck examples/pcb/cases/tb001-page5-power-boundary/artifacts/circuit.cir --out-log examples/pcb/cases/tb001-page5-power-boundary/outputs/run.log
./dist/pcb-sim report --case-dir examples/pcb/cases/tb001-page5-power-boundary --out examples/pcb/cases/tb001-page5-power-boundary/outputs/REPORT.md
```

## Next Iteration Targets

* split the single representative load into domain-specific variants
* add a second control condition for startup fault or disable behavior
* test alternate switch interpretation for the `FDS6574` family
* tighten the connector and rail mapping as page-5 wiring becomes explicit

## Immediate Next Step

The next simulation iteration should keep the same control-side abstraction but
change the page-5 switching hypothesis around the `FDS6574` family.

Most likely next comparison:

* current hypothesis: `FDS6574` behaves like a simple PMOS high-side pass
  element
* next hypothesis: `FDS6574` participates in a different switching arrangement
  or requires additional branch structure that is absent from this slice

That comparison has now been run. The stronger-bank hypothesis improves the
representative branch from about `1.10 V` to about `1.43 V`, which suggests the
baseline single-pass interpretation is likely too weak.
