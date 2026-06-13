import { CircuitSpec, ComponentSpec } from './types';

function toParamString(params: Record<string, string | number | boolean> | undefined): string {
  if (!params) {
    return '';
  }
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');
}

function valueFor(component: ComponentSpec, fallback: string): string {
  return component.value ?? fallback;
}

function buildSourceValue(component: ComponentSpec): string {
  if (component.value) {
    return component.value;
  }
  if (component.params?.dc !== undefined) {
    return `DC ${component.params.dc}`;
  }
  if (component.params?.pulse !== undefined) {
    return `PULSE(${component.params.pulse})`;
  }
  if (component.params?.sine !== undefined) {
    return `SINE(${component.params.sine})`;
  }
  return 'DC 0';
}

function componentLine(component: ComponentSpec): string {
  switch (component.type) {
    case 'resistor':
      return `R${component.id} ${component.nodes.join(' ')} ${valueFor(component, '1k')}`;
    case 'capacitor':
      return `C${component.id} ${component.nodes.join(' ')} ${valueFor(component, '1u')}`;
    case 'inductor':
      return `L${component.id} ${component.nodes.join(' ')} ${valueFor(component, '1u')}`;
    case 'diode':
      return `D${component.id} ${component.nodes.join(' ')} ${component.model ?? 'DIODE_DEFAULT'}`;
    case 'vsource':
      return `V${component.id} ${component.nodes.join(' ')} ${buildSourceValue(component)}`;
    case 'isource':
      return `I${component.id} ${component.nodes.join(' ')} ${buildSourceValue(component)}`;
    case 'nmos':
      return `M${component.id} ${component.nodes.join(' ')} ${component.model ?? 'GENERIC_NMOS'} ${toParamString(component.params)}`.trim();
    case 'pmos':
      return `M${component.id} ${component.nodes.join(' ')} ${component.model ?? 'GENERIC_PMOS'} ${toParamString(component.params)}`.trim();
    default:
      throw new Error(`Unsupported component type: ${(component as { type: string }).type}`);
  }
}

function defaultModelLines(spec: CircuitSpec): string[] {
  const lines: string[] = [];
  if (spec.components.some((component) => component.type === 'diode' && (!component.model || component.model === 'DIODE_DEFAULT'))) {
    lines.push('.model DIODE_DEFAULT D(IS=1e-14 N=1)');
  }
  if (spec.components.some((component) => component.type === 'nmos' && (!component.model || component.model === 'GENERIC_NMOS'))) {
    lines.push('.model GENERIC_NMOS NMOS(VTO=1.0 KP=40m RS=0.03 RD=0.03)');
  }
  if (spec.components.some((component) => component.type === 'pmos' && (!component.model || component.model === 'GENERIC_PMOS'))) {
    lines.push('.model GENERIC_PMOS PMOS(VTO=-0.7 KP=60m RS=0.03 RD=0.03)');
  }
  return lines;
}

export function buildSpiceDeck(spec: CircuitSpec, dataFilePath?: string): string {
  const lines: string[] = [];
  lines.push(`.title ${spec.title}`);
  lines.push('');

  if (spec.description) {
    lines.push(`* ${spec.description}`);
  }
  spec.assumptions?.forEach((assumption) => {
    lines.push(`* assumption: ${assumption}`);
  });
  if (spec.description || spec.assumptions?.length) {
    lines.push('');
  }

  for (const component of spec.components) {
    lines.push(componentLine(component));
  }

  if (spec.modelCards && spec.modelCards.length > 0) {
    lines.push('');
    lines.push(...spec.modelCards);
  }

  const models = defaultModelLines(spec);
  if (models.length > 0) {
    lines.push('');
    lines.push(...models);
  }

  const analyses = spec.analyses && spec.analyses.length > 0
    ? spec.analyses
    : [{ kind: 'tran' as const, command: 'tran 10u 10m' }];
  const outputs = spec.outputs && spec.outputs.length > 0 ? spec.outputs : ['v(*)'];

  lines.push('');
  lines.push('.control');
  lines.push('set filetype=ascii');
  analyses.forEach((analysis, index) => {
    const command = analysis.command ?? `${analysis.kind}`;
    lines.push(command.startsWith('.') ? command.slice(1) : command);
    lines.push(`print ${outputs.join(' ')}`);
    if (dataFilePath) {
      const suffix = analyses.length > 1 ? `-${index + 1}` : '';
      lines.push(`wrdata ${dataFilePath.replace(/\.dat$/i, `${suffix}.dat`)} ${outputs.join(' ')}`);
    }
  });
  lines.push('quit');
  lines.push('.endc');
  lines.push('');
  lines.push('.end');

  return lines.join('\n') + '\n';
}
