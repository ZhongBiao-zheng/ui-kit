---
name: UI Kit
description: 飙哥产品的默认界面规范，新项目从这里复制后按产品改 token 与 prose
colors:
  background: "#FFFFFF"
  foreground: "#18181B"
  card-foreground: "#18181B"
  card: "#FFFFFF"
  popover-foreground: "#18181B"
  popover: "#FFFFFF"
  muted: "#F4F4F5"
  muted-foreground: "#65656D"
  border: "#E4E4E7"
  input: "#D4D4D8"
  ring: "#2563EB"
  primary: "#2563EB"
  primary-foreground: "#FFFFFF"
  secondary: "#F4F4F5"
  secondary-foreground: "#18181B"
  accent-foreground: "#18181B"
  accent: "#F4F4F5"
  destructive: "#DC2626"
  destructive-foreground: "#FFFFFF"
  success: "#16A34A"
  warning: "#D97706"
  scrim: "#09090B99"
  dark-background: "#09090B"
  dark-foreground: "#FAFAFA"
  dark-card-foreground: "#FAFAFA"
  dark-card: "#111113"
  dark-popover-foreground: "#FAFAFA"
  dark-popover: "#18181B"
  dark-muted: "#18181B"
  dark-muted-foreground: "#A1A1AA"
  dark-border: "#27272A"
  dark-input: "#3F3F46"
  dark-ring: "#3B82F6"
  dark-primary: "#3B82F6"
  dark-primary-foreground: "#FFFFFF"
  dark-secondary: "#27272A"
  dark-secondary-foreground: "#FAFAFA"
  dark-accent-foreground: "#FAFAFA"
  dark-accent: "#27272A"
  dark-destructive: "#EF4444"
  dark-destructive-foreground: "#FFFFFF"
  dark-success: "#22C55E"
  dark-warning: "#F59E0B"
  dark-scrim: "#000000A6"
typography:
  xs:
    fontFamily: Inter Variable
    fontSize: 12px
    lineHeight: 16px
  sm:
    fontFamily: Inter Variable
    fontSize: 14px
    lineHeight: 20px
  base:
    fontFamily: Inter Variable
    fontSize: 16px
    lineHeight: 24px
  lg:
    fontFamily: Inter Variable
    fontSize: 18px
    lineHeight: 28px
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  dialog:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
  hint:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.sm}"
---

## Overview

参照对象：macOS 系统设置与 Linear 设置页。这是给自己和少数同事每天用的工具，界面安静、密度适中、一眼能找到操作；内容和数据是主角，框架不抢注意力。

- 层级靠位置、分组、字重和颜色深浅表达，不靠放大字号、重色块和阴影。
- 每屏最多一个主按钮。
- 文案只保留必要信息，不写解释性副标题。

## Colors

中性灰阶承载界面，`primary` 只用于主操作、选中态和焦点环。状态色只表达状态：`destructive` 删除与错误，`success` 完成，`warning` 进行中或需注意。

暗色以 `dark-` 前缀定义同名 token，由 `pnpm tokens` 生成到 `.dark` 下覆盖；组件只写语义类名（`bg-background`、`text-muted-foreground`），不写 `dark:` 变体，不写色值。

## Typography

正文 Inter + Noto Sans SC，本地打包，不依赖系统字体与外部 CDN。字号档位与 Tailwind / shadcn 同名，只用四档：

- `text-xs` 12px：元数据、标签、表单提示
- `text-sm` 14px：正文、按钮、输入（默认）
- `text-base` 16px：区块标题、弹窗标题
- `text-lg` 18px：页面标题，每页一处

层级不够时用字重（`font-medium` / `font-semibold`）和 `text-muted-foreground`，不加字号档。数字列加 `tabular-nums`。

## Layout

间距用 Tailwind 4px 刻度：控件内 `gap-2`，表单字段之间 `gap-4`，区块之间 `gap-8`；卡片与弹窗内边距 `p-5`。页面宽度、边距、区块间距由 `Page` 统一（设置 `narrow` 672px、列表与详情 `default` 1024px、画布 `full`），手机宽度左右 16px。表单用 `Field` 组件排版（标签在上、提示在下）。

## Elevation

层级靠表面颜色：`background` → `card` → `popover` 逐级抬高，配 1px `border`。不用阴影。遮罩用 `bg-scrim`。

## Shapes

面越大圆角越大：标签 `rounded-sm`，按钮与输入框 `rounded-md`，卡片 `rounded-lg`，弹窗与浮层 `rounded-xl`，头像与胶囊 `rounded-full`。

## Components

页面只组合 `src/components/ui/` 的组件，清单与选用规则见 `docs/design/components.md`，样例见开发环境的 `/kit`。

- 按钮：`Button`，variant 为 default / secondary / outline / ghost / destructive / link。
- 输入：`Input`、`SecretInput`、`Textarea`、`Select`、`Checkbox`、`Radio`、`Switch`、`Slider`、`FileInput`，自带关闭浏览器与密码管理器自动填充。
- 表单行：`Field`（标签 + 控件 + 提示或错误）。
- 页面：`Page`、`PageHeader`、`Section`、`ItemGroup` / `Item`、`Table`，设置页与列表页的搭法见 `docs/design/layouts.md`。
- 表面：`Card`、`Dialog`、`Badge`。
- 状态：`Skeleton`、`Spinner`、`Empty`、`Alert`、`toast`、`AlertDialog`，何时用哪个见 `docs/design/states.md`。

## Do's and Don'ts

- ✅ 新页面先对照 `/kit`，缺组件先补进 `components/ui`
- ✅ 改视觉先改本文件，再 `pnpm tokens`
- ✅ 每个读写数据的界面覆盖加载、空、失败三种状态
- ❌ `window.alert` / `confirm` / `prompt`
- ❌ 页面里写原生 `input` / `select` / `textarea`
- ❌ 敏感值用 `type="password"`，改用 `SecretInput`
- ❌ 硬编码色值、`text-xl` 以上与 `text-[13px]` 这类任意值字号、`shadow-*`、渐变
- ❌ 紫蓝渐变、居中一切、三列图标卡片这类营销页套路
