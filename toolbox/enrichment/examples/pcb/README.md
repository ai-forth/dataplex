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
* manufacturing notes
* test procedures
* simulation cases

Use `mcp.json`, `prompt.md`, and `skills/pcb-review/SKILL.md` from this folder
as the starting point for a board project.
