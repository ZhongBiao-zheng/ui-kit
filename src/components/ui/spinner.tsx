import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/** 操作进行中的指示，放在按钮内或小区域内。 */
export function Spinner({ className, label = '加载中' }: { className?: string; label?: string }) {
  return <Loader2 role="status" aria-label={label} className={cn('size-4 animate-spin', className)} />;
}
