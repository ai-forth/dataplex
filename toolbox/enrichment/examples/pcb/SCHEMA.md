# PCB Knowledge Schema

This schema defines the core artifact types for a local PCB engineering
knowledge corpus. The goal is not to force every project into a rigid database
shape, but to give agents a stable set of concepts and fields they can rely on
when reviewing a board.

## Design Principles

* Keep artifacts as plain markdown with lightweight YAML frontmatter.
* Prefer one artifact per engineering concept.
* Link related artifacts using stable IDs in frontmatter and normal markdown
  links in the body.
* Store facts and evidence close together so an agent can cite them.

## Required Frontmatter

Every engineering document should include:

```yaml
---
id: tb001.board.rev106d
type: board
title: TB001 revision 106d
project: TB001
revision: 106d
status: draft
tags:
  - ga144
  - test-board
sources:
  - TB001-Schematic-106d.pdf
relationships:
  relates_to:
    - tb001.page.1
    - tb001.subsystem.power-control
---
```

Required fields:

* `id`
  Stable identifier used across links and cross-references.
* `type`
  Artifact type from the list below.
* `title`
  Human-readable display name.

Common optional fields:

* `project`
* `revision`
* `status`
* `tags`
* `sources`
* `relationships`

## Core Artifact Types

### `board`

Represents a full board revision.

Recommended fields:

* `revision`
* `part_number`
* `design_state`
* `owner`
* `manufacturing_readiness`

Typical links:

* schematic pages
* subsystems
* BOM
* manufacturing notes
* test procedures
* revision history

### `schematic-page`

Represents a single schematic sheet.

Recommended fields:

* `page_number`
* `sheet_title`
* `subsystems`
* `key_components`
* `key_nets`

### `subsystem`

Represents a functional block such as power control, SRAM interface, clocking,
or test harness logic.

Recommended fields:

* `function`
* `interfaces`
* `power_rails`
* `key_components`
* `design_constraints`

### `power-rail`

Represents a named rail or power domain.

Recommended fields:

* `rail_name`
* `nominal_voltage`
* `source_path`
* `loads`
* `sequence_requirements`
* `protection_features`

### `interface`

Represents a connector or logical interface.

Recommended fields:

* `interface_name`
* `direction`
* `signal_family`
* `termination`
* `protection`
* `connected_artifacts`

### `component-group`

Represents a meaningful cluster of parts rather than every individual resistor
and capacitor as its own document.

Recommended fields:

* `reference_designators`
* `group_role`
* `critical_parts`
* `selection_rationale`

### `component`

Represents a unique manufacturer part number with manufacturer-grounded
characteristics.

Recommended fields:

* `manufacturer`
* `mpn`
* `package`
* `datasheet_status`
* `model_status`
* `pinout_status`
* `operating_limits_status`

Recommended body focus:

* manufacturer identity and ordering information
* known package and pin-count facts
* authoritative electrical characteristics from the datasheet
* available simulation model assets
* explicit separation between sourced facts and unresolved placeholders

### `component-use`

Represents how a unique component is used on a specific board or page.

Recommended fields:

* `reference_designators`
* `board_context`
* `page_context`
* `use_role`
* `related_component`
* `simulation_relevance`

Recommended body focus:

* where the part appears in the design
* what role it likely plays in that location
* which assumptions are board-specific rather than manufacturer facts
* what must be verified before simulation or release decisions trust the part

### `simulation-model`

Represents the actual electrical abstraction used in simulation.

Recommended fields:

* `related_component`
* `model_kind`
* `model_source`
* `fidelity_level`
* `intended_use`
* `known_limitations`

Recommended body focus:

* whether the model came from the manufacturer, a fitted approximation, or a
  placeholder
* what parameters were preserved
* what was intentionally simplified away
* what simulation conclusions are valid or unsafe with that model

### `bom`

Represents a board-level or subsystem-level bill of materials view.

Recommended fields:

* `bom_revision`
* `source_file`
* `critical_parts`
* `sourcing_risks`
* `approved_alternates`

### `manufacturing-note`

Represents assembly, fab, handling, or fixture constraints.

Recommended fields:

* `process_scope`
* `constraint_type`
* `affected_artifacts`
* `acceptance_criteria`

### `test-procedure`

Represents validation or production test steps.

Recommended fields:

* `procedure_scope`
* `equipment`
* `preconditions`
* `measurements`
* `pass_fail_criteria`

### `simulation-case`

Represents a simulation objective, setup, and conclusion.

Recommended fields:

* `simulation_type`
* `target_artifacts`
* `assumptions`
* `stimulus`
* `expected_result`
* `observed_result`

### `risk`

Represents a design concern, ambiguity, or open issue.

Recommended fields:

* `severity`
* `likelihood`
* `affected_artifacts`
* `evidence`
* `mitigation`
* `verification_needed`

### `revision-note`

Represents change history, review notes, ECOs, or postmortems.

Recommended fields:

* `revision`
* `change_summary`
* `motivation`
* `affected_artifacts`
* `follow_up_actions`

## Recommended Body Sections

Most documents should use some subset of:

```markdown
## Summary

## Functional Role

## Evidence

## Constraints

## Verification

## Risks

## Citations
```

## Relationship Vocabulary

Use lightweight relationship keys in frontmatter:

* `contains`
* `part_of`
* `depends_on`
* `drives`
* `powered_by`
* `tested_by`
* `constrained_by`
* `documents`
* `supersedes`
* `relates_to`

## Minimum Viable Set For A New Board

For a first pass, create at least:

* 1 `board`
* N `schematic-page`
* 3-8 `subsystem`
* 1 `bom`
* 1-3 `manufacturing-note`
* 2-5 `component`
* 2-5 `component-use`
* 1-3 `test-procedure`
* 0-N `risk`

That is enough for an agent to begin doing meaningful review and evidence
retrieval without waiting for perfect coverage.
