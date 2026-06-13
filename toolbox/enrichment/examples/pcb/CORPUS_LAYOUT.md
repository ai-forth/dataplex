# PCB Corpus Layout

This layout is the recommended shape for `PCB_EVIDENCE_DIR`.

```text
evidence/
  board/
    tb001/
      board-overview.md
      revisions/
      risks/
  components/
    tb001/
      fds6574.md
      dmn5l06dmk-ab.md
      max3218eap.md
  component-uses/
    tb001/
      q1-fds6574-page4.md
      q1-q5-q7-q8-q10-q11-fds6574-page5.md
      q2-dmn5l06dmk-ab-page4.md
      q3-q4-q6-q9-dmn5l06dmk-ab-page5.md
  schematics/
    tb001/
      pages/
      subsystems/
      power/
      interfaces/
  bom/
    tb001/
      bom-overview.md
      critical-parts.md
      sourcing-risks.md
  manufacturing/
    tb001/
      fab-notes.md
      assembly-notes.md
      fixtures.md
  test/
    tb001/
      bringup.md
      production-test.md
      acceptance.md
  simulation/
    tb001/
      power-sequencing.md
      signal-integrity.md
      thermal.md
      models/
  revisions/
    tb001/
      rev-106d.md
      review-log.md
      open-questions.md
```

## File Naming

Use predictable lowercase names with hyphens:

* `board-overview.md`
* `page-01-power-control.md`
* `subsystem-sram-interface.md`
* `rail-1v2-core.md`
* `interface-j1-host-link.md`
* `risk-missing-esd-on-j2.md`

## Frontmatter Template

Use this template for all engineering notes:

```yaml
---
id: tb001.page.01.power-control
type: schematic-page
title: Page 01 power control
project: TB001
revision: 106d
tags:
  - power
  - schematic
sources:
  - TB001-Schematic-106d.pdf
relationships:
  part_of:
    - tb001.board.rev106d
  relates_to:
    - tb001.subsystem.power-control
---
```

## What Goes Where

### `board/`

Place top-level board summaries here:

* board purpose
* revision identity
* high-level architecture
* release status
* board-level risks

### `schematics/pages/`

One markdown file per schematic page:

* what the page does
* key nets and components
* upstream/downstream links
* review concerns found on that sheet

### `schematics/subsystems/`

Functional cross-page views:

* power-control
* SRAM interface
* clocking
* reset
* test interface

### `schematics/power/`

Power-focused artifacts:

* rails
* sequencing notes
* source/load mapping
* protection and decoupling rationale

### `components/`

Use for manufacturer-part records:

* one file per unique MPN
* package and pinout facts
* datasheet-derived operating characteristics
* vendor model availability
* explicit confidence and source status

### `component-uses/`

Use for board-specific interpretation of those parts:

* reference designator groupings
* page and subsystem context
* likely electrical role in this design
* simulation relevance and current assumptions

### `schematics/interfaces/`

Connector and signal-boundary artifacts:

* connector assumptions
* directionality
* signal families
* protection and termination

### `bom/`

Use for selection rationale and sourcing issues, not only raw part lists.

### `manufacturing/`

Use for anything that can block fabrication, assembly, or test fixture
readiness.

### `test/`

Use for bring-up, validation, and production procedures.

### `simulation/`

Use for simulation intent and outcomes, even if the actual simulator assets live
elsewhere.

Place model-specific notes under `simulation/<board>/models/` when a simulation
abstraction needs to be tracked separately from the manufacturer part record.

### `revisions/`

Use for review logs, ECO summaries, and change history.

## Evidence Quality Rules

Prefer markdown that captures:

* direct excerpts or summarized facts from authoritative source files
* explicit numeric constraints when known
* named components, rails, connectors, and pages
* citations back to the original source PDFs, CAD exports, or notes

Avoid:

* unlabeled scratch notes
* generic “looks fine” conclusions
* undocumented assumptions with no source citation
