# 组件规范

> 页面只组合 `src/components/ui/` 的组件。视觉 token 与理由见 [DESIGN.md](../../DESIGN.md)，样例见开发环境首页（Kit）。
> 由 `src/test/nativeControlsGuard.test.ts` 与 `src/test/designDrift.test.ts` 守卫。

## 选用

| 需求 | 组件 | 说明 |
|---|---|---|
| 单行文字、数字、URL、颜色 | `Input` | 自带关闭浏览器与密码管理器自动填充 |
| API 密钥、令牌等敏感值 | `SecretInput` | 文本框 + 遮挡，`revealed` 控制明文；禁用 `type="password"` |
| 多行文字 | `Textarea` | 同 `Input` |
| 下拉选择 | `Select` | 原生 select + 统一箭头 |
| 多选 | `Checkbox` | 立即生效的开关用 `Switch` |
| 单选 | `Radio` | 选项 ≤ 4 且需要并排比较时用；否则用 `Select` |
| 立即生效的开关 | `Switch` | |
| 数值拖动 | `Slider` | |
| 选文件 | `FileInput` | 隐藏，由按钮或拖放区 `ref.click()` 触发 |
| 表单行 | `Field` | 标签 + 控件 + 提示或错误；出错时控件加 `aria-invalid` |
| 按钮 | `Button` | variant：default / secondary / outline / ghost / destructive / link；size：sm / default / lg / icon |
| 卡片 | `Card` | |
| 弹窗 | `Dialog` | 标题用 `DialogTitle`，说明用 `DialogDescription` |
| 标签 | `Badge` | |

缺组件时先在 `components/ui/` 补齐再用，不在页面里写原生控件。

## 规则

- `<form>` 一律 `autoComplete="off"`：工具类产品没有登录表单，浏览器保存密码的弹窗都是误判。
- `variant="bare"` 只给内联编辑等外观完全自定的特殊表面，普通表单用默认配方。
- 原生 `<button>`、`variant="bare"`、任意值间距走棘轮：只许减少，数量下降后把守卫里的基线改成新数值。

## 新增组件

1. 文件放 `src/components/ui/<kebab-name>.tsx`，`React.forwardRef` + `cn(默认配方, className)`。
2. 文字类输入展开 `NO_AUTOFILL`（`ui/input.tsx` 导出）。
3. 在本页「选用」表登记一行，并加进 Kit 样例页。
