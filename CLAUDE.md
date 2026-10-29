# ui-kit

飙哥产品的 UI 规范模板：DESIGN.md（token + 设计理由）→ 生成 Tailwind v4 token → `components/ui` 语义组件 → vitest 守卫。本仓库本身是可运行的组件样例（Kit）。

## 命令

```bash
pnpm dev           # Kit 样例页
pnpm tokens        # DESIGN.md → src/styles/tokens.css
pnpm design:lint   # DESIGN.md 结构与对比度检查
pnpm lint && pnpm test
```

## 规则

- 改视觉先改 `DESIGN.md`，再 `pnpm tokens`；`src/styles/tokens.css` 不手改。
- 页面只组合 `src/components/ui/`，选用见 `docs/design/components.md`。
- 读写数据的界面按 `docs/design/states.md` 覆盖加载、空、失败与操作反馈。
- 新增或修改组件后同步更新 Kit 样例页与 `docs/design/components.md`。
- 这里的改动是模板，已接入的项目不会自动更新；接入方式见 README。
