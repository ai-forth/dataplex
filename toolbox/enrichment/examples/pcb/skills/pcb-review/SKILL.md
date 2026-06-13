---
name: pcb-review
description: >
  Use the local engineering markdown corpus to gather grounded evidence about a
  PCB design artifact before updating its engineering brief.
---

The `md-fileset` MCP server provides three useful tools:

* `list_fileset_contents`
  Browse the local engineering corpus by directory when you need to understand
  what evidence exists for schematics, BOM notes, manufacturing guidance, test
  plans, or simulation results.

* `search_fileset_content`
  Search using concrete engineering keywords such as board revision, reference
  designator, net name, interface name, power rail, regulator part number,
  connector name, manufacturing process, or simulation topic.

* `read_fileset_file`
  Read the full markdown file once a search result looks relevant. Use it to
  extract source-grounded facts and citations for the engineering brief.

Suggested workflow:

1. Start with the artifact name, subsystem name, reference designators, and any
   visible net or interface names from the catalog entry.
2. Search for direct references first, then broader subsystem and revision
   terminology if the direct search is sparse.
3. Read the most relevant files and extract only facts supported by the source.
4. Prefer citing authoritative review notes, manufacturing instructions, test
   procedures, and simulation summaries over informal notes when they conflict.
