import * as fs from 'node:fs';
import * as path from 'node:path';
import { SvgSummary, SvgTextNode } from './types';

function countMatches(input: string, pattern: RegExp): number {
  return (input.match(pattern) ?? []).length;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function summarizeSvg(svgPath: string): SvgSummary {
  const absolutePath = path.resolve(svgPath);
  const raw = fs.readFileSync(absolutePath, 'utf-8');

  const svgTagMatch = raw.match(/<svg\b([^>]*)>/i);
  const attributes = svgTagMatch?.[1] ?? '';
  const width = attributes.match(/\bwidth="([^"]+)"/i)?.[1];
  const height = attributes.match(/\bheight="([^"]+)"/i)?.[1];
  const viewBox = attributes.match(/\bviewBox="([^"]+)"/i)?.[1];

  const textNodes: SvgTextNode[] = [];
  const textPattern = /<text\b([^>]*)>([\s\S]*?)<\/text>/gi;
  for (const match of raw.matchAll(textPattern)) {
    const attrs = match[1] ?? '';
    const text = decodeEntities((match[2] ?? '').replace(/<[^>]+>/g, '').trim());
    if (!text) {
      continue;
    }
    const x = attrs.match(/\bx="([^"]+)"/i)?.[1];
    const y = attrs.match(/\by="([^"]+)"/i)?.[1];
    textNodes.push({
      text,
      x: x === undefined ? undefined : Number(x),
      y: y === undefined ? undefined : Number(y),
    });
  }

  return {
    source: absolutePath,
    width,
    height,
    viewBox,
    textNodes,
    elementCounts: {
      line: countMatches(raw, /<line\b/gi),
      polyline: countMatches(raw, /<polyline\b/gi),
      path: countMatches(raw, /<path\b/gi),
      rect: countMatches(raw, /<rect\b/gi),
      circle: countMatches(raw, /<circle\b/gi),
      text: textNodes.length,
    },
  };
}
