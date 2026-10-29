# ui-kit

个人产品的 UI 规范模板。三层：

1. **Token**：`DESIGN.md`（YAML token + 设计理由）是唯一来源，`pnpm tokens` 生成 `src/styles/tokens.css`。
2. **组件**：`src/components/ui/` 语义组件，属性写死在组件里（例如 `SecretInput` 不会触发浏览器保存密码）。
3. **守卫**：`src/test/` 下三个 vitest 测试——设计漂移、原生控件、token 同步。

技术栈：React 18 + TypeScript + Vite + Tailwind v4 + Radix + vitest。

## 新项目

```bash
git clone ~/Projects/ui-kit <新项目路径>
```

1. 进入新目录，`git remote remove origin` 后 `pnpm install`。
2. 改 `DESIGN.md` 的 Overview（写具体参照对象）与 colors，运行 `pnpm tokens`。
3. `main.tsx` 换成产品入口；Kit 保留为开发期路由（`import.meta.env.DEV` 时挂载）。
4. 把 `CLAUDE.md` 的「规则」节并入项目 CLAUDE.md / AGENTS.md。

## 存量项目接入

前提：已用 React + Tailwind v4 + vitest。

1. 复制 `DESIGN.md`、`scripts/tokens.mjs`、`src/components/ui/`、`src/lib/utils.ts`、`src/test/*.test.ts`、`docs/design/components.md`。
2. 补依赖：`@google/design.md`、`@radix-ui/react-dialog`、`@radix-ui/react-label`、`@radix-ui/react-slot`、`class-variance-authority`、`clsx`、`tailwind-merge`、`lucide-react`、`@fontsource-variable/inter`、`@fontsource-variable/noto-sans-sc`。
3. 把项目现有色值、字号、圆角搬进 `DESIGN.md`，`pnpm tokens`，样式入口 `@import './tokens.css'`。
4. 迁移原生 `input` / `select` / `textarea` 到组件（参考 game-atelier 359d40ff：先 `variant="bare"` 保持外观，再逐步收敛）。
5. 首跑守卫，把原生 button、bare 控件、任意值间距的实际数量填进 `nativeControlsGuard.test.ts` 的基线。
