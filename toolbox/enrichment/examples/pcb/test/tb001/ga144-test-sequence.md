---
id: tb001.test.ga144-test-sequence
type: test
title: TB001 GA144 candidate operating sequence
project: TB001
revision: 106d
status: draft
tags:
  - test
  - ga144
  - sequence
  - reset
  - boot
  - simulation
sources:
  - ./ga144-test-hypothesis.md
  - ../TB001/evidence/schematics/tb001/pages/page-01-power-control.md
  - ../TB001/evidence/schematics/tb001/pages/page-04-serial-power-control.md
  - ../TB001/evidence/schematics/tb001/pages/page-05-power-outputs.md
  - ../TB001/datasheets/GA144A12-Datasheet-Rev-A12-PC-2026-03.pdf
relationships:
  derived_from:
    - tb001.test.ga144-test-hypothesis
  relates_to:
    - tb001.case.tb001-ga144-test-bringup
    - tb001.interface.db9-control-signal-map
---

# TB001 GA144 Candidate Operating Sequence

## Purpose

This artifact converts the broader TB001 test hypothesis into one explicit
candidate operating sequence.

The intent is not to claim this is the exact factory script.

The intent is to provide one disciplined sequence that:

* matches the current evidence
* can be checked against the local `GA144` datasheet
* can drive the next simulation pass

## Sequence Summary

The strongest current sequence is:

1. Apply board power and establish the common `V1P8` source.
2. Allow the page-1 master side to reach a stable operating state.
3. Hold the UUT in reset or in an effectively non-running state.
4. Assert the desired boot-mode controls.
5. Enable the UUT-facing `V1P8` branches.
6. Wait long enough for the UUT rails to settle into the `GA144` operating
   window.
7. Release reset.
8. Begin the first controlled test transaction.

## Candidate Step Details

### Step 1: Board power applied

Expected condition:

* the common `V1P8` distribution begins rising

Reasoning:

* both the master side and the UUT side appear to derive from the same broad
  `1.8 V` source family

Simulation implication:

* this is the start of the transient run

### Step 2: Master side becomes valid first

Expected condition:

* page-1 `U2`, SRAM, and SPI flash reach a stable supply before full UUT test
  execution begins

Reasoning:

* TB001 only makes sense as a reusable fixture if the board-side controller is
  alive before the UUT is asked to do useful work

Simulation implication:

* `VMASTER`, `VU2`, `VU1`, and `VU3` should settle first and should remain
  within the `GA144` recommended window

### Step 3: UUT remains held

Expected condition:

* the UUT does not begin uncontrolled execution during early rail movement

Possible mechanisms:

* explicit `RESET-` assertion
* boot suppression such as a `No Boot` condition
* delayed enable of the UUT rail branches

Reasoning:

* the `GA144` datasheet makes reset and boot mode important enough that early
  uncontrolled execution would be a poor test-fixture pattern

Simulation implication:

* the present `RESET_HOLD` proxy and delayed UUT branch release are acceptable
  first-pass surrogates for this behavior

### Step 4: Boot mode is chosen before release

Expected condition:

* the board or host chooses whether the UUT should attempt SPI boot or remain
  in a non-boot path

Most plausible options:

* `SPI-enabled` path:
  `705.17` effectively low at reset so SPI boot is allowed
* `No-Boot` path:
  `705.17` effectively high at reset so SPI boot is suppressed

Reasoning:

* the local `GA144` datasheet explicitly makes the `705.17` state at reset
  decisive for SPI boot behavior
* TB001 evidence includes `No Boot` and `Flash Reset` style control semantics

Simulation implication:

* the next simulation pass should treat boot mode as a timed control assumption,
  even if the digital protocol is still abstracted away

### Step 5: UUT rails are enabled

Expected condition:

* `V1P8-Core/UUT`, `V1P8-IO/UUT`, and `V1P8-Analog/UUT` are released through
  the page-5 switching structure

Reasoning:

* this is the main point where TB001 behaves like a powered fixture rather than
  just a passive socket

Simulation implication:

* the `DISABLE`-driven gate release in the current case is the main proxy for
  this step

### Step 6: UUT rails settle before reset release

Expected condition:

* each active UUT rail is inside a realistic `GA144` operating window before
  test execution begins

Current acceptance rule:

* nominal target near `1.8 V`
* acceptable first-pass operating window `1.62 V` to `2.0 V`

Reasoning:

* this reflects the local `GA144` recommended `VDD` range

Simulation implication:

* the primary timing question is not exact microseconds yet
* it is whether reset release occurs after the rails are substantially settled

### Step 7: Reset is released

Expected condition:

* the UUT exits reset only after board-side power and boot-selection conditions
  are already valid

Reasoning:

* the `GA144` datasheet says reset must be driven and must cover relevant RC
  settling behavior

Simulation implication:

* the next model refinement should compare the `RESET_HOLD` rise against the
  rise of `VCORE`, `VIO`, and `VAN`

### Step 8: First test transaction begins

Expected condition:

* the board-resident `GA144` master, external host, or both start the first
  meaningful UUT interaction

Possible transaction classes:

* observe boot response
* load a small directed test
* verify reset, I/O, or memory-facing behavior

Simulation implication:

* still outside the current analog-only case
* this is the boundary where later digital or event-sequence modeling begins

## Timing Rules To Carry Into Simulation

The next simulation pass should use these simple rules:

* the master-side branch must become valid before the UUT is considered active
* the UUT rail branches must rise after the board-side control domain is ready
* reset release must lag rail enable enough that the UUT rails are no longer in
  obvious startup motion
* any boot-mode assumption must be established before reset release

## First-Pass Fitness Checks

The current sequence should be considered plausible if:

* `VMASTER`, `VU2`, `VU1`, and `VU3` remain within the `GA144` operating window
* `VCORE`, `VIO`, and `VAN` all rise above `1.62 V`
* the UUT branches rise monotonically after enable
* the effective reset-release proxy rises after the master-side branch is
  established
* nothing suggests an obvious brownout when the UUT branches are enabled

## What Is Still Missing

This artifact still does not tell us:

* which page-4 signal exactly maps to each boot or reset action
* whether the real fixture releases all UUT rails together or in stages
* whether the first test transaction comes from the host, the on-board flash,
  or the page-1 `GA144` master
* what exact measurement determines pass or fail

## Best Next Step

The next high-value move is to update the `tb001-ga144-test-bringup` case so
its documented timing assumptions explicitly match this sequence:

* startup master-side validity
* delayed UUT rail enable
* reset-release threshold after rail settlement
* explicit note for `SPI-enabled` versus `No-Boot` operating modes
