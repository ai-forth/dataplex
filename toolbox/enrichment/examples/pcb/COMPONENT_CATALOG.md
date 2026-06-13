# Component Characteristic Catalog

This document defines the purpose of the component catalog layer in the PCB
knowledge process.

## Why It Exists

Page-level and subsystem artifacts tell us where a component appears and what it
likely does. That is not enough for trustworthy simulation or design review.

We also need a stable place to store:

* manufacturer part identity
* package and pinout facts
* datasheet-derived electrical characteristics
* vendor model availability
* explicit confidence about what is known versus inferred

Without that layer, simulation assumptions drift and the same unresolved part
gets reinterpreted differently in different notes.

## Three Layers

Use three distinct artifact layers:

### 1. `component`

The manufacturer part record.

Examples:

* `FDS6574`
* `DMN5L06DMK-AB`
* `MAX3218EAP`

This artifact should answer:

* what exact part is this?
* what package and pins does it have?
* what do the manufacturer sources actually say?
* is there a vendor SPICE model?

### 2. `component-use`

The board-specific use of that part.

Examples:

* `Q1` on TB001 page 4
* `Q1/Q5/Q7/Q8/Q10/Q11` on TB001 page 5

This artifact should answer:

* where is the part used on this board?
* what role does it likely play here?
* what is known from the board evidence?
* what is still only inferred?

### 3. `simulation-model`

The exact abstraction used in a simulation case.

This artifact should answer:

* did the simulation use a vendor model, fitted approximation, or placeholder?
* what behavior was preserved?
* what was simplified away?
* what conclusions are safe or unsafe with this model?

## Quality Rule

Never mix these levels casually.

For example:

* "`FDS6574` is a PMOS" belongs in `component` only if supported by a
  manufacturer source.
* "`Q1` likely acts as a high-side pass element on TB001 page 5" belongs in
  `component-use`.
* "`GENERIC_PMOS` with a simplified threshold was used in case X" belongs in
  `simulation-model` or the simulation case itself.

## Minimum Viable Catalog For A New Board

Create entries first for:

* any part directly involved in power generation, gating, or sequencing
* any part that blocks simulation confidence
* any part whose package or pinout ambiguity can invalidate a redraw
* any interface IC that strongly shapes control or protection behavior

For TB001, the first seed set is:

* `FDS6574`
* `DMN5L06DMK-AB`
* `MAX3218EAP`
