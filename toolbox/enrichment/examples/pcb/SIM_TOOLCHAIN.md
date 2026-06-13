# PCB Simulation Toolchain

This repository now includes a local CLI called `pcb-sim` for taking a circuit
proposal through a repeatable simulation loop.

## What It Covers

The toolchain is designed for this workflow:

1. start with an SVG or other diagram slice as evidence
2. extract visible labels and primitives from that SVG
3. refine a structured `circuit.json` proposal
4. render a schematic preview from that structured proposal
5. generate an `ngspice` deck
6. run the simulation in batch mode
7. write a report for the next review iteration

This is intentionally not a full PCB CAD replacement. It is a lightweight,
local-first bridge between engineering evidence and reproducible simulation.

## CLI

After building `toolbox/enrichment`:

```bash
cd toolbox/enrichment
npm run build:simtool
```

Install the simulator separately on Debian-based systems:

```bash
sudo apt install ngspice
```

Commands:

```bash
pcb-sim init --case-dir /path/to/case --title "page5-power-boundary"
pcb-sim extract-svg --svg input/source.svg --out artifacts/svg-summary.json
pcb-sim render --spec circuit.json --out artifacts/schematic.svg
pcb-sim build-deck --spec circuit.json --out artifacts/circuit.cir --data-file ../outputs/sim.dat
pcb-sim run --deck artifacts/circuit.cir --out-log outputs/run.log
pcb-sim report --case-dir . --out outputs/REPORT.md
pcb-sim pipeline --case-dir .
```

## Case Layout

Recommended case structure:

```text
case/
  README.md
  circuit.json
  input/
    source.svg
  artifacts/
    svg-summary.json
    schematic.svg
    circuit.cir
  outputs/
    run.log
    sim.dat
    REPORT.md
```

## Important Constraint

`extract-svg` is a bootstrap helper, not a full schematic recognizer.

It helps us pull:

* visible text labels
* basic SVG primitive counts
* a starting point for manual or agent refinement

The canonical source for simulation is still `circuit.json`.

## Why This Is Still Useful

That constraint is acceptable for our workflow because the real value is in the
iterative loop:

* evidence becomes a structured proposal
* the proposal becomes a rendered review artifact
* the proposal becomes a SPICE deck
* the simulation output feeds the next corpus update

That gives us a repeatable path from ambiguous source material toward a more
trustworthy engineering model.

## Current Verification Status

The `pcb-sim` binary was smoke-tested in this repository and successfully:

* scaffolded a case
* rendered a schematic preview SVG
* generated an `ngspice` deck
* wrote a report when the simulator was unavailable

On the current machine, `ngspice` is not yet installed, so a full transient run
still depends on that package being added.
