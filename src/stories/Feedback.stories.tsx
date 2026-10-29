import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeyRound, RotateCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';

const meta = { title: '组件/状态' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Alerts: Story = {
  render: () => (
    <div className="grid max-w-lg gap-3">
      <Alert><AlertTitle>同步已暂停</AlertTitle><AlertDescription>网络恢复后自动继续。</AlertDescription></Alert>
      <Alert variant="destructive">
        <AlertTitle>供应商加载失败</AlertTitle>
        <AlertDescription>本地服务没有响应，确认服务已启动后重试。<Button variant="outline" size="sm"><RotateCw />重试</Button></AlertDescription>
      </Alert>
    </div>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Empty className="max-w-lg border border-dashed border-border">
      <EmptyHeader>
        <EmptyMedia variant="icon"><KeyRound /></EmptyMedia>
        <EmptyTitle>还没有供应商</EmptyTitle>
        <EmptyDescription>添加一个供应商后才能出图。</EmptyDescription>
      </EmptyHeader>
      <EmptyContent><Button>添加供应商</Button></EmptyContent>
    </Empty>
  ),
};

export const Loading: Story = {
  render: () => <div className="grid max-w-lg gap-2">{[1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}</div>,
};

export const Badges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['default', 'secondary', 'outline', 'success', 'warning', 'destructive'] as const).map(variant => <Badge key={variant} variant={variant}>{variant}</Badge>)}
    </div>
  ),
};
