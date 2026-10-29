# ui-kit

个人产品的 UI 规范，以 [shadcn registry](https://ui.shadcn.com/docs/registry) 分发。

- **Storybook**：https://zhongbiao-zheng.github.io/ui-kit/storybook/
- **Registry**：`https://zhongbiao-zheng.github.io/ui-kit/r/{name}.json`

## 组成

| 层 | 内容 |
|---|---|
| 设计起步 | Mobbin 找参考 → Claude Design 出稿 → 按本规范实现（`docs/design/workflow.md`） |
| Token | `DESIGN.md`（YAML token + 设计理由）是唯一来源，`pnpm tokens` 生成 `src/styles/tokens.css` |
| 组件 | `src/components/ui/`，shadcn/ui（new-york）写法与字号命名，属性写死在组件里 |
| 规范文档 | `docs/design/`：组件选用、页面状态、页面骨架、视觉评审 |
| 执行 | `eslint.config.js` 实时拦截违规写法；`src/test/` 棘轮、token 同步、页面外壳 |
| 视觉回归 | Storybook + Chromatic：组件截浅色 / 深色，页面样板截 1280 / 375 × 浅色 / 深色 |

技术栈：React 18 + TypeScript + Vite + Tailwind v4 + Radix + ESLint + vitest + Storybook 10。

## 接入项目

前提：React + Vite + Tailwind v4，已有 `components.json`（没有就先 `pnpm dlx shadcn@latest init`）。

1. `components.json` 加命名空间：

   ```json
   "registries": { "@biao": "https://zhongbiao-zheng.github.io/ui-kit/r/{name}.json" }
   ```

2. 装底座和要用的组件（组件间依赖会自动带上）：

   ```bash
   pnpm dlx shadcn@latest add @biao/base @biao/page-examples @biao/storybook
   ```

3. 样式入口加 `@import './tokens.css';`，应用根部挂一次 `<Toaster />`（`ui/sonner`）。
4. `pnpm-workspace.yaml` 放行 esbuild（pnpm 11）：`allowBuilds: { esbuild: true }`。
5. 改 `DESIGN.md` 的 Overview 与 colors，`node scripts/tokens.mjs` 重新生成 token。
6. `package.json` 的 lint 加上 `eslint .`。存量项目首跑 `ratchet.test.ts`，把报错里的实际数量填进 `ui-kit.ratchet.json`；项目自己的 ESLint 调整追加在 `eslint.config.js` 的数组后面。
7. 存量页面迁移原生控件：`Input` / `Textarea` / `Select` 先用 `variant="bare"` 保持原外观，再逐步收敛到默认配方。手写 CSS 类放进 `@layer components`，ESLint 才认得。
8. Chromatic：在 chromatic.com 建项目，把 project token 配成环境变量 `CHROMATIC_PROJECT_TOKEN`（CI 用仓库 secret）。

单独补组件：`pnpm dlx shadcn@latest add @biao/<组件名>`。

## 更新

在本仓库改完 → `pnpm lint && pnpm test` → 推送 main，Pages 自动发布。接入的项目拉取：

```bash
pnpm dlx shadcn@latest add @biao/rules --overwrite        # 规则、脚本、守卫测试、规范文档
pnpm dlx shadcn@latest add @biao/<组件名> --overwrite     # 组件
```

用 git diff 看改了什么。`@biao/base` 的三个文件（`DESIGN.md`、`eslint.config.js`、`ui-kit.ratchet.json`）归项目自己管，接入后不要再 `--overwrite` 拉 base。

## 本仓库命令

```bash
pnpm dev               # Kit 样例页
pnpm storybook         # Storybook
pnpm tokens            # DESIGN.md → tokens.css
pnpm registry          # 生成 registry.json 并构建 public/r
pnpm lint && pnpm test
pnpm chromatic         # 需要 CHROMATIC_PROJECT_TOKEN
```
