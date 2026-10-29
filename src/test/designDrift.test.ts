/**
 * 设计漂移守卫 —— DESIGN.md 的硬约束执行层。扫描 src 下非测试 tsx，按规则红灯。
 * 合理例外登记到 ALLOWLIST，不扩大正则。
 */
import { describe, expect, it } from 'vitest';

const sources = import.meta.glob('../**/*.tsx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

interface AllowEntry {
  file: string; // 相对 src/ 的路径
  pattern: string; // 命中行需包含的片段
  reason: string;
}

const ALLOWLIST: AllowEntry[] = [];

const FILES = Object.entries(sources)
  .filter(([path]) => !path.endsWith('.test.tsx'))
  .map(([path, content]) => ({ rel: path.replace(/^\.\.\//, ''), lines: content.split('\n') }));

function assertClean(rule: RegExp, designRef: string) {
  const hits: string[] = [];
  for (const { rel, lines } of FILES) {
    lines.forEach((line, i) => {
      if (!rule.test(line)) return;
      if (ALLOWLIST.some(a => a.file === rel && line.includes(a.pattern))) return;
      hits.push(`${rel}:${i + 1}  ${line.trim().slice(0, 120)}`);
    });
  }
  expect(hits, `${hits.length} 处违反 ${designRef}：\n${hits.join('\n')}`).toEqual([]);
}

describe('设计漂移守卫（DESIGN.md）', () => {
  it('扫描器覆盖组件源码', () => {
    expect(FILES.length).toBeGreaterThan(5);
  });

  it('禁硬编码色值，颜色走 token（§ Colors）', () => {
    assertClean(/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b|\brgba?\(|\bhsla?\(/, 'DESIGN.md § Colors');
  });

  it('只用四档字号 text-xs/sm/base/lg（§ Typography）', () => {
    assertClean(/\btext-(?:\[\d|\d?xl\b)/, 'DESIGN.md § Typography');
  });

  it('禁阴影（§ Elevation）', () => {
    assertClean(/\bshadow-(?!none\b)/, 'DESIGN.md § Elevation');
  });

  it('禁任意值圆角与渐变（§ Shapes / Do\'s and Don\'ts）', () => {
    assertClean(/rounded-\[|bg-gradient|bg-linear|bg-radial/, 'DESIGN.md § Shapes');
  });

  it('禁 dark: 变体，暗色由 token 切换（§ Colors）', () => {
    assertClean(/\bdark:/, 'DESIGN.md § Colors');
  });
});
