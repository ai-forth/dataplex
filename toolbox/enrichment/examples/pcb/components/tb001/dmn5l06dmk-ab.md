---
id: tb001.component.dmn5l06dmk-ab
type: component
title: DMN5L06DMK-AB component record
project: TB001
status: draft
tags:
  - component
  - transistor
  - switching
sources:
  - ../TB001/evidence/schematics/tb001/pages/page-04-serial-power-control.md
  - ../TB001/evidence/schematics/tb001/pages/page-05-power-outputs.md
  - ../TB001/migration/validation/page4-scaffold-manifest.md
  - ../TB001/migration/validation/page5-scaffold-manifest.md
relationships:
  documents:
    - tb001.use.q2.page4.dmn5l06dmk-ab
    - tb001.use.page5.dmn5l06dmk-ab-bank
    - tb001.simmodel.generic-dmn5l06dmk-gate-pull
---

## Summary

`DMN5L06DMK-AB` is the lower-risk transistor family currently visible in both
the page-4 and page-5 boundary artifacts. It is important because the current
simulation work already depends on it as the control-side gate-pull device.

## Known From Current Board Evidence

* The part is identified as `DMN5L06DMK-AB`.
* The package currently associated with it is `SOT-26`.
* It appears as `Q2` on page 4.
* It appears as `Q3`, `Q4`, `Q6`, and `Q9` on page 5.
* Current corpus interpretation treats this family as the lower-risk switching
  group that is easier to place and model provisionally than the `FDS6574`
  family.

## Manufacturer Characteristic Status

Known:

* MPN string: `DMN5L06DMK-AB`
* package evidence in the current TB001 corpus: `SOT-26`
* manufacturer product-page polarity: dual N-channel (`N+N`)
* manufacturer product-page `|VDS|`: `50 V`
* manufacturer product-page `|VGS|`: `±20 V`
* manufacturer product-page `|VGS(th)| max`: `1 V`
* manufacturer product-page `Ciss typ`: `50 pF`
* manufacturer product-page `Rds(on) max`:
  * `3000 mΩ` at `VGS = 1.8 V`
  * `2500 mΩ` at `VGS = 2.5 V`
  * `2000 mΩ` at `VGS = 4.5/5 V`

Still required from manufacturer sources:

* pinout and gate/source/drain mapping
* fuller current and thermal limits from the datasheet
* fuller switching behavior from the datasheet
* local capture of the vendor SPICE asset

## Manufacturer Source Intake

Current source status is better than for `FDS6574`, but still incomplete.

Grounded today:

* TB001 migration validation notes record a manufacturer product-page check for
  `DMN5L06DMK`.
* That check confirms the `SOT26` package class on the Diodes Incorporated
  product page:
  `https://www.diodes.com/part/view/DMN5L06DMK`
* The current product page also exposes:
  * device class: dual N-channel enhancement MOSFET
  * polarity: `N+N`
  * `|VDS|`: `50 V`
  * `|VGS|`: `±20 V`
  * `|VGS(th)| max`: `1 V`
  * `Ciss typ`: `50 pF`
  * `Rds(on)` maxima at `1.8 V`, `2.5 V`, and `4.5/5 V`
  * a vendor SPICE model link

Still not normalized into this catalog:

* verified pin mapping
* datasheet current and thermal limits
* local vendor model file capture

## First-Pass Electrical Characteristics

From the current Diodes product page:

* device class: dual N-channel enhancement MOSFET
* package class: `SOT26`
* polarity: `N+N`
* `|VDS|`: `50 V`
* `|VGS|`: `±20 V`
* `|VGS(th)| max`: `1 V`
* `Ciss typ`: `50 pF` at `|VDS| = 25 V`
* `Rds(on) max`:
  * `3.0 Ω` at `VGS = 1.8 V`
  * `2.5 Ω` at `VGS = 2.5 V`
  * `2.0 Ω` at `VGS = 4.5/5 V`

These characteristics already explain why the current `GENERIC_NMOS` model
should be treated as a comparison abstraction rather than a manufacturer-faithful
representation.

## Simulation Relevance

The current TB001 page-5 cases already depend on this part behaving as an NMOS
gate-pull device under page-4-style control.

That makes it one of the first component records that should be promoted from
package-level evidence into manufacturer-grounded electrical characterization.
