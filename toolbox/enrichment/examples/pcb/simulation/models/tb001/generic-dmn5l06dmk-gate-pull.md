---
id: tb001.simmodel.generic-dmn5l06dmk-gate-pull
type: simulation-model
title: Generic DMN5L06DMK gate-pull simulation model
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
    - tb001.component.dmn5l06dmk-ab
    - tb001.use.q2.page4.dmn5l06dmk-ab
    - tb001.use.page5.dmn5l06dmk-ab-bank
---

## Summary

This is the current placeholder NMOS model used in the TB001 page-5 comparison
cases when the `DMN5L06DMK-AB` family is treated as the page-4/page-5 control
side gate-pull device.

## Model Kind

* kind: simplified SPICE MOS model
* source: local placeholder in `pcb-sim`
* intended use: gate-control comparison behavior only

## Current Parameters

```text
.model GENERIC_NMOS NMOS(VTO=1.0 KP=40m RS=0.03 RD=0.03)
```

## What This Model Preserves

* low-voltage NMOS switching behavior
* a plausible gate-pull role in simplified control-side simulations

## What This Model Does Not Preserve

* verified manufacturer threshold range
* verified gate/source/drain pin mapping
* datasheet-backed drive strength
* capacitance and charge behavior
* any package-specific parasitics

## Safe Interpretation

This model is safe for:

* coarse control-side behavior comparison
* checking whether a candidate abstraction is directionally coherent

This model is **not** safe for:

* claiming real gate-drive margins
* proving that the real `DMN5L06DMK-AB` will behave identically on hardware
