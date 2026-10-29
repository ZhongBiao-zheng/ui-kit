// 从 DESIGN.md 生成 src/styles/tokens.css。用法：pnpm tokens（写入）/ node scripts/tokens.mjs --check（校验同步）
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const target = `${root}src/styles/tokens.css`;
const cli = `${root}node_modules/.bin/design.md`;
// 中文字形与系统兜底：DESIGN.md 只写主字体，回落链在这里统一补上
const FONT_FALLBACK = '"Noto Sans SC Variable", ui-sans-serif, system-ui, sans-serif';

const exported = execFileSync(cli, ['export', '--format', 'css-tailwind', 'DESIGN.md'], { cwd: root, encoding: 'utf-8' });
const declarations = exported.split('\n').filter(line => line.trim().startsWith('--'));

const light = [];
const dark = [];
let family = null;
for (const line of declarations) {
  const [, name, value] = line.trim().match(/^--([\w-]+):\s*(.+);$/);
  if (name.startsWith('color-dark-')) dark.push(`  --color-${name.slice('color-dark-'.length)}: ${value};`);
  else if (name.startsWith('font-weight-')) light.push(`  --text-${name.slice('font-weight-'.length)}--font-weight: ${value};`);
  else if (name.startsWith('leading-')) light.push(`  --text-${name.slice('leading-'.length)}--line-height: ${value};`);
  else if (name.startsWith('font-')) family ??= value;
  else light.push(`  --${name}: ${value};`);
}
if (family) light.unshift(`  --font-sans: ${[family, ...FONT_FALLBACK.split(', ').filter(item => item !== family)].join(', ')};`);

const css = [
  '/* 由 DESIGN.md 生成（pnpm tokens），不要手改 */',
  '@theme {',
  ...light,
  '}',
  '',
  // 只有定义了 dark- token 的产品才有暗色
  ...(dark.length ? ['.dark {', ...dark, '}', ''] : []),
].join('\n');

if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf-8') !== css) {
    console.error('tokens.css 与 DESIGN.md 不同步，运行 pnpm tokens');
    process.exit(1);
  }
} else {
  writeFileSync(target, css);
}
