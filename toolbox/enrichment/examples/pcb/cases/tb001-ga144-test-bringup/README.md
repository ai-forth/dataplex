# TB001 GA144 Test Bring-Up

## Purpose

This case reframes TB001 as a GA144 test fixture rather than only a generic
power-boundary puzzle.

The smallest useful engineering question is:

Can the board plausibly bring a socketed GA144 UUT into a stable powered state
 for test while keeping the page-1 test-master side on the common `V1P8`
distribution stable enough to operate SRAM, SPI flash, and control logic?

This case does **not** attempt to simulate full GA144 digital behavior.
Instead, it simulates the analog prerequisite for test use:

* a common `V1P8` source rail
* a permanently loaded test-master branch
* three switched UUT-facing `V1P8-*` branches
* page-4/page-5-style control release that enables those UUT branches

## Evidence Basis

Primary evidence used:

* `../TB001/evidence/board/tb001/board-overview.md`
* `../TB001/evidence/schematics/tb001/pages/page-01-power-control.md`
* `../TB001/evidence/schematics/tb001/pages/page-02-schematic.md`
* `../TB001/evidence/schematics/tb001/pages/page-05-power-outputs.md`
* `../TB001/evidence/schematics/tb001/power/rail-v1p8-domains.md`
* `../TB001/evidence/schematics/tb001/power/v1p8-source-load-map.md`

These sources support the following working picture:

* `U2` is the GA144 test master on page 1
* `U4` is the socketed or fixture-mounted GA144 UUT region on page 2
* page 1 also hosts SRAM and SPI flash needed for local control or test context
* page 5 appears to switch or distribute the UUT-specific `V1P8-Core/UUT`,
  `V1P8-IO/UUT`, and `V1P8-Analog/UUT` branches

## Current Abstraction

This case intentionally abstracts the board into four electrical loads:

* one always-on master-side `V1P8` branch
* one switched `V1P8-Core/UUT` branch
* one switched `V1P8-IO/UUT` branch
* one switched `V1P8-Analog/UUT` branch

Control assumptions:

* the page-4/page-5 transistor cluster is abstracted as a control release
  signal plus branch gating behavior
* `DMN5L06DMK-AB` behavior is represented as the small clamp device that holds
  branch gates low before enable release
* `FDS6574A` behavior is represented as the stronger branch-pass element
* branch gates are released after startup so the UUT domains can rise

## Expected Good Behavior

For TB001 to behave like a useful GA144 test board, the following should be
true in this abstraction:

* the always-on master-side branch stays near `1.8 V`
* all three UUT branches rise monotonically after enable release
* the UUT branches settle close to the source rail rather than stalling far
  below it
* enabling the UUT branches does not drag the master-side branch so far down
  that the page-1 controller, SRAM, or flash would obviously brown out

## Current Run Result

The current local `ngspice` run is encouraging for the intended test-fixture
story.

By the end of the transient:

* `VIN_MAIN` settles at about `1.794 V`
* the always-on master-side branch `VMASTER` settles at about `1.793 V`
* `V1P8-Core/UUT` settles at about `1.770 V`
* `V1P8-IO/UUT` settles at about `1.784 V`
* `V1P8-Analog/UUT` settles at about `1.787 V`
* all branch gates rise to about `3.3 V` after the startup clamp is released

Current interpretation:

* the board can be plausibly understood as keeping the page-1 test-master side
  alive while enabling the UUT-side branches afterward
* the heaviest UUT branch in this abstraction is the core rail, and it is the
  first place where marginal headroom shows up
* nothing in this run suggests an obvious catastrophic brownout of the
  test-master side during UUT bring-up

This does **not** prove the real board is correct, but it is a useful first
simulation milestone because it supports the idea that TB001 is structured to
power a UUT GA144 in a controlled way for test.

## Known Limitations

* This case does not model actual GA144 logic execution.
* It does not yet prove the exact `FDS6574A` page-5 wiring.
* It does not include connector or cable effects.
* It uses datasheet-informed MOS abstractions, not vendor transistor models.
* It treats the UUT domains as lumped resistive and capacitive loads.

## Workflow

```bash
cd toolbox/enrichment
./dist/pcb-sim pipeline --case-dir examples/pcb/cases/tb001-ga144-test-bringup
```

## Next Iteration Targets

* tighten `FDS6574A` and `DMN5L06DMK-AB` model parameters from the local
  datasheets
* split the master-side branch into explicit GA144, SRAM, and SPI flash loads
* add a reset-hold abstraction so domain settle time can be compared against
  test-start timing
