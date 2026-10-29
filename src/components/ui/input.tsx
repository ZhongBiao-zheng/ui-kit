import * as React from 'react';
import { cn } from '@/lib/utils';

/** 浏览器 / 密码管理器自动填充一律关闭；调用方显式传值可覆盖。 */
export const NO_AUTOFILL = {
  autoComplete: 'off',
  'data-1p-ignore': '',
  'data-lpignore': 'true',
  'data-form-type': 'other',
} as const;

export const fieldClass = 'w-full rounded-md border border-input bg-background px-3 text-body text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** bare：不带输入框配方，外观完全由 className 决定（内联编辑等特殊表面） */
  variant?: 'default' | 'bare';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <input {...NO_AUTOFILL} ref={ref} className={variant === 'bare' ? className : cn(fieldClass, 'h-9', className)} {...props} />
  ),
);
Input.displayName = 'Input';
