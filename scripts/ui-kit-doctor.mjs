// 检查项目接入 ui-kit 的状态，逐项给出修法。用法：node scripts/ui-kit-doctor.mjs
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const results = [];
const check = (ok, name, fix) => results.push({ ok, name, fix });
const read = path => (existsSync(path) ? readFileSync(path, 'utf-8') : '');
const json = path => {
  try {
    return JSON.parse(read(path));
  } catch {
    return undefined;
  }
};

const components = json('components.json');
check(Boolean(components), 'components.json 存在', '运行 pnpm exec shadcn init，或从 ui-kit 复制 components.json');
check(Boolean(components?.registries?.['@biao']), 'components.json 配了 @biao 命名空间', '加 "registries": { "@biao": "https://zhongbiao-zheng.github.io/ui-kit/r/{name}.json" }');

const cssPath = components?.tailwind?.css;
const css = cssPath ? read(cssPath) : '';
check(Boolean(css), `入口 CSS（${cssPath ?? '未配置'}）存在`, 'components.json 的 tailwind.css 指向项目的 Tailwind 入口文件');
check(/@import ['"][^'"]*tokens\.css['"]/.test(css), '入口 CSS 引入了 tokens.css', `在 ${cssPath} 的 @import 'tailwindcss' 下一行加 @import './…/tokens.css'`);

const tsconfig = read('tsconfig.json') + read('tsconfig.app.json');
check(/"@\/\*"\s*:/.test(tsconfig), 'tsconfig 配了 @/* 路径别名', 'compilerOptions.paths 加 "@/*": ["./src/*"]，vite.config 的 resolve.alias 同步加 @');

check(existsSync('DESIGN.md'), 'DESIGN.md 存在', 'pnpm exec shadcn add @biao/base');
let tokensSynced = false;
try {
  execFileSync('node', ['scripts/tokens.mjs', '--check'], { stdio: 'pipe' });
  tokensSynced = true;
} catch {}
check(tokensSynced, 'tokens.css 与 DESIGN.md 同步', 'node scripts/tokens.mjs');

check(/eslint\.ui-kit\.js/.test(read('eslint.config.js')), 'eslint.config.js 引用 eslint.ui-kit.js', '用 @biao/base 的 eslint.config.js 作入口，项目调整追加在数组后面');
check(existsSync('ui-kit.ratchet.json'), 'ui-kit.ratchet.json 存在', '首跑 pnpm test，把棘轮报错里的实际数填进 ui-kit.ratchet.json');

const pkg = json('package.json') ?? {};
const scripts = pkg.scripts ?? {};
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
check(/eslint/.test(scripts.lint ?? ''), 'lint 脚本包含 eslint', '"lint": "tsc -b --noEmit && eslint ."');
check(/vitest/.test(scripts.test ?? ''), 'test 脚本运行 vitest', '"test": "vitest run"');
check(Boolean(deps.shadcn), 'shadcn 在 devDependencies', 'pnpm add -D shadcn，之后统一用 pnpm exec shadcn add');

const workspace = read('pnpm-workspace.yaml');
check(/esbuild:\s*true/.test(workspace), 'pnpm-workspace.yaml 放行 esbuild', 'pnpm-workspace.yaml 写入 allowBuilds:\\n  esbuild: true');

if (existsSync('src/components/ui/sonner.tsx')) {
  let mounted = false;
  try {
    mounted = execFileSync('grep', ['-rl', '<Toaster', 'src', '--include=*.tsx'], { encoding: 'utf-8' }).trim() !== '';
  } catch {}
  check(mounted, '应用根部挂了 <Toaster />', '在应用根组件里渲染一次 <Toaster />（ui/sonner）');
}

// 版本：本地 rules 与线上 registry 比较
const local = json('scripts/ui-kit.version.json');
if (!local) check(false, 'rules 版本文件存在', 'pnpm exec shadcn add @biao/rules --overwrite');
else {
  try {
    const remote = await fetch(`${local.registry}/rules.json`).then(r => r.json());
    const file = remote.files.find(item => item.path.endsWith('ui-kit.version.json'));
    const latest = JSON.parse(file.content).version;
    check(latest === local.version, `rules 是最新版（本地 ${local.version}，线上 ${latest}）`, 'pnpm exec shadcn add @biao/rules --overwrite，再用 git diff 看改了什么');
  } catch {
    results.push({ ok: true, name: `rules 版本 ${local.version}（线上版本获取失败，跳过比较）` });
  }
}

for (const { ok, name, fix } of results) console.log(`${ok ? '✓' : '✗'} ${name}${ok ? '' : `\n    → ${fix}`}`);
const failed = results.filter(item => !item.ok).length;
console.log(failed ? `\n${failed} 项未通过` : '\n全部通过');
process.exit(failed ? 1 : 0);
