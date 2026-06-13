# Engineering Evidence Tools

This package is now a local-first toolset for engineering evidence and
simulation workflows. It no longer depends on Google Cloud, Dataplex, `kcmd`,
or the Google ADK.

The tools are:

* `md-fileset`, a small MCP server that exposes a directory of markdown files
* `pcb-sim`, a local CLI that scaffolds simulation cases, renders structured
  circuit proposals, builds `ngspice` decks, and writes run reports

`md-fileset` lets another agent:

* browse the corpus
* search within it
* read individual files

That makes the package a good fit for PCB projects where the evidence lives in
markdown exports of:

* schematics and subsystem notes
* BOM rationale
* manufacturing instructions
* test procedures
* simulation plans and results
* revision history and review notes

## Install

```bash
cd toolbox/enrichment
npm install
npm run build
```

## CLI

```bash
md-fileset --dir /absolute/path/to/evidence
pcb-sim init --case-dir /absolute/path/to/case --title "power-boundary"
```

Options:

* `--dir`
  Root directory containing the markdown evidence corpus.

## PCB Example

The PCB-oriented MCP config and skill scaffold remain in
[examples/pcb](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/README.md:1).

Set:

```bash
export KC_MD_FILESET_BIN=/absolute/path/to/dataplex/toolbox/enrichment/dist/md-fileset
export PCB_EVIDENCE_DIR=/absolute/path/to/your/evidence
```

Then point your orchestrating agent or MCP client at
[examples/pcb/mcp.json](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/mcp.json:1).

The simulation workflow is documented in
[examples/pcb/SIM_TOOLCHAIN.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/SIM_TOOLCHAIN.md:1).
`pcb-sim` itself was smoke-tested here, but full simulation still requires
`ngspice` to be installed on the host.

## Scope

This package is intentionally narrow. It provides:

* evidence access
* local structured simulation scaffolding

Catalog mutation, cloud metadata sync, and remote agent orchestration were
removed as part of the local-first PCB cleanup.
