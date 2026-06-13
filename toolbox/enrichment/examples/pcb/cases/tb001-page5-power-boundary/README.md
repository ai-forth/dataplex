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

## First Run Result

The first completed `ngspice` run produced a useful negative result:

* `EN` rises to `3.3 V`
* `PGATE` is pulled down to about `11 mV`
* `VOUT` does **not** rise and remains effectively at `0 V`

Current interpretation:

* the control side of the hypothesis is at least directionally plausible
* the switched-power side of the hypothesis is still wrong or incomplete

Most likely reasons:

* `FDS6574` is not behaving like the simple PMOS pass element assumed here
* the page-5 branch likely needs additional series or return structure that is
  absent from this first slice
* the true source/drain or device-family interpretation may differ from the
  provisional high-side switch model

That means the case is already doing useful work: it tells us the current
page-5/page-4 abstraction is not yet electrically self-consistent.

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

That side-by-side comparison is the fastest next move because the present run
already shows the control node responding while the output branch remains stuck
off.
