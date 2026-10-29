import * as React from 'react';
import { cn } from '@/lib/utils';

/** 首次加载时占住内容的位置与尺寸。 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="skeleton" aria-hidden className={cn('animate-pulse rounded-md bg-accent', className)} {...props} />;
}
