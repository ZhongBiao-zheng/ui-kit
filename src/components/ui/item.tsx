import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** 一组行，带外框和分隔线。设置项、列表项都放在里面。 */
export function ItemGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="list" data-slot="item-group" className={cn('flex flex-col divide-y divide-border rounded-lg border border-border bg-card', className)} {...props} />;
}

/** 一行：媒体 + 内容 + 操作。设置项把控件放 ItemActions；列表项整行跳转时用 asChild 包 a（路由 Link）。 */
export function Item({ className, asChild = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      role="listitem"
      data-slot="item"
      className={cn('group/item flex min-h-14 flex-wrap items-center gap-3 px-4 py-3 text-sm outline-none first:rounded-t-lg last:rounded-b-lg focus-visible:ring-2 focus-visible:ring-ring/40 [a]:hover:bg-accent/50', className)}
      {...props}
    />
  );
}

const itemMediaVariants = cva('flex shrink-0 items-center justify-center [&_svg]:pointer-events-none', {
  variants: {
    variant: {
      default: 'bg-transparent',
      icon: "size-8 rounded-sm border border-border bg-muted [&_svg:not([class*='size-'])]:size-4",
      image: 'size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover',
    },
  },
  defaultVariants: { variant: 'default' },
});

export function ItemMedia({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof itemMediaVariants>) {
  return <div data-slot="item-media" className={cn(itemMediaVariants({ variant }), className)} {...props} />;
}

export function ItemContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="item-content" className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)} {...props} />;
}

export function ItemTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="item-title" className={cn('flex min-w-0 items-center gap-2 font-medium', className)} {...props} />;
}

export function ItemDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p data-slot="item-description" className={cn('line-clamp-2 text-muted-foreground', className)} {...props} />;
}

export function ItemActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="item-actions" className={cn('flex shrink-0 items-center gap-2', className)} {...props} />;
}
