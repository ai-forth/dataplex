# TB001 GA144 Startup Mode Comparison

## Purpose

This note compares the two current TB001 bring-up cases:

* `tb001-ga144-test-bringup`
* `tb001-ga144-test-bringup-spi-enabled`

The goal is to isolate the effect of the boot-choice proxy while keeping the
same rail, load, and reset timing assumptions.

## What Changed

Only one intentional control difference exists between the two cases:

* baseline case:
  `BOOTMODE = 3.3 V`, representing a `No-Boot` style reset-time assumption
* comparison case:
  `BOOTMODE = 0 V`, representing a `SPI-enabled` reset-time assumption

All other assumptions remain the same:

* same `V1P8` source
* same page-1 master-side loads
* same UUT-domain loads
* same `ENABLE_HOLD` timing
* same `RESET_ASSERT` timing

## Result

In the current analog-only abstraction, the boot-choice proxy does **not**
change the rail behavior.

The end-state values are effectively identical between the two runs for:

* `VIN_MAIN`
* `VMASTER`
* `VU2`
* `VU1`
* `VU3`
* `RESET_HOLD`
* `VCORE`
* `VIO`
* `VAN`

Only the boot-choice control itself differs:

* baseline `BOOTMODE`: high
* comparison `BOOTMODE`: low

## Interpretation

This is a useful result, not a disappointing one.

It says the current model has cleanly separated:

* the analog power-up story
* the logical boot-choice story

In other words:

* the present abstraction is sensitive to rail-enable and reset timing
* the present abstraction is not yet sensitive to digital boot-path behavior

That is the correct outcome for a model that still treats the `GA144` as a
power-domain load rather than an executing digital system.

## What We Learned

The current case family can already answer one practical question:

* does changing the assumed boot mode alone upset the analog rail fitness of
  TB001?

Current answer:

* not in this abstraction

The next higher-value question is different:

* when digital boot behavior is represented more explicitly, does the startup
  mode produce different current draw, timing sensitivity, or test-control
  sequencing requirements?

## Next Step

Keep these two cases as the stable analog baseline, then add the next layer of
behavior in one of two ways:

* a coarse mode-dependent load profile that changes after reset release
* a later digital-event artifact that describes expected SPI or `No-Boot`
  traffic without yet claiming transistor-accurate protocol simulation
