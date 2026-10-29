import * as React from 'react';
import { cn } from '@/lib/utils';

const PAGE_WIDTH = {
  /** 设置、表单 */
  narrow: 'max-w-2xl',
  /** 列表、详情 */
  default: 'max-w-5xl',
  /** 画布、看板这类需要铺满的界面 */
  full: 'max-w-none',
} as const;

interface PageProps extends React.HTMLAttributes<HTMLElement> {
  width?: keyof typeof PAGE_WIDTH;
}

/** 页面外壳：统一宽度、边距与区块间距。src/pages 下每个页面都用它。 */
export function Page({ width = 'default', className, ...props }: PageProps) {
  return <main className={cn('mx-auto grid w-full content-start gap-8 px-4 py-6 sm:px-6', PAGE_WIDTH[width], className)} {...props} />;
}

interface PageHeaderProps {
  title: React.ReactNode;
  /** 返回入口，放标题左侧 */
  back?: React.ReactNode;
  /** 页面级操作，主按钮放最右 */
  actions?: React.ReactNode;
  className?: string;
}

/** 页头：标题 + 页面级操作。每页一个，不写副标题。 */
export function PageHeader({ title, back, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('flex min-h-9 flex-wrap items-center gap-3', className)}>
      {back}
      {/* 标题不被操作区挤压；放不下时操作区换到下一行 */}
      <h1 className="max-w-full grow shrink-0 truncate text-lg font-semibold">{title}</h1>
      {actions && <div className="flex max-w-full grow flex-wrap items-center justify-end gap-2 sm:grow-0">{actions}</div>}
    </header>
  );
}
