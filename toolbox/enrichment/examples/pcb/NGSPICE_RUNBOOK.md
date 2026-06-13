# ngspice Runbook

This runbook defines the default simulation workflow for PCB evidence slices in
this repository.

Use it when an artifact has reached diagnosis-oriented or simulation-ready
quality and we want a reproducible local simulation.

## Why `ngspice` First

We want a simulator that is:

* local
* scriptable
* plain-text friendly
* easy to store beside markdown evidence
* suitable for agent-driven replay

That makes `ngspice` the default entrypoint for this workflow.

## Simulation Unit

Do not simulate the whole board first.

The default unit of work is a **subcircuit slice**:

* one regulator stage
* one switching boundary
* one reset/control path
* one sensitive analog path

Each slice should map back to:

* one primary artifact
* the authoritative source page
* explicit assumptions
* an expected question to answer

## Required Inputs

Before building a deck, capture:

* source artifact path
* schematic page or subsystem identifier
* known nets and component references
* assumed supply voltages
* assumed loads
* missing models
* pass/fail question

If any of those are missing, write them down as assumptions instead of hiding
them in the deck.

## Folder Convention

Recommended evidence layout:

```text
evidence/
  simulation/
    <board>/
      cases/
        <case-id>/
          README.md
          <case-id>.cir
          models/
          outputs/
```

Suggested case naming:

* `startup-v1p8-boundary`
* `page5-fet-switching`
* `reset-pull-network`

## Minimal Case README

For each simulation case, include:

* purpose
* source artifacts used
* assumptions
* missing information
* expected behavior
* how to run it
* key findings

## Default Analyses

Start with the smallest analysis that answers the question:

* `.op` for steady-state bias checks
* `.dc` for threshold or operating-range exploration
* `.tran` for startup, switching, and sequencing
* `.ac` only when frequency response is actually relevant

For most board bring-up questions in this workflow, `.tran` is the first choice.

## Modeling Rules

Prefer simple models first:

* ideal voltage sources for rails
* resistive or current-sink loads
* simple MOSFET models if exact vendor models are not yet available
* explicit parasitics only when the question depends on them

Mark every provisional model clearly in the case README.

## Promotion Rule

A case is ready to run when:

* the question is specific
* the subcircuit boundary is explicit
* assumptions are listed
* the outputs to inspect are named

A case is ready to trust when:

* the model source is documented
* critical assumptions are sensitivity-tested
* the result is reflected back into the evidence corpus

## Standard Run Command

Example batch execution:

```bash
ngspice -b -o outputs/run.log startup-v1p8-boundary.cir
```

For reproducibility, prefer batch mode and checked-in decks over ad hoc GUI-only
exploration.

## Escalation Rule

Stay in `ngspice` unless one of these becomes the blocker:

* convergence on a legitimate circuit abstraction
* very large sweeps
* very large netlists
* solver performance dominates iteration time

At that point, promote the same case to `Xyce` rather than changing the
engineering question.
