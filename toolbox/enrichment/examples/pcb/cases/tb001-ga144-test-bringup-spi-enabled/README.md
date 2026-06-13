# TB001 GA144 Test Bring-Up SPI Enabled

## Purpose

This case is the `SPI-enabled` comparison partner to the baseline TB001
bring-up case.

The smallest useful engineering question is:

If we keep the same power-up and reset timing but flip the `705.17` boot-choice
proxy low, does the analog picture remain equally plausible for a
SPI-boot-allowed startup assumption?

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

This case is aligned to the same candidate operating sequence recorded in
`test/tb001/ga144-test-sequence.md`, but changes only the boot-choice proxy.

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

## Candidate Sequence Mapping

The current case should be read as a timing-window version of the candidate
TB001 test flow:

1. the common `V1P8` source begins rising at transient start
2. the page-1 side reaches validity first through `VMASTER`, `VU2`, `VU1`, and
   `VU3`
3. the UUT is treated as held or effectively non-running during early startup
4. boot-mode choice is abstracted rather than digitally modeled
5. `BOOTMODE` holds the current test assumption for the `705.17` reset-time
   boot choice
6. the delayed `ENABLE_HOLD` release opens the page-5-style switching path so
   the UUT domains rise
7. the later `RESET_ASSERT` release allows `RESET_HOLD` to rise afterward as a
   proxy for deferred test activity

For this specific pass, the abstraction is closest to a `SPI-enabled` startup
assumption, but it still does not simulate real digital boot execution.

Control assumptions:

* `BOOTMODE` is a direct control proxy for the `705.17` boot-choice state seen
  by the UUT at reset time, and in this case it is driven low to allow the
  SPI-boot path in principle
* the page-4/page-5 transistor cluster is abstracted as a UUT-enable hold
  signal plus branch gating behavior
* `DMN5L06DMK-AB` behavior is represented as the small clamp device that holds
  branch gates low before enable release
* `FDS6574A` behavior is represented as the stronger branch-pass element
* branch gates are released after startup so the UUT domains can rise only
  after the master side is already valid
* `RESET_ASSERT` is a separate hold signal that keeps the reset proxy low until
  after UUT-rail enable
* a simple RC node `RESET_HOLD` stands in for the idea that reset release or
  first meaningful test activity should lag rail settlement

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
* the reset-hold proxy should also lag the main UUT-domain rise enough that the
  UUT is not being asked to operate in the middle of obvious startup motion
* the boot-choice proxy should remain stable through the reset event so the
  startup mode is deterministic
* all active rails that matter for GA144 test use remain inside a realistic
  operating window centered on `1.8 V` and bounded by the datasheet

## Current Run Result

The current local `ngspice` run should be interpreted as an A/B comparison
against the `No-Boot` style baseline.

By the end of the transient:

* `VIN_MAIN` settles at about `1.795 V`
* the always-on master-side branch `VMASTER` settles at about `1.794 V`
* the page-1 sub-branches settle at:
  * `VU2` about `1.793 V`
  * `VU1` about `1.794 V`
  * `VU3` about `1.794 V`
* `BOOTMODE` stays low in the current `SPI-enabled` comparison setup
* `ENABLE_HOLD` releases just after `1.0 ms`, and the UUT rails rise
  immediately afterward
* `RESET_ASSERT` stays high until just after `2.5 ms`, so reset remains held
  after the UUT rails are already settled
* the RC reset proxy `RESET_HOLD` is still only about `0.70 V` by `12 ms`
  because the explicit reset hold now delays its rise much more strongly
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
* the control story is now clearer because boot choice, UUT-rail enable, and
  reset release are represented as separate timing ideas instead of one merged
  surrogate
* the UUT rails settle into their operating window before reset release, which
  is closer to the intended TB001 hold-then-run startup story
* the reset proxy now rises much later than before, which makes the deferred
  test-start assumption explicit instead of implicit
* the current interpretation is still a controlled hold-and-release startup
  story, but with the boot-choice proxy set to allow SPI boot at reset time
* compared against the `No-Boot` baseline, the current analog outputs are
  effectively unchanged, which is consistent with this model treating boot
  choice as a logical assumption rather than a rail-loading difference
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
* It still does not model actual SPI transactions or digital boot success; it
  only provides an explicit boot-choice proxy for comparison.
* It does not yet prove the exact `FDS6574A` page-5 wiring.
* It does not include connector or cable effects.
* It uses datasheet-informed MOS abstractions, not vendor transistor models.
* It treats the UUT domains as lumped resistive and capacitive loads.

## Workflow

```bash
cd toolbox/enrichment
./dist/pcb-sim pipeline --case-dir examples/pcb/cases/tb001-ga144-test-bringup-spi-enabled
```

## Next Iteration Targets

* tighten `FDS6574A` and `DMN5L06DMK-AB` model parameters from the local
  datasheets
* compare the resulting rail and reset timing traces directly against the
  `No-Boot` baseline and note any meaningful analog differences
* tune the reset-hold abstraction so domain settle time can be compared against
  a more realistic test-start threshold
* tighten the relative branch loads once better evidence exists for page-1
  power burden
