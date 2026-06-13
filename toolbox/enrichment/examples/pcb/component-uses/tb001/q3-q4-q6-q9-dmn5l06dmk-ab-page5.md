---
id: tb001.use.page5.dmn5l06dmk-ab-bank
type: component-use
title: TB001 page 5 DMN5L06DMK-AB bank use
project: TB001
revision: 106d
status: draft
tags:
  - component-use
  - page5
  - power-boundary
sources:
  - ../TB001/evidence/schematics/tb001/pages/page-05-power-outputs.md
relationships:
  part_of:
    - tb001.page.05
  relates_to:
    - tb001.component.dmn5l06dmk-ab
---

## Summary

This artifact describes the page-5 use of the `DMN5L06DMK-AB` family across
`Q3`, `Q4`, `Q6`, and `Q9`.

## Current Use Interpretation

Known:

* reference designator group: `Q3`, `Q4`, `Q6`, `Q9`
* page context: TB001 page 5
* package evidence: `SOT-26`

Likely role:

* lower-risk switching or gate-drive support on the page-5 output boundary

## Simulation Relevance

This is the family currently used as the control-side pull-down behavior in the
TB001 page-5 comparison cases. That makes it one of the first board-specific
uses that should be tightened with manufacturer pinout and threshold data.
