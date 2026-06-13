# TB001 Page-5 Comparison Note

This note compares two current TB001 page-5 switching hypotheses:

* [tb001-page5-power-boundary](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-page5-power-boundary/README.md)
* [tb001-page5-power-boundary-fds6574-bank](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-page5-power-boundary-fds6574-bank/README.md)

The two cases intentionally keep the same page-4 control abstraction and the
same representative load. The comparison variable is the interpretation of the
page-5 `FDS6574` family:

* baseline: one PMOS pass element
* alternate: stronger PMOS pass bank

The next value of the corpus is not just having more cases, but having evidence
for which abstraction produces behavior that is more plausible for a UUT-facing
1.8 V switched branch.

## Current Comparison Result

On the same source, control waveform, and representative load:

* baseline single-pass case reaches about `1.10 V`
* stronger-bank case reaches about `1.43 V`

Working conclusion:

* the single-pass interpretation is probably too weak
* the unresolved `FDS6574` family likely participates in a stronger switch
  arrangement than the baseline abstraction captured
* the remaining gap to `1.8 V` suggests we still need either better device
  modeling, additional branch structure, or tighter source/load assumptions

## Next High-Value Step

The next high-value move is not another arbitrary topology jump. It is to keep
the stronger-bank hypothesis and tighten the assumptions around it:

* sweep representative load strength
* sweep source-path impedance
* replace the placeholder PMOS/NMOS behavior with a more justified device model

That will tell us whether the remaining voltage loss is mostly a model-strength
artifact or evidence that the page-5 branch still lacks important structure.
