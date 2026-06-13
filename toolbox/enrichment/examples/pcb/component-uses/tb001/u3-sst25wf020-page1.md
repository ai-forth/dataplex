---
id: tb001.use.u3.page1.sst25wf020
type: component-use
title: TB001 page 1 U3 use of SST25WF020
project: TB001
revision: 106d
status: draft
tags:
  - component-use
  - page1
  - memory
sources:
  - ../TB001/evidence/schematics/tb001/pages/page-01-power-control.md
  - ../TB001/migration/validation/schematic-redraw-workbook.md
relationships:
  part_of:
    - tb001.page.01
  relates_to:
    - tb001.component.sst25wf020
---

## Summary

`U3` is the page-1 SPI flash use of the `SST25WF020` family.

## Current Use Interpretation

Known:

* reference designator: `U3`
* page context: TB001 page 1
* function: SPI flash
* package evidence: `SOP-8`

Likely role:

* non-volatile storage for boot, program, or configuration behavior in the
  GA144 control region
* participant in the local serial control path rather than the switched power
  boundary

## Pin And Signal Clues

The current workbook already records the expected signal names for `U3`:

* `CE`
* `SO`
* `WP`
* `VSS`
* `VDD`
* `RST`
* `SCK`
* `SI`

## What Still Needs Verification

* exact pin-to-net mapping on the final redraw
* how `RST#/HOLD#` is used on TB001
* whether write-protect behavior is hard-wired or actively controlled
