import * as fs from 'node:fs';
import * as path from 'node:path';
import { AnalysisSpec, CircuitSpec, ComponentSpec } from './types';

function ensureString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Expected non-empty string for "${field}".`);
  }
  return value;
}

function ensureStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`Expected string array for "${field}".`);
  }
  return value;
}

function ensureAnalysisKind(value: unknown, field: string): AnalysisSpec['kind'] {
  const kind = ensureString(value, field);
  if (kind !== 'op' && kind !== 'dc' && kind !== 'tran' && kind !== 'ac') {
    throw new Error(`Unsupported analysis kind for "${field}": ${kind}`);
  }
  return kind;
}

function ensureComponentType(value: unknown, field: string): ComponentSpec['type'] {
  const type = ensureString(value, field);
  if (!['vsource', 'isource', 'resistor', 'capacitor', 'inductor', 'diode', 'nmos', 'pmos'].includes(type)) {
    throw new Error(`Unsupported component type for "${field}": ${type}`);
  }
  return type as ComponentSpec['type'];
}

export function loadCircuitSpec(specPath: string): CircuitSpec {
  const absolutePath = path.resolve(specPath);
  const raw = fs.readFileSync(absolutePath, 'utf-8');
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  const componentsRaw = parsed.components;
  if (!Array.isArray(componentsRaw) || componentsRaw.length === 0) {
    throw new Error('Circuit spec must include a non-empty "components" array.');
  }

  const spec: CircuitSpec = {
    title: ensureString(parsed.title, 'title'),
    description: typeof parsed.description === 'string' ? parsed.description : undefined,
    sourceSvg: typeof parsed.sourceSvg === 'string' ? parsed.sourceSvg : undefined,
    assumptions: parsed.assumptions === undefined ? undefined : ensureStringArray(parsed.assumptions, 'assumptions'),
    modelCards: parsed.modelCards === undefined ? undefined : ensureStringArray(parsed.modelCards, 'modelCards'),
    outputs: parsed.outputs === undefined ? undefined : ensureStringArray(parsed.outputs, 'outputs'),
    analyses: Array.isArray(parsed.analyses) ? parsed.analyses.map((analysis, index) => {
      if (!analysis || typeof analysis !== 'object') {
        throw new Error(`Invalid analysis entry at index ${index}.`);
      }
      const record = analysis as Record<string, unknown>;
      return {
        kind: ensureAnalysisKind(record.kind, `analyses[${index}].kind`),
        command: typeof record.command === 'string' ? record.command : undefined,
      };
    }) : undefined,
    components: componentsRaw.map((component, index) => {
      if (!component || typeof component !== 'object') {
        throw new Error(`Invalid component entry at index ${index}.`);
      }
      const record = component as Record<string, unknown>;
      const params = record.params;
      if (params !== undefined && (typeof params !== 'object' || Array.isArray(params) || params === null)) {
        throw new Error(`Expected object for "components[${index}].params".`);
      }
      return {
        id: ensureString(record.id, `components[${index}].id`),
        type: ensureComponentType(record.type, `components[${index}].type`),
        nodes: ensureStringArray(record.nodes, `components[${index}].nodes`),
        value: typeof record.value === 'string' ? record.value : undefined,
        model: typeof record.model === 'string' ? record.model : undefined,
        label: typeof record.label === 'string' ? record.label : undefined,
        params: params as ComponentSpec['params'] | undefined,
      };
    }),
  };

  return spec;
}

export function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf-8');
}
