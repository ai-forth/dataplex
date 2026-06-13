import { CircuitSpec, ComponentSpec } from './types';

interface PositionedNet {
  name: string;
  x: number;
  y: number;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function collectNets(spec: CircuitSpec): string[] {
  const names = new Set<string>();
  for (const component of spec.components) {
    for (const node of component.nodes) {
      names.add(node);
    }
  }
  return [...names];
}

function componentLabel(component: ComponentSpec): string {
  const detail = component.value ?? component.model ?? component.type;
  return component.label ? `${component.label} (${detail})` : `${component.id} ${detail}`;
}

export function renderCircuitSvg(spec: CircuitSpec): string {
  const nets = collectNets(spec);
  const rowHeight = 120;
  const componentWidth = 250;
  const componentHeight = 58;
  const leftX = 80;
  const componentX = 260;
  const rightX = 820;
  const topPadding = 80;
  const width = 1120;
  const height = Math.max(400, topPadding * 2 + Math.max(spec.components.length, nets.length) * rowHeight);

  const netPositions = new Map<string, PositionedNet>();
  nets.forEach((name, index) => {
    netPositions.set(name, {
      name,
      x: rightX,
      y: topPadding + index * rowHeight,
    });
  });

  const shapes: string[] = [];
  shapes.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="#f7f4ea"/>`);
  shapes.push(`<text x="${leftX}" y="44" font-family="monospace" font-size="28" fill="#1f2933">${escapeXml(spec.title)}</text>`);
  if (spec.description) {
    shapes.push(`<text x="${leftX}" y="68" font-family="monospace" font-size="14" fill="#52606d">${escapeXml(spec.description)}</text>`);
  }

  for (const net of netPositions.values()) {
    shapes.push(`<circle cx="${net.x}" cy="${net.y}" r="6" fill="#b83280"/>`);
    shapes.push(`<text x="${net.x + 14}" y="${net.y + 5}" font-family="monospace" font-size="14" fill="#102a43">${escapeXml(net.name)}</text>`);
  }

  spec.components.forEach((component, index) => {
    const componentY = topPadding + index * rowHeight - componentHeight / 2;
    const pinSpacing = component.nodes.length > 1
      ? componentHeight / (component.nodes.length - 1)
      : 0;
    const boxFill = component.type === 'vsource' || component.type === 'isource' ? '#d9e2ec' : '#fff7d6';

    shapes.push(
      `<rect x="${componentX}" y="${componentY}" width="${componentWidth}" height="${componentHeight}" rx="10" fill="${boxFill}" stroke="#243b53" stroke-width="2"/>`
    );
    shapes.push(
      `<text x="${componentX + 12}" y="${componentY + 24}" font-family="monospace" font-size="14" fill="#102a43">${escapeXml(component.id)}</text>`
    );
    shapes.push(
      `<text x="${componentX + 12}" y="${componentY + 44}" font-family="monospace" font-size="12" fill="#486581">${escapeXml(componentLabel(component))}</text>`
    );

    component.nodes.forEach((node, pinIndex) => {
      const pinY = component.nodes.length === 1 ? componentY + componentHeight / 2 : componentY + pinIndex * pinSpacing;
      const pinX = componentX + componentWidth;
      const net = netPositions.get(node);
      if (!net) {
        return;
      }
      const midX = pinX + 50;
      shapes.push(`<line x1="${pinX}" y1="${pinY}" x2="${midX}" y2="${pinY}" stroke="#243b53" stroke-width="2"/>`);
      shapes.push(`<line x1="${midX}" y1="${pinY}" x2="${midX}" y2="${net.y}" stroke="#829ab1" stroke-width="2"/>`);
      shapes.push(`<line x1="${midX}" y1="${net.y}" x2="${net.x}" y2="${net.y}" stroke="#829ab1" stroke-width="2"/>`);
      shapes.push(`<circle cx="${pinX}" cy="${pinY}" r="4" fill="#243b53"/>`);
      shapes.push(`<text x="${componentX - 12}" y="${pinY + 4}" text-anchor="end" font-family="monospace" font-size="12" fill="#334e68">pin${pinIndex + 1}</text>`);
    });
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    ...shapes,
    '</svg>',
  ].join('\n');
}
