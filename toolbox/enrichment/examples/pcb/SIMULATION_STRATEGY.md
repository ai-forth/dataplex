# PCB Simulation Strategy

This document recommends a local-first simulation stack for the kind of PCB
knowledge workflow we are building.

## Recommendation

Default stack:

* **KiCad + ngspice** for day-to-day local schematic simulation and reproducible
  open workflows
* **Xyce** as the scale-up solver when circuit size, convergence, or parameter
  sweeps outgrow a comfortable `ngspice` workflow

Optional companion:

* **LTspice** when vendor model availability or switched-mode power-supply
  examples make it the faster exploratory tool

## Why This Recommendation

### Best Default: `ngspice`

`ngspice` is the best default for this project because it is:

* open
* scriptable
* local-first
* easy to version-control through plain-text netlists
* already integrated into KiCad workflows

For our tasks, that matters more than GUI polish. We want a simulator we can:

* run headless
* call from scripts or agents
* keep alongside markdown evidence
* reproduce on Debian without licensing friction

It is a strong fit for:

* power-sequencing experiments
* regulator and switch behavior
* reset and timing checks
* simplified analog path validation
* sensitivity and transient studies

### Scale-Up Choice: `Xyce`

`Xyce` is the best second-line solver when the problem gets too large or too
stiff for a comfortable `ngspice` workflow.

Use it when we need:

* larger netlists
* heavier sweeps
* stronger numerical robustness on difficult circuits
* a more simulation-centric environment for large mixed analog systems

For this PCB workflow, `Xyce` is not the starting point. It is the escalation
path once the evidence corpus tells us which subcircuits deserve more serious
simulation.

### Optional Fast Path: `LTspice`

`LTspice` is still very good, especially for:

* switch-mode power designs
* quick analog exploration
* cases where the easiest accurate model already exists in LTspice format

I would not make it the canonical stack for this project because:

* it is not our most reproducible Linux-native path
* it is less natural for agent-driven, repository-first workflows
* we want the default toolchain to stay local and automation-friendly on Debian

But it is a valuable side tool if:

* a vendor only provides a clean LTspice example
* a power block is much faster to prototype there first

## Important Constraint

Pure SPICE is not the whole answer for PCB verification.

For this kind of board work:

* SPICE is strong for power, reset, analog, and switching behavior
* SPICE is weaker for full-board signal integrity unless we also have good
  transmission-line assumptions, IBIS models, or extracted parasitics

So the simulation strategy should be layered:

1. SPICE for domain behavior and local circuits
2. targeted interconnect approximations for critical nets
3. later SI/PI escalation only where the corpus says it matters

## What To Simulate First

For boards like TB001, start with:

### 1. Power Sequencing

Questions:

* do named domains rise in a safe order?
* do reset and boot-related states behave sensibly during startup?
* are there obvious race or collapse conditions?

### 2. Switching Paths

Questions:

* what do the MOSFET groups likely switch?
* do provisional control assumptions produce sensible rail behavior?
* which unresolved transistor families are most important to model accurately?

### 3. Reset / Control Boundary

Questions:

* what happens at the page-4 control boundary during startup and fault states?
* how sensitive are control paths to missing or incorrect pull networks?

### 4. Simplified Bus Checks

Not full SI yet. Start with:

* approximate load assumptions
* reset timing
* edge-shape sensitivity where the corpus identifies critical paths

## Corpus-To-Simulation Workflow

Use the evidence corpus to drive simulation in a repeatable way:

1. Pick one diagnosis-oriented artifact.
2. Extract the smallest plausible subcircuit from the evidence.
3. Write down:
   * what is known
   * what is assumed
   * what is missing
4. Build a minimal SPICE deck.
5. Store the deck and findings next to the markdown evidence.
6. Promote the artifact to simulation-ready once the assumptions are explicit.

## Decision Rule

Choose tools like this:

* use `ngspice` when the goal is local, text-first, reproducible simulation
* use KiCad as the easiest front-end when the subcircuit is easiest to draft as
  a schematic
* use `Xyce` when netlist size or convergence becomes the bottleneck
* use `LTspice` only when it gives a clear model-availability advantage

## Practical Next Step

For TB001 specifically, the first simulation-ready target should be the
page-5/page-4 power and control boundary, not the whole board.

That means the next simulation milestone is:

* derive a minimal page-5 switching subcircuit
* make the assumptions around `DMN5L06DMK-AB`, `FDS6574`, `V1P8-*`, `VddLo/UUT`,
  and `MaxV+` explicit
* run a first transient simulation in `ngspice`

## External References

Primary documentation used for this recommendation:

* ngspice manual:
  https://ngspice.sourceforge.io/docs/ngspice-manual.pdf
* Xyce documentation portal:
  https://xyce.sandia.gov/documentation-tutorials/
* LTspice official page:
  https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html
