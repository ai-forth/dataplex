import * as fs from 'node:fs';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { buildCaseReport } from './report';
import { renderCircuitSvg } from './render';
import { buildSpiceDeck } from './spice';
import { loadCircuitSpec, writeJson } from './spec';
import { summarizeSvg } from './svg';

interface ParsedArgs {
  command?: string;
  options: Record<string, string | boolean>;
}

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeText(filePath: string, text: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, text, 'utf-8');
}

function resolveDataFileForDeck(deckPath: string, dataFile?: string): string | undefined {
  if (!dataFile) {
    return undefined;
  }
  if (path.isAbsolute(dataFile)) {
    return dataFile;
  }
  return path.resolve(path.dirname(deckPath), dataFile);
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const command = args[0] && !args[0].startsWith('--') ? args[0] : undefined;
  const options: Record<string, string | boolean> = {};

  for (let index = command ? 1 : 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith('--')) {
      continue;
    }
    const key = token.slice(2).replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
    const next = args[index + 1];
    if (!next || next.startsWith('--')) {
      options[key] = true;
      continue;
    }
    options[key] = next;
    index += 1;
  }

  return { command, options };
}

function requireStringOption(options: Record<string, string | boolean>, key: string): string {
  const value = options[key];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`--${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)} is required.`);
  }
  return value;
}

function printHelp() {
  console.log(`pcb-sim 0.1.0

Usage:
  pcb-sim init --case-dir <dir> --title <title>
  pcb-sim extract-svg --svg <file> --out <file>
  pcb-sim render --spec <file> --out <file>
  pcb-sim build-deck --spec <file> --out <file> [--data-file <file>]
  pcb-sim run --deck <file> --out-log <file>
  pcb-sim report --case-dir <dir> --out <file>
  pcb-sim pipeline --case-dir <dir>
`);
}

function caseTemplate(title: string, sourceSvg?: string) {
  return {
    title,
    description: 'Replace with the specific engineering question for this case.',
    sourceSvg,
    assumptions: [
      'Capture only the smallest subcircuit needed to answer the question.',
      'Replace generic device models when the result depends on switching detail.',
      'Update loads and timing constants from project evidence before sign-off.',
    ],
    analyses: [
      { kind: 'tran', command: 'tran 10u 10m' }
    ],
    outputs: ['v(VIN)', 'v(VOUT)', 'v(EN)'],
    components: [
      { id: 'MAIN', type: 'vsource', nodes: ['VIN', '0'], value: 'DC 5' },
      { id: 'CTRL', type: 'vsource', nodes: ['EN', '0'], value: 'PULSE(0 3.3 0 1u 1u 5m 10m)' },
      { id: 'SRC', type: 'resistor', nodes: ['VIN', 'VIN_FILT'], value: '0.15' },
      { id: 'BULK', type: 'capacitor', nodes: ['VIN_FILT', '0'], value: '22u' },
      { id: 'HSW', type: 'pmos', nodes: ['VOUT', 'EN', 'VIN_FILT', 'VIN_FILT'], model: 'GENERIC_PMOS' },
      { id: 'LOAD', type: 'resistor', nodes: ['VOUT', '0'], value: '18' },
      { id: 'CLOAD', type: 'capacitor', nodes: ['VOUT', '0'], value: '10u' },
      { id: 'PULL', type: 'resistor', nodes: ['EN', '0'], value: '100k' }
    ]
  };
}

function readSourceSvgIfPresent(caseDir: string): string | undefined {
  const candidate = path.join(caseDir, 'input', 'source.svg');
  return fs.existsSync(candidate) ? candidate : undefined;
}

function initCase(caseDir: string, title: string) {
  const sourceSvg = readSourceSvgIfPresent(caseDir) ?? 'input/source.svg';
  ensureDir(path.join(caseDir, 'input'));
  ensureDir(path.join(caseDir, 'artifacts'));
  ensureDir(path.join(caseDir, 'outputs'));

  const specPath = path.join(caseDir, 'circuit.json');
  if (!fs.existsSync(specPath)) {
    writeJson(specPath, caseTemplate(title, sourceSvg));
  }

  const readmePath = path.join(caseDir, 'README.md');
  if (!fs.existsSync(readmePath)) {
    writeText(readmePath, [
      `# ${title}`,
      '',
      '## Purpose',
      'Describe the smallest engineering question this case should answer.',
      '',
      '## Inputs',
      '* `input/source.svg` for the originating diagram or slice',
      '* `circuit.json` for the structured circuit proposal',
      '',
      '## Workflow',
      '```bash',
      'pcb-sim pipeline --case-dir .',
      '```',
      '',
      '## Notes',
      '* Replace generic models before trusting device-sensitive behavior.',
      '* Keep assumptions explicit and version-controlled.',
      '',
    ].join('\n'));
  }
}

function runNgspice(deckPath: string, logPath: string) {
  const versionCheck = spawnSync('ngspice', ['-v'], { encoding: 'utf-8' });
  if (versionCheck.error) {
    throw new Error('ngspice is not installed or not on PATH.');
  }

  ensureDir(path.dirname(logPath));
  const result = spawnSync('ngspice', ['-b', '-o', logPath, path.basename(deckPath)], {
    encoding: 'utf-8',
    cwd: path.dirname(deckPath),
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    throw new Error(stderr ? `ngspice failed: ${stderr}` : `ngspice exited with status ${result.status}`);
  }
}

function pipeline(caseDir: string) {
  const specPath = path.join(caseDir, 'circuit.json');
  const spec = loadCircuitSpec(specPath);
  const sourceSvg = readSourceSvgIfPresent(caseDir);

  const artifactsDir = path.join(caseDir, 'artifacts');
  const outputsDir = path.join(caseDir, 'outputs');
  ensureDir(artifactsDir);
  ensureDir(outputsDir);

  const svgSummaryPath = path.join(artifactsDir, 'svg-summary.json');
  if (sourceSvg) {
    writeJson(svgSummaryPath, summarizeSvg(sourceSvg));
  }

  const schematicPath = path.join(artifactsDir, 'schematic.svg');
  writeText(schematicPath, renderCircuitSvg(spec));

  const deckPath = path.join(artifactsDir, 'circuit.cir');
  writeText(deckPath, buildSpiceDeck(spec, path.join(outputsDir, 'sim.dat')));

  const runLogPath = path.join(outputsDir, 'run.log');
  let runError: Error | undefined;
  try {
    runNgspice(deckPath, runLogPath);
  }
  catch (error) {
    runError = error as Error;
    writeText(runLogPath, `Simulation not completed.\n${runError.message}\n`);
  }

  const reportPath = path.join(outputsDir, 'REPORT.md');
  writeText(reportPath, buildCaseReport({
    caseName: path.basename(path.resolve(caseDir)),
    spec,
    svgSummaryPath: sourceSvg ? svgSummaryPath : undefined,
    runLogPath,
    deckPath,
  }));

  if (runError) {
    throw runError;
  }
}

async function main() {
  const { command, options } = parseArgs(process.argv);

  if (!command || options.help) {
    printHelp();
    return;
  }
  if (options.version) {
    console.log('0.1.0');
    return;
  }

  switch (command) {
    case 'init': {
      const caseDir = path.resolve(typeof options.caseDir === 'string' ? options.caseDir : '.');
      const title = typeof options.title === 'string' ? options.title : path.basename(caseDir);
      initCase(caseDir, title);
      return;
    }
    case 'extract-svg': {
      const svg = requireStringOption(options, 'svg');
      const out = requireStringOption(options, 'out');
      writeJson(path.resolve(out), summarizeSvg(path.resolve(svg)));
      return;
    }
    case 'render': {
      const specPath = requireStringOption(options, 'spec');
      const out = requireStringOption(options, 'out');
      const spec = loadCircuitSpec(path.resolve(specPath));
      writeText(path.resolve(out), renderCircuitSvg(spec));
      return;
    }
    case 'build-deck': {
      const specPath = requireStringOption(options, 'spec');
      const out = requireStringOption(options, 'out');
      const spec = loadCircuitSpec(path.resolve(specPath));
      const dataFile = typeof options.dataFile === 'string' ? options.dataFile : undefined;
      const deckPath = path.resolve(out);
      writeText(deckPath, buildSpiceDeck(spec, resolveDataFileForDeck(deckPath, dataFile)));
      return;
    }
    case 'run': {
      const deck = requireStringOption(options, 'deck');
      const outLog = requireStringOption(options, 'outLog');
      runNgspice(path.resolve(deck), path.resolve(outLog));
      return;
    }
    case 'report': {
      const out = requireStringOption(options, 'out');
      const caseDir = path.resolve(typeof options.caseDir === 'string' ? options.caseDir : '.');
      const spec = loadCircuitSpec(path.join(caseDir, 'circuit.json'));
      writeText(path.resolve(out), buildCaseReport({
        caseName: path.basename(caseDir),
        spec,
        svgSummaryPath: path.join(caseDir, 'artifacts', 'svg-summary.json'),
        runLogPath: path.join(caseDir, 'outputs', 'run.log'),
        deckPath: path.join(caseDir, 'artifacts', 'circuit.cir'),
      }));
      return;
    }
    case 'pipeline': {
      const caseDir = path.resolve(typeof options.caseDir === 'string' ? options.caseDir : '.');
      pipeline(caseDir);
      return;
    }
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

main().catch((error: Error) => {
  console.error(error.message);
  process.exit(1);
});
