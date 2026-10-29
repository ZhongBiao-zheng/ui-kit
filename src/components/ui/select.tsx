import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fieldClass } from './input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** bare：不带配方与箭头，外观完全由 className 决定（存量页面迁移时保持原样） */
  variant?: 'default' | 'bare';
}

/** 原生下拉，统一箭头。 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant = 'default', ...props }, ref) => variant === 'bare' ? (
    <select ref={ref} className={className} {...props} />
  ) : (
    <div className={cn('relative w-full', className)}>
      <select ref={ref} className={cn(fieldClass, 'h-9 appearance-none pr-9')} {...props} />
      <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  ),
);
Select.displayName = 'Select';
