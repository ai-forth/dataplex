import * as fs from 'node:fs';
import { CircuitSpec, SvgSummary } from './types';

function readIfPresent(filePath: string): string | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function readJsonIfPresent<T>(filePath: string): T | undefined {
  const raw = readIfPresent(filePath);
  if (!raw) {
    return undefined;
  }
  return JSON.parse(raw) as T;
}

export function buildCaseReport(args: {
  caseName: string;
  spec: CircuitSpec;
  svgSummaryPath?: string;
  runLogPath?: string;
  deckPath?: string;
}): string {
  const svgSummary = args.svgSummaryPath ? readJsonIfPresent<SvgSummary>(args.svgSummaryPath) : undefined;
  const runLog = args.runLogPath ? readIfPresent(args.runLogPath) : undefined;
  const deck = args.deckPath ? readIfPresent(args.deckPath) : undefined;
  const runTail = runLog?.trim().split(/\r?\n/).slice(-20).join('\n');

  const lines: string[] = [];
  lines.push(`# Simulation Report: ${args.caseName}`);
  lines.push('');
  lines.push(`## Purpose`);
  lines.push(args.spec.description ?? 'No description provided.');
  lines.push('');
  lines.push('## Circuit Summary');
  lines.push(`* Title: ${args.spec.title}`);
  lines.push(`* Components: ${args.spec.components.length}`);
  lines.push(`* Analyses: ${(args.spec.analyses ?? []).map((analysis) => analysis.kind).join(', ') || 'tran (default)'}`);
  lines.push(`* Outputs: ${(args.spec.outputs ?? []).join(', ') || 'v(*)'}`);
  lines.push('');

  if (args.spec.assumptions && args.spec.assumptions.length > 0) {
    lines.push('## Assumptions');
    args.spec.assumptions.forEach((assumption) => lines.push(`* ${assumption}`));
    lines.push('');
  }

  if (svgSummary) {
    lines.push('## SVG Intake');
    lines.push(`* Source: ${svgSummary.source}`);
    lines.push(`* Text labels extracted: ${svgSummary.textNodes.length}`);
    lines.push(`* Primitive counts: ${Object.entries(svgSummary.elementCounts).map(([key, value]) => `${key}=${value}`).join(', ')}`);
    lines.push('');
  }

  lines.push('## Generated Artifacts');
  if (args.deckPath) {
    lines.push(`* Deck: ${args.deckPath}`);
  }
  lines.push(`* Run log: ${args.runLogPath ?? 'not generated'}`);
  lines.push(`* Deck contains default models: ${deck?.includes('GENERIC_') ? 'yes' : 'no'}`);
  lines.push('');

  lines.push('## Run Status');
  if (runLog) {
    lines.push('```text');
    lines.push(runTail || '(empty log)');
    lines.push('```');
  }
  else {
    lines.push('No ngspice run log was found.');
  }
  lines.push('');

  lines.push('## Next Checks');
  lines.push('* Replace generic models with vendor or justified project models where they affect decisions.');
  lines.push('* Tighten loads, initial conditions, and rail assumptions using corpus evidence.');
  lines.push('* Feed any observed failures or sensitivities back into the engineering artifacts.');
  lines.push('');

  return lines.join('\n');
}
