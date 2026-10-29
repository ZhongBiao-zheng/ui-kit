/**
 * 棘轮守卫 —— 存量债务只许减少。基线在项目根目录 ui-kit.ratchet.json（项目自己管），减少后改成新数值。
 * 硬性禁令（原生控件、色值、字号、原生弹窗等）在 eslint.ui-kit.js。
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import ts from 'typescript';

const sources = import.meta.glob('../**/*.tsx', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

const FILES = Object.entries(sources)
  .filter(([path]) => !path.endsWith('.test.tsx'))
  .map(([path, source]) => ({
    rel: path.replace(/^\.\.\//, ''),
    source,
    file: ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX),
  }));
const PAGES = FILES.filter(({ rel }) => !rel.startsWith('components/ui/'));

const BASELINE: { rawButton: number; bareControl: number; arbitrarySpacing: number } = JSON.parse(
  readFileSync('ui-kit.ratchet.json', 'utf-8'),
);

const ARBITRARY_SPACING = /(?<![\w-])-?(?:p[xytrbl]?|m[xytrbl]?|gap(?:-[xy])?|space-[xy])-\[/g;

function jsxElements(file: ts.SourceFile, visit: (node: ts.JsxOpeningElement | ts.JsxSelfClosingElement) => void) {
  function walk(node: ts.Node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) visit(node);
    ts.forEachChild(node, walk);
  }
  walk(file);
}

function where(file: ts.SourceFile, rel: string, node: ts.Node) {
  return `${rel}:${file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1}`;
}

function expectRatchet(actual: number, key: keyof typeof BASELINE, what: string, hits: string[]) {
  const baseline = BASELINE[key];
  expect(actual, `${what}新增了 ${actual - baseline} 处：\n${hits.join('\n')}`).toBeLessThanOrEqual(baseline);
  expect(actual, `${what}已减少到 ${actual}，把 ui-kit.ratchet.json 的 ${key} 改成 ${actual}`).toBe(baseline);
}

describe('棘轮守卫', () => {
  it('原生 button 只减不增（新代码用 Button）', () => {
    const hits: string[] = [];
    for (const { rel, file } of PAGES) {
      jsxElements(file, node => {
        if (node.tagName.getText(file) === 'button') hits.push(where(file, rel, node));
      });
    }
    expectRatchet(hits.length, 'rawButton', '原生 <button> ', hits);
  });

  it('bare 控件只减不增（新代码用组件默认配方）', () => {
    const hits: string[] = [];
    for (const { rel, file } of PAGES) {
      jsxElements(file, node => {
        const bare = node.attributes.properties.some(attribute => ts.isJsxAttribute(attribute)
          && attribute.name.getText(file) === 'variant'
          && attribute.initializer !== undefined && ts.isStringLiteral(attribute.initializer)
          && attribute.initializer.text === 'bare');
        if (bare) hits.push(where(file, rel, node));
      });
    }
    expectRatchet(hits.length, 'bareControl', 'variant="bare" 控件', hits);
  });

  it('任意值间距只减不增（DESIGN.md § Layout）', () => {
    const hits: string[] = [];
    for (const { rel, source } of FILES) {
      source.split('\n').forEach((line, i) => {
        for (const _ of line.matchAll(ARBITRARY_SPACING)) hits.push(`${rel}:${i + 1}  ${line.trim().slice(0, 100)}`);
      });
    }
    expectRatchet(hits.length, 'arbitrarySpacing', '任意值间距 ', hits);
  });
});
