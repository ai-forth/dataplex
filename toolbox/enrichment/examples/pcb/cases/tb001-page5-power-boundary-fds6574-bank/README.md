# TB001 Page-5 Power Boundary FDS6574 Bank

## Purpose

This comparison case keeps the same page-4 control-side abstraction as the
baseline page-5 case, but changes the interpretation of the unresolved
`FDS6574` family.

Baseline hypothesis:

* one `FDS6574`-class PMOS behaves like a single high-side pass element

Alternate hypothesis in this case:

* the `FDS6574` family behaves more like a stronger switched PMOS bank feeding
  the same representative UUT-facing branch

The engineering question is:

Does treating the unresolved `FDS6574` family as a stronger composite pass bank
produce a materially more plausible startup result than the baseline single-pass
interpretation?

## Why This Is Useful

The baseline case already showed a real, non-binary outcome:

* control-side behavior looks coherent
* `VOUT` rises, but only to a limited level relative to the 1.8 V source

That makes it worthwhile to ask whether the unresolved page-5 switching family
is better represented as a stronger composite switch rather than a single weak
pass element.

## Current Result

The current run produces a stronger output than the baseline case:

* baseline single-pass case peaks at about `1.10 V`
* this stronger-bank case peaks at about `1.43 V`

Interpretation:

* the same page-4 control abstraction still works
* a stronger `FDS6574`-family interpretation materially improves the result
* the branch still does not reach the full `1.8 V` rail, so switch strength
  alone is probably not the entire story

That makes this a useful intermediate result rather than a final answer.

## Workflow

```bash
cd toolbox/enrichment
./dist/pcb-sim pipeline --case-dir examples/pcb/cases/tb001-page5-power-boundary-fds6574-bank
```
