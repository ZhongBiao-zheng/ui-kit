import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
const SIZES = ['sm', 'default', 'lg'] as const;

const meta = { title: '组件/Button', component: Button } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { children: '保存', variant: 'default', size: 'default' } };

export const AllVariants: Story = {
  render: () => (
    <div className="grid gap-4">
      {SIZES.map(size => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          {VARIANTS.map(variant => <Button key={variant} variant={variant} size={size}>{variant}</Button>)}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <Button><Plus />添加</Button>
        <Button size="icon" variant="outline" aria-label="添加"><Plus /></Button>
        <Button disabled><Spinner />保存中</Button>
        <Button disabled variant="secondary">已禁用</Button>
      </div>
    </div>
  ),
};
