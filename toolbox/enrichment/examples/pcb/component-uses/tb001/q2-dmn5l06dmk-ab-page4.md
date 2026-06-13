---
id: tb001.use.q2.page4.dmn5l06dmk-ab
type: component-use
title: TB001 page 4 Q2 use of DMN5L06DMK-AB
project: TB001
revision: 106d
status: draft
tags:
  - component-use
  - page4
  - control-boundary
sources:
  - ../TB001/evidence/schematics/tb001/pages/page-04-serial-power-control.md
relationships:
  part_of:
    - tb001.page.04
  relates_to:
    - tb001.component.dmn5l06dmk-ab
---

## Summary

`Q2` on page 4 is the page-4 use of the `DMN5L06DMK-AB` family.

## Current Use Interpretation

Known:

* reference designator: `Q2`
* page context: TB001 page 4
* package evidence: `SOT-26`

Likely role:

* control-side switching or gate-pull behavior near the serial/reset boundary

## Simulation Relevance

This part family is already being used as the provisional control-side NMOS in
the page-5 comparison cases, which makes the page-4 use especially important to
normalize.
