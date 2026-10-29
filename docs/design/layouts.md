# 页面骨架规范

> 页面用 `Page` → `PageHeader` → 若干 `Section` 搭。样板见 Kit 的「设置页」「列表页」（`src/pages/examples/`），新页面从样板复制改起。

## 外壳

| 组件 | 规则 |
|---|---|
| `Page` | `src/pages` 下每个页面都用它。宽度三档：`narrow`（设置、表单）、`default`（列表、详情）、`full`（画布、看板）。页面里不再写 `mx-auto`、`max-w-*`、页面边距 |
| `PageHeader` | 每页一个。标题 + 页面级操作，主按钮放最右，搜索框放主按钮左侧；需要返回时传 `back`。不写副标题。窄屏下标题不被压缩，操作区换到下一行并占满整行 |
| `Section` | 页面内的一组内容：小标题 + 内容，区块级操作放标题右侧。区块间距由 `Page` 统一，不另加 margin |

## 设置页

- `Page width="narrow"`，按主题分 `Section`。
- 每项一行 `Item`：说明在左，控件在右（`ItemActions`）。设置项不加图标：有的组带图标、有的不带，文字左边缘会对不齐。
- 开关、下拉改完立即生效，不放保存按钮；需要输入文字的设置放在卡片里用 `Field`，配一个保存按钮。
- 危险操作单独放最后一个 `Section`。

## 列表页

- `Page`（default），`PageHeader` 放搜索与「添加」。
- 每行信息独立、点进去看详情 → `ItemGroup` + `Item asChild` 包链接。
- 多列需要横向比较或排序 → `Table`；数字列右对齐并加 `tabular-nums`。
- 空列表与筛选无结果按 [页面状态规范](states.md)。

## 详情页

- `Page`（default），`PageHeader` 传 `back` 返回列表，操作放右侧。
- 内容按 `Section` 分组；属性列表用 `ItemGroup`。

## 守卫

- `src/pages` 下的页面必须用 `<Page>`（`src/test/pageLayoutGuard.test.ts`）。
- 页面里不写 `mx-auto`、`max-w-*`（ESLint）。
