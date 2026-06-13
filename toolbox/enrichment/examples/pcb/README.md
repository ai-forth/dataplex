# PCB Example

This example uses the local `md-fileset` MCP tool as the evidence layer for a
board-design workflow. It assumes the engineering evidence lives in a markdown
corpus that another agent or orchestration layer can search and read.

Set these environment variables before running the example:

```bash
export KC_MD_FILESET_BIN=/absolute/path/to/dataplex/toolbox/enrichment/dist/md-fileset
export PCB_EVIDENCE_DIR=/absolute/path/to/your/evidence
```

Suggested corpus layout:

```text
evidence/
  board/
  components/
  component-uses/
  schematics/
  bom/
  manufacturing/
  test/
  simulation/
  revisions/
```

Typical concepts in the engineering knowledge set:

* board revisions
* schematic pages
* power rails
* interfaces
* component records
* component uses
* manufacturing notes
* test procedures
* simulation cases

Supporting documents in this folder:

* [SCHEMA.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/SCHEMA.md)
* [CORPUS_LAYOUT.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/CORPUS_LAYOUT.md)
* [TB001_STARTER_MAP.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/TB001_STARTER_MAP.md)
* [COMPONENT_CATALOG.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/COMPONENT_CATALOG.md)
* [ARTIFACT_EXTRACTION_RUBRIC.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/ARTIFACT_EXTRACTION_RUBRIC.md)
* [SIMULATION_STRATEGY.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/SIMULATION_STRATEGY.md)
* [NGSPICE_RUNBOOK.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/NGSPICE_RUNBOOK.md)
* [SIM_TOOLCHAIN.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/SIM_TOOLCHAIN.md)
* [templates/ngspice-subcircuit-template.cir](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/templates/ngspice-subcircuit-template.cir)

Use `mcp.json`, `prompt.md`, and `skills/pcb-review/SKILL.md` from this folder
as the starting point for a board project.

The first concrete simulation case now lives at
[cases/tb001-page5-power-boundary/README.md](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/cases/tb001-page5-power-boundary/README.md:1).

The first component-catalog seed records now live under
[components/tb001](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/components/tb001/fds6574.md:1)
and
[component-uses/tb001](/home/cartheur/ame/aiventure/aiventure-github/ai-forth/dataplex/toolbox/enrichment/examples/pcb/component-uses/tb001/q1-fds6574-page4.md:1).
