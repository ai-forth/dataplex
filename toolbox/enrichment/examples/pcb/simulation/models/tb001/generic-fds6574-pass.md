---
id: tb001.simmodel.generic-fds6574-pass
type: simulation-model
title: Generic FDS6574 pass-element simulation model
project: TB001
status: draft
tags:
  - simulation-model
  - transistor
  - placeholder
sources:
  - /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/src/tools/sim/spice.ts
  - /home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-page5-power-boundary/circuit.json
relationships:
  documents:
    - tb001.component.fds6574
    - tb001.use.page5.fds6574-bank
---

## Summary

This is the current placeholder PMOS model used in the TB001 page-5 comparison
cases when the unresolved `FDS6574` family is represented as a pass element or
pass bank.

## Model Kind

* kind: simplified SPICE MOS model
* source: local placeholder in `pcb-sim`
* intended use: comparative startup behavior only

## Current Parameters

```text
.model GENERIC_PMOS PMOS(VTO=-0.7 KP=60m RS=0.03 RD=0.03)
```

## What This Model Preserves

* low-threshold PMOS switching behavior
* finite series resistance
* a controllable high-side pass abstraction suitable for comparison runs

## What This Model Does Not Preserve

* verified manufacturer pinout
* verified channel arrangement
* datasheet-backed on-resistance
* capacitance and charge behavior
* thermal behavior
* any package- or die-specific parasitics

## Safe Interpretation

This model is safe for:

* relative comparison between candidate switching abstractions
* coarse startup and branch-strength intuition

This model is **not** safe for:

* release decisions
* device-stress conclusions
* timing or dissipation claims tied to the real `FDS6574`
