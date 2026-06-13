# Artifact Extraction Rubric

This rubric turns the TB001 workflow into a repeatable method for future PCB
projects.

The goal is to take a legacy or in-flight board and convert its evidence into
artifacts that are useful for:

* engineering review
* manufacturability checks
* simulation planning
* agent retrieval

## Extraction Loop

Use the same loop for every high-value page or subsystem:

1. Gather source evidence.
2. Draft a first artifact from authoritative sources.
3. Run retrieval-oriented questions against the artifact set.
4. Record what the corpus answered well and what it did not.
5. Refine one artifact until it crosses from scaffold summary to
   diagnosis-oriented note.
6. Commit when that milestone is reached.

## Source Priority

Use sources in this order unless a project-specific exception is documented:

1. released production schematic
2. released fab or manufacturing package
3. normalized BOM
4. redraw workbook or migration notes
5. supporting board images and older revisions
6. internet sources or current vendor references

## Artifact Maturity Levels

### Level 0: Placeholder

The artifact exists only to reserve structure.

Characteristics:

* title and frontmatter only
* little or no grounded interpretation
* mainly points to raw sources

Not yet good enough for evaluation.

### Level 1: Scaffold Summary

The artifact summarizes what is visibly present in the source material.

Characteristics:

* lists major components
* names visible nets or labels
* identifies likely function
* records obvious ambiguities

Good enough for orientation, not for diagnosis.

### Level 2: Review Artifact

The artifact supports a targeted engineering review.

Characteristics:

* connects components, labels, and likely function
* identifies concrete risks and mismatches
* separates known facts from provisional interpretation
* suggests specific next extraction targets

Good enough for design review and retrieval evaluation.

### Level 3: Diagnosis-Oriented Artifact

The artifact can support technically meaningful reasoning.

Characteristics:

* connector or boundary interpretation is explicit
* source/load or control-path hypotheses are explicit
* unresolved devices are categorized by risk
* likely electrical role is described in a way that guides simulation or test

Good enough to begin structured simulation planning.

### Level 4: Simulation-Ready Artifact

The artifact is detailed enough to support model-building.

Characteristics:

* explicit pin, net, or branch mapping
* known source and load relationships
* candidate simulation assumptions and simplifications
* pass/fail criteria or measurable expectations

Good enough to drive actual SPICE deck construction.

## Evaluation Questions

Use these after each slice of work.

### Orientation

* What does this page or subsystem do?
* Which other artifacts does it relate to?
* What is the highest-risk unresolved item here?

### Boundary And Interface

* Which connectors are likely external versus internal?
* Which labels or nets define the boundary?
* Is there enough evidence to distinguish support headers from output or test
  boundaries?

### Power And Switching

* Which rails or domains appear here?
* Is this page a source, load, switch, or distribution boundary?
* Are there explicit clues about sequencing or regulation?

### Simulation Readiness

* Could we build a simplified SPICE testbench from this artifact today?
* What models are still missing?
* What assumption would currently be most dangerous to get wrong?

## Scoring Template

Use a simple 0-10 score for each slice:

* orientation value
* review value
* diagnosis value
* simulation readiness

Interpretation:

* `0-3`: mostly placeholder
* `4-6`: scaffold or review artifact
* `7-8`: strong review or diagnosis artifact
* `9-10`: simulation-ready or near-simulation-ready artifact

## Commit Milestone

A slice is commit-worthy when all of the following are true:

* at least one artifact moved up a maturity level
* the evaluation result is documented
* the artifact now answers a real engineering question better than before
* the remaining gaps are explicit rather than hidden

## Anti-Patterns

Avoid these failure modes:

* broadening the corpus without deepening any artifact
* copying lists of parts without connecting them to function
* treating package identity as equivalent to electrical role
* writing simulation placeholders that do not name what is still missing
* mixing historical revisions without recording the choice
