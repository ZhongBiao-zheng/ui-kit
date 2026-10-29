// UI 规范的执行层（随 @biao/rules 更新，项目里不要改这个文件，调整写在 eslint.config.js）。
// 只开规范相关规则（Tailwind 类名、原生控件、原生弹窗、hooks），不开通用风格规则集：
// 一次铺开几百条风格告警会让这道门禁被整体忽略。规则依据见 DESIGN.md 与 docs/design/。
import { readFileSync } from 'node:fs';
import betterTailwind from 'eslint-plugin-better-tailwindcss';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

// Tailwind 入口 CSS 跟 components.json 走，各项目位置不同
const entryPoint = JSON.parse(readFileSync('components.json', 'utf-8')).tailwind.css;

const CLASS_RULES = [
  { pattern: '^(?:.+:)?shadow-(?!none$).+$', message: '不用阴影，层级靠表面与边框（DESIGN.md § Elevation）' },
  { pattern: '^(?:.+:)?[a-z-]+-\\[#[0-9a-fA-F]+\\]$', message: '不写色值，用颜色 token（DESIGN.md § Colors）' },
  { pattern: '^(?:.+:)?text-(?:\\[\\d.*|\\d?xl)$', message: '字号只用 text-xs / sm / base / lg（DESIGN.md § Typography）' },
  { pattern: '^(?:.+:)?rounded(?:-[a-z]+)?-\\[.+\\]$', message: '圆角用 token 档位（DESIGN.md § Shapes）' },
  { pattern: '^(?:.+:)?bg-(?:gradient|linear|radial|conic)-.+$', message: '不用渐变（DESIGN.md § Do\'s and Don\'ts）' },
  { pattern: '^dark:.+$', message: '不写 dark: 变体，暗色由 token 切换（DESIGN.md § Colors）' },
];

const PAGE_CLASS_RULES = [
  { pattern: '^(?:.+:)?(?:mx-auto|max-w-(?!none$).+)$', message: '页面宽度与居中交给 Page 的 width（docs/design/layouts.md）' },
];

const NATIVE_CONTROLS = [
  {
    selector: "JSXOpeningElement[name.name=/^(input|select|textarea)$/]",
    message: '页面不写原生控件，用 components/ui（docs/design/components.md）',
  },
  {
    selector: "JSXOpeningElement[name.name='form']:not(:has(JSXAttribute[name.name='autoComplete'][value.value='off']))",
    message: '<form> 需要 autoComplete="off"（docs/design/components.md）',
  },
  {
    selector: "Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/], Literal[value=/\\brgba?\\(|\\bhsla?\\(/]",
    message: '不写色值，用颜色 token（DESIGN.md § Colors）',
  },
];

export default tseslint.config(
  { ignores: ['dist/**', 'storybook-static/**', 'site/**', 'public/**', 'node_modules/**'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks, 'better-tailwindcss': betterTailwind },
    settings: { 'better-tailwindcss': { entryPoint } },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'no-alert': 'error',
      'better-tailwindcss/no-unknown-classes': 'error',
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-restricted-classes': ['error', { restrict: CLASS_RULES }],
    },
  },
  {
    // 页面层：只组合 components/ui
    files: ['src/**/*.tsx'],
    ignores: ['src/components/ui/**', 'src/**/*.test.tsx', 'src/**/*.stories.tsx'],
    rules: { 'no-restricted-syntax': ['error', ...NATIVE_CONTROLS] },
  },
  {
    files: ['src/pages/**/*.tsx'],
    rules: { 'better-tailwindcss/no-restricted-classes': ['error', { restrict: [...CLASS_RULES, ...PAGE_CLASS_RULES] }] },
  },
);
