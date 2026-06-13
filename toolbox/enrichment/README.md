# Engineering Evidence Tools

This package is now a local-only MCP toolset for engineering evidence. It no
longer depends on Google Cloud, Dataplex, `kcmd`, or the Google ADK.

The retained tool is `md-fileset`, a small MCP server that exposes a directory
of markdown files so another agent can:

* browse the corpus
* search within it
* read individual files

That makes it a good fit for PCB projects where the evidence lives in markdown
exports of:

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

## Scope

This package is intentionally narrow now. It provides evidence access only.
Catalog mutation, cloud metadata sync, and agent orchestration were removed as
part of the local-first PCB cleanup.
