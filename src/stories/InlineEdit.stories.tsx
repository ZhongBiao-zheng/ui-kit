import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { InlineEdit } from '@/components/ui/inline-edit';

const meta = { title: '组件/点击编辑' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const [title, setTitle] = useState('demo-team.example.com');
  const [name, setName] = useState('阿明');
  const [secret, setSecret] = useState('Demo#Team-01');
  return (
    <div className="grid max-w-md gap-4">
      <InlineEdit size="title" label="Team 名称" value={title} onSave={setTitle} />
      <InlineEdit label="姓名" value={name} onSave={setName} />
      <InlineEdit label="邮箱" value="" onSave={() => {}} />
      <InlineEdit kind="secret" label="密码" value={secret} onSave={setSecret} />
    </div>
  );
}

export const States: Story = { render: () => <Demo /> };
