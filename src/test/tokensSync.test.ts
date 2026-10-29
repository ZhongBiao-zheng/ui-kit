// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('token 同步', () => {
  it('tokens.css 由当前 DESIGN.md 生成（改 DESIGN.md 后运行 pnpm tokens）', () => {
    expect(() => execFileSync('node', ['scripts/tokens.mjs', '--check'], { stdio: 'pipe' })).not.toThrow();
  });
});
