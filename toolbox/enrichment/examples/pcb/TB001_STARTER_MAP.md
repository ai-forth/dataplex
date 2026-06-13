# TB001 Starter Map

This file maps the existing `TB001` repository into the recommended PCB
knowledge corpus.

## Source Repositories

Primary source repo:

* `../TB001`

Key source areas already present there:

* `docs/reference/`
* `docs/revisions/`
* `Production Package/`
* `Intermed Schematics/`
* `migration/baseline/`
* `migration/validation/`

## First-Pass Corpus Plan

Create a new evidence root such as:

```text
TB001/evidence/
```

Then populate it as follows.

## Board-Level Files

Create:

* `board/tb001/board-overview.md`
* `board/tb001/risks/current-risks.md`

Suggested sources:

* `README.md`
* `docs/reference/Power Control Overview.pdf`
* `docs/revisions/TB001-Dwgs-Rev-12-Mar.pdf`

## Schematic Pages

Create one markdown file per authoritative page in revision `106d`:

* `schematics/tb001/pages/page-01-*.md`
* `schematics/tb001/pages/page-02-*.md`
* `schematics/tb001/pages/page-03-*.md`
* `schematics/tb001/pages/page-04-*.md`
* `schematics/tb001/pages/page-05-*.md`

Suggested sources:

* `Production Package/TB001-Schematic-106d.pdf`
* `migration/baseline/schematic-106d-pages/*.png`
* `migration/baseline/schematic-106d-svg/*.svg`

Each page file should capture:

* page purpose
* key components
* key nets
* upstream/downstream dependencies
* open ambiguities or redraw risk

## Subsystems

Create subsystem summaries for the most important functional blocks:

* `schematics/tb001/subsystems/power-control.md`
* `schematics/tb001/subsystems/sram-interface.md`
* `schematics/tb001/subsystems/test-harness.md`
* `schematics/tb001/subsystems/clock-reset.md`

Suggested sources:

* page-level markdown derived above
* `docs/reference/Power bus control & test.pdf`
* `docs/reference/Power bus control & test rev 12 Mar.pdf`
* `assets/images/GA144-TB001-Pwr-Ctl.png`

## BOM

Create:

* `bom/tb001/bom-overview.md`
* `bom/tb001/critical-parts.md`
* `components/tb001/fds6574.md`
* `components/tb001/dmn5l06dmk-ab.md`
* `components/tb001/max3218eap.md`
* `component-uses/tb001/q1-fds6574-page4.md`
* `component-uses/tb001/q1-q5-q7-q8-q10-q11-fds6574-page5.md`
* `component-uses/tb001/q2-dmn5l06dmk-ab-page4.md`
* `component-uses/tb001/q3-q4-q6-q9-dmn5l06dmk-ab-page5.md`

Suggested sources:

* `migration/baseline/tb001-bom-v106d.csv`
* `migration/baseline/tb001-bom-v106d-notes.md`
* `migration/baseline/BOM_GA144_prod_test_V106d.pdf`
* page-level markdown derived above

## Manufacturing

Create:

* `manufacturing/tb001/fab-notes.md`
* `manufacturing/tb001/assembly-notes.md`
* `manufacturing/tb001/production-package.md`

Suggested sources:

* `Production Package/*.zip`
* `Production Package/*.gwk`
* `migration/validation/pcb-reconstruction-checklist.md`

## Test

Create:

* `test/tb001/bringup.md`
* `test/tb001/production-test.md`

Suggested sources:

* `TB001 for Exatron/GA144_prod_test_106d.zip`
* `Intermed Schematics/Skip 110314 0109/*.pdf`
* `Intermed Schematics/Skip 110416 1949/*.pdf`

## Simulation

Even if no simulation assets exist yet, create placeholder knowledge docs:

* `simulation/tb001/power-sequencing.md`
* `simulation/tb001/signal-integrity.md`

These should document:

* what should be simulated
* why it matters
* what evidence currently exists
* what is still missing

## Revisions And Migration

Create:

* `revisions/tb001/revision-history.md`
* `revisions/tb001/migration-status.md`
* `revisions/tb001/redraw-risks.md`

Suggested sources:

* `migration/README.md`
* `migration/WORKPLAN.md`
* `migration/MILESTONES.md`
* `migration/validation/*.md`
* `docs/revisions/*`

## Highest-Value First 10 Files

If we want a practical starting slice, create these first:

1. `board/tb001/board-overview.md`
2. `schematics/tb001/pages/page-01-power-control.md`
3. `schematics/tb001/pages/page-02-*.md`
4. `schematics/tb001/subsystems/power-control.md`
5. `components/tb001/fds6574.md`
6. `components/tb001/dmn5l06dmk-ab.md`
7. `component-uses/tb001/q1-q5-q7-q8-q10-q11-fds6574-page5.md`
8. `bom/tb001/bom-overview.md`
9. `manufacturing/tb001/production-package.md`
10. `revisions/tb001/redraw-risks.md`

That set is enough to start asking meaningful questions about design fitness,
manufacturing readiness, and evidence gaps.
