/** 页面骨架守卫 —— src/pages 下的页面统一用 Page 外壳（docs/design/layouts.md）。 */
import { describe, expect, it } from 'vitest';

const sources = import.meta.glob('../pages/**/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const PAGES = Object.entries(sources)
  .filter(([path]) => !path.endsWith('.test.tsx'))
  .map(([path, source]) => ({ rel: path.replace(/^\.\.\//, ''), source }));

describe('页面骨架守卫（docs/design/layouts.md）', () => {
  // 没有 src/pages 的项目（例如单画布应用）跳过
  it.skipIf(PAGES.length === 0)('每个页面用 Page 外壳', () => {
    const missing = PAGES.filter(({ source }) => !/<Page[\s>]/.test(source)).map(({ rel }) => rel);
    expect(missing, `用 <Page> 包住页面：\n${missing.join('\n')}`).toEqual([]);
  });
});
