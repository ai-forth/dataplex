# PCB Corpus Layout

This layout is the recommended shape for `PCB_EVIDENCE_DIR`.

```text
evidence/
  board/
    tb001/
      board-overview.md
      revisions/
      risks/
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
