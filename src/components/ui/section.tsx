import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  /** 区块级操作，放标题右侧 */
  actions?: React.ReactNode;
}

/** 页面内的一组内容：小标题 + 内容。 */
export function Section({ title, actions, className, children, ...props }: SectionProps) {
  return (
    <section className={cn('grid gap-3', className)} {...props}>
      <div className="flex min-h-8 items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
