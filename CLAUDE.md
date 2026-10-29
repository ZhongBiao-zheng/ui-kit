# ui-kit

飙哥产品的 UI 规范模板：DESIGN.md（token + 设计理由）→ 生成 Tailwind v4 token → `components/ui` 语义组件 → ESLint 规则 + vitest 棘轮 → Storybook / Chromatic 视觉回归。本仓库本身是可运行的组件样例（Kit）。

## 命令

```bash
pnpm dev           # Kit 样例页
pnpm tokens        # DESIGN.md → src/styles/tokens.css
pnpm design:lint   # DESIGN.md 结构与对比度检查
pnpm registry      # 生成并构建 registry
pnpm storybook     # Storybook
pnpm lint && pnpm test
```

## 规则

- 界面工作顺序见 `docs/design/workflow.md`：页面清单 → Mobbin 参考 → Claude Design 出稿 → 映射到规范 → 实现与验收。

- 改视觉先改 `DESIGN.md`，再 `pnpm tokens`；`src/styles/tokens.css` 不手改。
- 页面只组合 `src/components/ui/`，选用见 `docs/design/components.md`。
- 新页面从 `src/pages/examples/` 的样板复制，结构按 `docs/design/layouts.md`。
- 读写数据的界面按 `docs/design/states.md` 覆盖加载、空、失败与操作反馈。
- 新增或修改组件后同步更新 Kit 样例页与 `docs/design/components.md`。
- 新页面或明显的 UI 改动，交付前按 `docs/design/review.md` 截图评审，必修项修完再交付。
- 本仓库是 shadcn registry（`@biao`）：`base` 是项目自有文件（DESIGN.md、eslint.config.js、ui-kit.ratchet.json），`rules` 跟随上游。规则改 `eslint.ui-kit.js`，不改 `eslint.config.js`。改组件后 `pnpm registry` 能构建通过再推送；接入的项目用 `shadcn add @biao/<名> --overwrite` 拉取更新。
