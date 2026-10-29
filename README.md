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

2. 装底座（会连带装上 `@biao/rules` 和 shadcn CLI），再装要用的组件：

   ```bash
   pnpm dlx shadcn@latest add @biao/base
   pnpm exec shadcn add @biao/input @biao/select @biao/page-examples
   ```

3. 跑检查，按提示逐项修到全部通过：

   ```bash
   node scripts/ui-kit-doctor.mjs
   ```

4. 改 `DESIGN.md` 的 Overview 与 colors，`node scripts/tokens.mjs` 重新生成 token。
5. 存量项目：
   - `node scripts/ui-kit-migrate.mjs` 把原生 input / select / textarea 换成组件（`variant="bare"` 保持原外观，按项目的分号和引号风格写 import；有同名组件的文件会跳过）
   - 手写 CSS 类放进 `@layer components`，ESLint 才认得
   - 首跑 `pnpm test`，把棘轮报错里的实际数量填进 `ui-kit.ratchet.json`；项目自己的 ESLint 调整追加在 `eslint.config.js` 的数组后面
6. 项目里有真实敏感数据时，提供 `pnpm dev:demo`（假数据 + 另一个端口），验证业务场景只用它。
7. 产品页面视觉回归：`pnpm exec shadcn add @biao/storybook`。装完后 `.storybook/` 三个文件归项目自己改（入口 CSS 与字体、主题与视口、快照组合），不再 `--overwrite`。页面 stories 要稳定：固定 `Date`、拦截联网请求给固定返回、用内存里的演示数据提供数据上下文，Storybook 里去掉读写真实数据的服务端插件（参考 ai-asset-desk 的 `.storybook/` 与 `src/stories/withDesk.tsx`）。
8. Chromatic：在 chromatic.com 建项目，把 project token 配成环境变量 `CHROMATIC_PROJECT_TOKEN`（CI 用仓库 secret）。

单独补组件：`pnpm exec shadcn add @biao/<组件名>`。

## 更新

在本仓库改完 → `pnpm lint && pnpm test` → 推送 main，Pages 自动发布。接入的项目拉取：

```bash
pnpm exec shadcn add @biao/rules --overwrite        # 规则、脚本、守卫测试、规范文档
pnpm exec shadcn add @biao/<组件名> --overwrite     # 组件
```

用 git diff 看改了什么。`node scripts/ui-kit-doctor.mjs` 会比较本地 rules 与线上版本，过期时提示。`@biao/base` 的三个文件（`DESIGN.md`、`eslint.config.js`、`ui-kit.ratchet.json`）归项目自己管，接入后不要再 `--overwrite` 拉 base。

## 本仓库命令

```bash
pnpm dev               # Kit 样例页
pnpm storybook         # Storybook
pnpm tokens            # DESIGN.md → tokens.css
pnpm registry          # 生成 registry.json 并构建 public/r
pnpm lint && pnpm test
pnpm chromatic         # 需要 CHROMATIC_PROJECT_TOKEN
```
