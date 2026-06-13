---
id: tb001.component.cy62167ev18ll-55bvxi
type: component
title: CY62167EV18LL-55BVXI component record
project: TB001
status: draft
tags:
  - component
  - memory
  - sram
sources:
  - ../TB001/migration/baseline/tb001-bom-v106d.csv
  - ../TB001/evidence/schematics/tb001/pages/page-01-power-control.md
  - ../TB001/datasheets/CY62167EV18.pdf
relationships:
  documents:
    - tb001.use.u1.page1.cy62167ev18ll-55bvxi
---

## Summary

`CY62167EV18LL-55BVXI` is the BOM-backed SRAM identity for `U1` on TB001 page
1. It is one of the most valuable non-power component records to normalize
because it anchors the memory side of the GA144 control/test region and puts a
hard constraint on voltage-domain and timing assumptions.

## Known From Current Board Evidence

* The part is identified in the BOM as `CY62167EV18LL-55BVXI`.
* It appears as `U1` on page 1.
* The current TB001 notes describe it as SRAM on the control, memory, and flash
  page.
* The current scaffold associates it with `FBGA_48/6x8`.

## Manufacturer Characteristic Status

Known:

* MPN string: `CY62167EV18LL-55BVXI`
* manufacturer family: Cypress `CY62167EV18 MoBL`
* device class: static RAM
* organization: `1 M x 16` (`16 Mbit`)
* speed grade: `55 ns`
* operating voltage range for this family mode: `1.65 V to 2.25 V`
* typical standby current: `1.5 uA`
* maximum standby current: `12 uA`
* typical active current: `2.2 mA` at `1 MHz`
* package family: `48-ball VFBGA`
* byte-control signals: `BHE` and `BLE`
* chip-enable signals: `CE1` and `CE2`

Still required from manufacturer sources:

* normalized pin map for the exact package variant used on TB001
* explicit capture of key timing numbers beyond the `55 ns` grade
* any board-specific review notes about signal integrity or decoupling around
  the SRAM interface

## Manufacturer Source Intake

The local primary-source datasheet at `../TB001/datasheets/CY62167EV18.pdf`
confirms that the family is a low-voltage `16-Mbit` SRAM offered in `48-ball`
VFBGA packages.

That matters for TB001 because page 1 already exposes:

* a shared `Data_Bus`
* a GA144 test-master adjacency
* multiple `V1P8` domain labels

So this part is not just an identity check. It helps constrain the board's real
memory-voltage and timing envelope.

## Simulation Relevance

This component is not the first SPICE target, but it is a high-value catalog
anchor for later digital-interface, timing-budget, and rail-partition review.

## Next Catalog Step

Capture the exact VFBGA pin mapping used for `U1` and add an interface-facing
artifact that records how the SRAM control and data lines couple to the GA144
region on page 1.
