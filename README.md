# Engineering Knowledge Catalog

This repository now serves as a reference implementation for an
AI-assisted engineering knowledge catalog. The core idea is to turn design
artifacts into structured, versioned knowledge that an agent can search,
enrich, and reuse during design review, simulation planning, and release to
manufacturing.

The motivating use case is PCB engineering:

* ingest schematics, BOMs, layout notes, revision history, test procedures,
  simulation results, and manufacturing constraints
* normalize them into catalog entries and linked markdown knowledge
* enrich those entries with grounded engineering briefs
* help future agents assess design fitness, manufacturability, and validation
  readiness

## Architecture

The repository still contains several complementary building blocks:

* `toolbox/mdcode`
  Stores catalog artifacts as source-controlled YAML and Markdown so engineers
  and agents can collaborate on the same knowledge base.
* `toolbox/enrichment`
  Provides a local MCP fileset tool for browsing, searching, and reading
  engineering evidence from a markdown corpus.
* `okf`
  Demonstrates a portable markdown bundle format for linked knowledge that can
  be consumed outside any single platform.
* `samples/discovery`
  Shows discovery patterns that can later be adapted for engineering search and
  retrieval.

## How This Maps To PCB Work

For a board project, the catalog entries would typically represent:

* boards and revisions
* schematic pages and subsystems
* power domains and interfaces
* components or component groups
* manufacturing notes and assembly constraints
* test procedures and fixtures
* simulation scenarios and validation evidence
* known risks, findings, and ECO history

The enriched documentation should make it easy for an agent to answer questions
such as:

* What is this block responsible for?
* Which evidence supports that the design is fit for manufacture?
* What constraints, dependencies, or unresolved risks remain?
* What should be simulated or tested before release?

## Best Starting Point

If you are adapting this repo for PCB design, start with
[toolbox/enrichment/README.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/README.md:1).
That package is the shortest path to exposing a local engineering corpus to an
agent through MCP and to running the local simulation loop from structured
circuit proposal to `ngspice` output. The concrete PCB schema, simulation
workflow, and TB001 starter mapping live in
[toolbox/enrichment/examples/pcb/README.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/README.md:1).

----

The next best step is to add one more layer of behavior after reset release, probably as a coarse mode-dependent load profile, so SPI-enabled and No-Boot can start to diverge in a controlled, testable way without pretending we already have full GA144 execution modeled.