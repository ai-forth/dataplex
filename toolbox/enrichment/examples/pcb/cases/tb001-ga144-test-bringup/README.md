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
* a permanently loaded test-master side split into GA144, SRAM, and SPI flash
  sub-loads
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

## Accuracy Window

For this pass, the model does not need exact production-grade fidelity.

The working goal is to stay within a roughly `10%` engineering-accuracy window
while preserving the real operating constraints that matter for using TB001 as a
GA144 tester.

That means:

* use datasheet min/max limits to define the safe operating window
* use coarse but justified device abstractions inside that window
* treat the simulation as good enough if it correctly predicts whether the board
  keeps the test-master and UUT in a plausible powered state for test

## Tolerance-Driven Pass Rule

The most important reference window now comes from the local GA144 datasheet:

* recommended `VDD` operating range: `1.62 V` to `2.0 V`
* absolute maximum `VDD`: `2.3 V`
* `RESET-` must be held long enough to cover at least three RC time constants
  of the largest relevant reset-sensitive load

For this case, a coarse simulation result is considered useful if:

* the page-1 master-side rails remain safely above `1.62 V`
* the UUT rails also settle above `1.62 V`
* the UUT rails do not overshoot beyond the recommended operating range in a
  way that would challenge normal test use
* the reset-hold proxy rises after the master-side rail is established rather
  than before it

## Device Windows Used

The switch-side model is intentionally bounded by datasheet-scale behavior
rather than exact extracted silicon models:

* `FDS6574A`:
  * `RDS(on)` is published at `6 mΩ`, `7 mΩ`, and `9 mΩ` depending on gate
    drive
  * in this case it is modeled only coarsely as a strong N-channel pass device
    because the board-level question is branch fitness, not transistor
    characterization
* `DMN5L06DMK-AB`:
  * `Rds(on)` is published at about `2.0 Ω` to `3.0 Ω` across the relevant gate
    drive points
  * in this case it is modeled as a weaker clamp device whose job is to hold
    branch gates down until release

The intent is to be faithful to role and operating window first, and only then
to pursue tighter device fitting if the coarse result is marginal.

## Current Abstraction

This case intentionally abstracts the board into four electrical load groups:

* one always-on master-side `V1P8` branch
  This is further split into:
  * `VU2` for the page-1 GA144 test master
  * `VU1` for the SRAM branch
  * `VU3` for the SPI flash branch
* one switched `V1P8-Core/UUT` branch
* one switched `V1P8-IO/UUT` branch
* one switched `V1P8-Analog/UUT` branch
* one master-side RC `RESET_HOLD` proxy derived from the always-on branch

Control assumptions:

* the page-4/page-5 transistor cluster is abstracted as a control release
  signal plus branch gating behavior
* `DMN5L06DMK-AB` behavior is represented as the small clamp device that holds
  branch gates low before enable release
* `FDS6574A` behavior is represented as the stronger branch-pass element
* branch gates are released after startup so the UUT domains can rise
* a simple RC node `RESET_HOLD` stands in for the idea that test traffic should
  only begin after the master side has had time to settle

## Expected Good Behavior

For TB001 to behave like a useful GA144 test board, the following should be
true in this abstraction:

* the always-on master-side branch stays near `1.8 V`
* the `VU2`, `VU1`, and `VU3` sub-branches remain close enough to the master
  rail that the page-1 side would plausibly stay operational
* all three UUT branches rise monotonically after enable release
* the UUT branches settle close to the source rail rather than stalling far
  below it
* enabling the UUT branches does not drag the master-side branch so far down
  that the page-1 controller, SRAM, or flash would obviously brown out
* the reset-hold proxy should rise after the master branch is healthy rather
  than racing ahead of the supply
* all active rails that matter for GA144 test use remain inside a realistic
  operating window centered on `1.8 V` and bounded by the datasheet

## Current Run Result

The current local `ngspice` run is encouraging for the intended test-fixture
story.

By the end of the transient:

* `VIN_MAIN` settles at about `1.795 V`
* the always-on master-side branch `VMASTER` settles at about `1.794 V`
* the page-1 sub-branches settle at:
  * `VU2` about `1.793 V`
  * `VU1` about `1.794 V`
  * `VU3` about `1.794 V`
* the RC reset proxy `RESET_HOLD` rises to about `1.52 V`
* `V1P8-Core/UUT` settles at about `1.771 V`
* `V1P8-IO/UUT` settles at about `1.785 V`
* `V1P8-Analog/UUT` settles at about `1.787 V`
* all branch gates rise to about `3.3 V` after the startup clamp is released

Current interpretation:

* the board can be plausibly understood as keeping the page-1 test-master side
  alive while enabling the UUT-side branches afterward
* splitting the page-1 side into `U2`, SRAM, and SPI flash sub-loads does not
  reveal a new obvious weak branch; the three master-side loads stay tightly
  grouped near the common master rail
* the reset proxy rises after the master branch is established, which is
  directionally consistent with a board that should defer test traffic until
  bring-up settles
* the heaviest UUT branch in this abstraction is the core rail, and it is the
  first place where marginal headroom shows up
* nothing in this run suggests an obvious catastrophic brownout of the
  test-master side during UUT bring-up
* all currently modeled rails remain comfortably above the GA144 recommended
  minimum operating voltage of `1.62 V`

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
* tune the reset-hold abstraction so domain settle time can be compared against
  a more realistic test-start threshold
* tighten the relative branch loads once better evidence exists for page-1
  power burden
