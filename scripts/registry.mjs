// 从 src/components/ui 与基础文件生成 registry.json（依赖从 import 读出）。用法：pnpm registry
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const NAMESPACE = '@biao';
const pkg = JSON.parse(readFileSync(`${root}package.json`, 'utf-8'));
const versions = { ...pkg.dependencies, ...pkg.devDependencies };

function npmDeps(source) {
  const deps = new Set();
  for (const [, spec] of source.matchAll(/from '([^'.@][^']*|@(?!\/)[^']+)'/g)) {
    const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
    if (name !== 'react' && versions[name]) deps.add(`${name}@${versions[name]}`);
  }
  return [...deps].sort();
}

function uiDeps(source, self) {
  const deps = new Set();
  for (const [, file] of source.matchAll(/from '\.\/([\w-]+)'/g)) if (file !== self) deps.add(`${NAMESPACE}/${file}`);
  return [...deps].sort();
}

const ui = readdirSync(`${root}src/components/ui`)
  .filter(file => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
  .map(file => {
    const name = file.replace(/\.tsx$/, '');
    const path = `src/components/ui/${file}`;
    const source = readFileSync(`${root}${path}`, 'utf-8');
    return {
      name,
      type: 'registry:ui',
      dependencies: npmDeps(source),
      registryDependencies: [`${NAMESPACE}/utils`, `${NAMESPACE}/base`, ...uiDeps(source, name)],
      files: [{ path, type: 'registry:ui' }],
    };
  });

// target 以 ~/ 开头表示项目根目录；不加时 shadcn 会放进 src/ 下
const file = (path, target = `~/${path}`) => ({ path, type: 'registry:file', target });
const dev = names => names.map(name => `${name}@${versions[name]}`);

const utils = {
  name: 'utils',
  type: 'registry:lib',
  dependencies: dev(['clsx', 'tailwind-merge']),
  files: [{ path: 'src/lib/utils.ts', type: 'registry:lib' }],
};

// 项目自己管的文件：只在接入时装一次，之后各项目自己改（token、ESLint 调整、棘轮基线）
const base = {
  name: 'base',
  type: 'registry:item',
  title: 'UI 规范底座（项目自有）',
  description: 'DESIGN.md、ESLint 入口、棘轮基线；接入时装一次，之后由项目自己改',
  dependencies: dev(['@fontsource-variable/inter', '@fontsource-variable/noto-sans-sc']),
  registryDependencies: [`${NAMESPACE}/rules`],
  files: [file('DESIGN.md'), file('eslint.config.js'), file('ui-kit.ratchet.json')],
};

// 跟随上游的文件：项目里不改，用 shadcn add @biao/rules --overwrite 更新
const rules = {
  name: 'rules',
  type: 'registry:item',
  title: 'UI 规范规则（随上游更新）',
  description: 'ESLint 规则模块、token 生成脚本、守卫测试与规范文档',
  devDependencies: dev(['@google/design.md', 'vitest', 'eslint', 'typescript-eslint', 'eslint-plugin-react-hooks', 'eslint-plugin-better-tailwindcss']),
  files: [
    file('eslint.ui-kit.js'),
    file('scripts/tokens.mjs'),
    file('src/test/ratchet.test.ts'),
    file('src/test/pageLayoutGuard.test.ts'),
    file('src/test/tokensSync.test.ts'),
    ...readdirSync(`${root}docs/design`).map(name => file(`docs/design/${name}`)),
  ],
};

const storybook = {
  name: 'storybook',
  type: 'registry:item',
  title: 'Storybook + Chromatic',
  description: '主题与视口工具栏、Chromatic 快照组合（组件 2 张，页面 4 张）',
  devDependencies: dev(['storybook', '@storybook/react-vite', 'chromatic']),
  files: [file('.storybook/main.ts'), file('.storybook/preview.tsx'), file('.storybook/modes.ts')],
};

const examples = {
  name: 'page-examples',
  type: 'registry:item',
  title: '页面样板',
  description: '设置页与列表页样板，新页面从这里复制',
  registryDependencies: ['badge', 'button', 'field', 'input', 'item', 'page', 'section', 'select', 'sonner', 'switch', 'table'].map(n => `${NAMESPACE}/${n}`),
  files: readdirSync(`${root}src/pages/examples`).map(name => file(`src/pages/examples/${name}`)),
};

const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'biao',
  homepage: 'https://zhongbiao-zheng.github.io/ui-kit',
  items: [utils, base, rules, ...ui, examples, storybook],
};

writeFileSync(`${root}registry.json`, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`registry.json: ${registry.items.length} items`);
