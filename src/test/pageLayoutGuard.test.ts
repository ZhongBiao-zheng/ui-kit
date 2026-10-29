/** 页面骨架守卫 —— src/pages 下的页面统一用 Page 外壳（docs/design/layouts.md）。 */
import { describe, expect, it } from 'vitest';

const sources = import.meta.glob('../pages/**/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const PAGES = Object.entries(sources)
  .filter(([path]) => !path.endsWith('.test.tsx'))
  .map(([path, source]) => ({ rel: path.replace(/^\.\.\//, ''), source }));

describe('页面骨架守卫（docs/design/layouts.md）', () => {
  it('扫描器覆盖页面源码', () => {
    expect(PAGES.length).toBeGreaterThan(0);
  });

  it('每个页面用 Page 外壳', () => {
    const missing = PAGES.filter(({ source }) => !/<Page[\s>]/.test(source)).map(({ rel }) => rel);
    expect(missing, `用 <Page> 包住页面：\n${missing.join('\n')}`).toEqual([]);
  });

  it('页面不自己写居中与最大宽度，交给 Page 的 width', () => {
    const hits = PAGES.flatMap(({ rel, source }) => source.split('\n')
      .map((line, i) => (/\bmx-auto\b|\bmax-w-(?!none\b)/.test(line) ? `${rel}:${i + 1}  ${line.trim().slice(0, 100)}` : null))
      .filter((hit): hit is string => hit !== null));
    expect(hits, `用 Page 的 width（narrow / default / full）：\n${hits.join('\n')}`).toEqual([]);
  });
});
