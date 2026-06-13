---
id: tb001.interface.db9-control-signal-map
type: interface
title: TB001 page-4 DB9 control signal map
project: TB001
revision: 106d
status: draft
interface_name: J1/J2/U6 DB9 control signal map
tags:
  - interface
  - db9
  - serial
  - control-boundary
sources:
  - ../TB001/migration/baseline/tb001-bom-v106d.csv
  - ../TB001/evidence/schematics/tb001/pages/page-04-serial-power-control.md
  - ../TB001/evidence/schematics/tb001/interfaces/db9-control-boundary.md
  - ../TB001/migration/validation/page4-scaffold-manifest.md
  - ../TB001/migration/validation/schematic-redraw-workbook.md
relationships:
  part_of:
    - tb001.interface.db9-control-boundary
  relates_to:
    - tb001.page.04
    - tb001.component.max3218eap
    - tb001.use.u6.page4.max3218eap
---

## Summary

This artifact captures the strongest current signal-family mapping for the
TB001 page-4 DB9 control boundary around `J1`, `J2`, and `U6`.

It does **not** claim final connector pin numbers. Instead, it records the
signal groups, nearby transceiver evidence, and the current confidence limits so
that later redraw and simulation work starts from a stable interpretation.

## Boundary Elements

Known:

* `J1` and `J2` are BOM-backed `DB9F` connectors.
* `U6` is a BOM-backed `MAX3218EAP` in `SSOP_20`.
* page 4 is the strongest current candidate for the external serial/control
  boundary.

Implication:

* at least part of the page-4 control path is expected to cross an external
  connector boundary and interact with an RS-232-class transceiver.

## Visible Signal Families

The current page-4 evidence consistently exposes this label cluster:

* `PC-IN`
* `PC-OUT`
* `PC-START/END`
* `PC-RESET-`
* `RESET-`
* `IDE-IN`
* `DE-RESET-`
* `IDE-RESET-`
* `IDE-OUT`

## First-Pass Grouping

### PC channel group

Likely signals:

* `PC-IN`
* `PC-OUT`
* `PC-START/END`
* `PC-RESET-`

Current reading:

* this group likely represents one externally visible host or fixture-facing
  control path
* `PC-IN` and `PC-OUT` are the strongest candidates for transceiver-mediated
  serial direction pairs
* `PC-START/END` and `PC-RESET-` likely carry auxiliary control or state
  semantics near that same boundary

### IDE channel group

Likely signals:

* `IDE-IN`
* `IDE-OUT`
* `IDE-RESET-`
* `DE-RESET-`

Current reading:

* this group likely represents a second control or interface channel adjacent
  to the `PC-*` path
* `IDE-IN` and `IDE-OUT` are plausible second-channel serial or logic boundary
  signals
* `IDE-RESET-` and `DE-RESET-` likely carry reset or gating semantics tied to
  that same channel family

### Shared reset context

Likely signal:

* `RESET-`

Current reading:

* `RESET-` is likely a broader board-level reset signal that intersects the
  page-4 boundary rather than belonging exclusively to only one connector lane

## Relationship To `U6`

The `MAX3218EAP` evidence strengthens the following claims:

* at least one subset of the page-4 boundary is likely voltage-translated or
  line-conditioned rather than directly wired as raw logic
* `U6` is the most credible current device for mediating the `IN`/`OUT` signal
  pairs at the DB9 boundary
* because `MAX3218EAP` is a dual-driver / dual-receiver RS-232 transceiver, the
  page likely contains at least two paired communication directions or one
  communication pair plus auxiliary control handling

What it does **not** yet prove:

* which exact named signals land on which `MAX3218EAP` pins
* whether both `J1` and `J2` route through the same transceiver channels
* whether reset-style labels pass through `U6` or bypass it

## Confidence Map

High confidence:

* `J1` and `J2` are the principal page-4 DB9 connector boundary
* `U6` is the principal serial-interface IC at that boundary
* the `PC-*` / `IDE-*` / reset labels belong to the same page-4 control region

Medium confidence:

* `PC-IN` / `PC-OUT` and `IDE-IN` / `IDE-OUT` each behave like directional
  signal pairs
* the boundary likely contains two channel families rather than one monolithic
  connector role

Low confidence:

* exact assignment of signal families to `J1` versus `J2`
* exact connector pin numbering
* whether `PC-START/END` is a true data/control line, mode line, or fixture
  state line

## Safe Use Today

This artifact is safe for:

* control-boundary review
* planning the next redraw and wiring pass
* deciding which signals deserve pin-level extraction next
* guiding later interface-focused simulation or test-fixture reasoning

This artifact is not safe for:

* manufacturing pinout release
* cable-definition release
* exact connector-to-test-script mapping

## Next Verification Step

To promote this from a signal-family map to a true connector map, the next pass
should extract one of:

* actual `J1` / `J2` pin-to-net wiring from the page-4 redraw
* cleaner text or geometry capture from the original schematic source
* a manual page-4 review artifact that records each DB9 pin label explicitly
