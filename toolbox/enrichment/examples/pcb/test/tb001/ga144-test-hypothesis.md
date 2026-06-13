---
id: tb001.test.ga144-test-hypothesis
type: test
title: TB001 GA144 test-flow hypothesis
project: TB001
revision: 106d
status: draft
tags:
  - test
  - ga144
  - bringup
  - hypothesis
  - simulation
sources:
  - ../TB001/evidence/board/tb001/board-overview.md
  - ../TB001/evidence/schematics/tb001/pages/page-01-power-control.md
  - ../TB001/evidence/schematics/tb001/pages/page-02-schematic.md
  - ../TB001/evidence/schematics/tb001/pages/page-04-serial-power-control.md
  - ../TB001/evidence/schematics/tb001/pages/page-05-power-outputs.md
  - ../TB001/evidence/schematics/tb001/power/rail-v1p8-domains.md
  - ../TB001/datasheets/GA144A12-Datasheet-Rev-A12-PC-2026-03.pdf
relationships:
  relates_to:
    - tb001.interface.db9-control-signal-map
    - tb001.case.tb001-ga144-test-bringup
    - tb001.component.sst25wf020
    - tb001.component.cy62167ev18ll-55bvxi
    - tb001.component.288-4205-01
---

# TB001 GA144 Test-Flow Hypothesis

## Purpose

This artifact records the strongest current hypothesis for what kind of test
TB001 runs and how the board is likely operated.

It is intentionally narrower than a final test procedure.

The goal is to provide a stable, evidence-backed working model that can drive:

* bring-up simulation
* reset and boot sequencing checks
* later fixture and software reconstruction work

## Bottom-Line Reading

The current evidence supports this broad interpretation:

* `TB001` is a `GA144` production or fixture test board
* `U2` is the on-board `GA144` test master
* `U4` is the socketed `GA144` unit under test
* page 1 provides local control support through SRAM and SPI flash
* page 4 provides an external host or fixture control boundary
* page 5 distributes or switches the UUT-facing `1.8 V` domains

This is enough to infer the class of test and its likely control flow.

It is **not** yet enough to claim the exact production script, exact pass/fail
criteria, or exact operator interaction sequence.

## Strong Evidence

The following claims are well supported by the current corpus:

* page 1 contains `U2`, the board-resident `GA144` control region
* page 2 centers on the `U4` socketed UUT region
* the BOM-backed `288-4205-01` entry is a test socket rather than an active IC
* page 4 exposes host or fixture-facing control signals such as `PC-IN`,
  `PC-OUT`, `PC-RESET-`, `PC-START/END`, `IDE-IN`, `IDE-OUT`, `IDE-RESET-`,
  and `DE-RESET-`
* page 4 includes the `MAX3218EAP`, which strongly suggests an RS-232-class
  external control boundary
* page 5 carries UUT power-domain labels such as `V1P8-Core/UUT`,
  `V1P8-IO/UUT`, and `V1P8-Analog/UUT`
* the local `GA144` datasheet describes reset-sensitive boot behavior and SPI
  boot conditions that match the kind of control structure visible on TB001

## GA144 Constraints That Matter

The `GA144` datasheet contributes the most important behavioral constraints:

* recommended `VDD` operating range is `1.62 V` to `2.0 V`
* `RESET-` must be driven by a valid source and held long enough for relevant
  RC loads
* if `705.17` is low at reset, the device attempts boot from SPI flash
* if `705.17` is high at reset, SPI boot is aborted and the device returns to a
  warm state
* asynchronous and synchronous boot modes also exist

These details make it very likely that TB001 uses deliberate reset and boot-mode
control rather than simply applying power and observing a passive response.

## Likely Test Intent

The best current engineering reading is that TB001 is meant to verify that a
`GA144` device can be powered, reset, boot-controlled, and exercised through a
known board-side controller.

The likely test intent includes some combination of:

* confirming the UUT powers correctly on all required `1.8 V` domains
* holding the UUT in reset while rails and support logic stabilize
* selecting or suppressing a boot path
* loading or coordinating test behavior from the board-resident `GA144`
* observing response through the external control boundary

## Most Likely Test Flow

This is the strongest current end-to-end hypothesis:

1. `TB001` receives board power and establishes the common `V1P8` source.
2. The page-1 side powers first and keeps `U2`, SRAM, and SPI flash alive.
3. The UUT remains held or effectively gated while board-side control settles.
4. External host or fixture control arrives through the page-4 DB9 boundary.
5. Reset and boot-selection lines are asserted into a known starting state.
6. The page-5 switched branches enable the UUT power domains.
7. The UUT is either:
   * allowed to boot from the local SPI path, or
   * deliberately prevented from SPI boot so another controlled path can be used.
8. The board-resident `GA144` test master coordinates or observes the UUT.
9. The external host or fixture collects outcome information and advances the
   sequence.

## Two Plausible Operating Modes

### Mode A: SPI-assisted autonomous bring-up

In this mode:

* the on-board flash contains boot or support data
* `U2` or the UUT uses the SPI path during or immediately after reset release
* the fixture mainly handles reset, start, and result capture

This mode is plausible because:

* page 1 includes SPI flash adjacent to the master-side `GA144`
* the `GA144` datasheet gives explicit SPI boot behavior
* TB001 includes visible control signals for boot-related sequencing

### Mode B: Host-driven or master-driven controlled test

In this mode:

* the UUT may be held out of normal boot
* the page-1 `GA144` master and external host coordinate a directed test
* boot suppression may exist specifically to keep the UUT in a known harnessed
  state

This mode is plausible because:

* TB001 exposes `No Boot` and `Flash Reset` style controls in the recovered
  evidence
* the page-4 control boundary appears richer than a simple passive serial port

## What We Know Versus What We Infer

Known with relatively high confidence:

* the board roles of `U2`, `U4`, page 4, and page 5
* the existence of controlled UUT power domains
* the existence of reset and host/fixture control semantics
* the relevance of SPI boot and boot suppression to the test story

Inferred with medium confidence:

* the page-1 side powers before full UUT enable
* the test-master `GA144` participates directly in coordinating UUT behavior
* the board intentionally sequences reset, boot mode, and UUT rail enable

Still unknown:

* the exact production-test vectors or software payload
* whether SRAM is essential to the test or only a support convenience
* the exact meaning of `PC-START/END`
* the exact mapping of page-4 signals to operator actions or host software
* the exact pass/fail observables for the UUT

## What This Means For Simulation

The current hypothesis is strong enough to justify the simulation path already
started in the `tb001-ga144-test-bringup` case.

That simulation should be interpreted as testing the analog prerequisite for the
hypothesized flow:

* does the page-1 master side stay alive first
* do the UUT rails rise into the `GA144` operating window
* does reset release happen after the board has plausibly settled

It should **not** yet be interpreted as proof of:

* exact digital protocol behavior
* exact boot software behavior
* exact manufacturing-test coverage

## Confidence Statement

Current confidence is sufficient for a first-pass engineering model.

In practical terms:

* we likely understand the board role correctly
* we likely understand the broad order of operations correctly
* we do not yet understand the exact test implementation details

That is enough to support the current goal of roughly `10%` model fidelity for
power-up and sequencing fitness.

## Best Next Verification Step

The highest-value next step is to turn this hypothesis into a tighter
board-operation artifact that records one explicit candidate sequence:

* power applied
* master-side rail valid
* reset asserted
* boot mode chosen
* UUT rails enabled
* reset released
* test transaction begins

Once that is written, the simulation can be extended from static rail fitness
into timing-window checks against reset and boot assumptions.
