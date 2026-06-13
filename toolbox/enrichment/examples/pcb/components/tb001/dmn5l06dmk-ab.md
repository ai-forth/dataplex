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

Still required from manufacturer sources:

* verified polarity and channel arrangement
* pinout and gate/source/drain mapping
* threshold and drive behavior
* on-resistance and current limits
* vendor simulation model availability

## Manufacturer Source Intake

Current source status is better than for `FDS6574`, but still incomplete.

Grounded today:

* TB001 migration validation notes record a manufacturer product-page check for
  `DMN5L06DMK`.
* That check confirms the `SOT26` package class on the Diodes Incorporated
  product page:
  `https://www.diodes.com/part/view/DMN5L06DMK`

Still not normalized into this catalog:

* verified pin mapping
* polarity and channel arrangement from the datasheet
* threshold and on-resistance values from the datasheet
* vendor model artifact location

## Simulation Relevance

The current TB001 page-5 cases already depend on this part behaving as an NMOS
gate-pull device under page-4-style control.

That makes it one of the first component records that should be promoted from
package-level evidence into manufacturer-grounded electrical characterization.
