export type ComponentType =
  | 'vsource'
  | 'isource'
  | 'resistor'
  | 'capacitor'
  | 'inductor'
  | 'diode'
  | 'nmos'
  | 'pmos';

export interface AnalysisSpec {
  kind: 'op' | 'dc' | 'tran' | 'ac';
  command?: string;
}

export interface ComponentSpec {
  id: string;
  type: ComponentType;
  nodes: string[];
  value?: string;
  model?: string;
  label?: string;
  params?: Record<string, string | number | boolean>;
}

export interface CircuitSpec {
  title: string;
  description?: string;
  sourceSvg?: string;
  assumptions?: string[];
  modelCards?: string[];
  components: ComponentSpec[];
  analyses?: AnalysisSpec[];
  outputs?: string[];
}

export interface SvgTextNode {
  text: string;
  x?: number;
  y?: number;
}

export interface SvgSummary {
  source: string;
  width?: string;
  height?: string;
  viewBox?: string;
  textNodes: SvgTextNode[];
  elementCounts: Record<string, number>;
}
