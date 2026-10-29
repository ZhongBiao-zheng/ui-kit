import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListExample } from '@/pages/examples/ListExample';
import { SettingsExample } from '@/pages/examples/SettingsExample';
import { PAGE_MODES } from '../../.storybook/modes';

// 页面样板按评审矩阵截 4 张：1280 / 375 × 浅色 / 深色
const meta = {
  title: '页面',
  parameters: { layout: 'fullscreen', chromatic: { modes: PAGE_MODES } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Settings: Story = { render: () => <SettingsExample /> };
export const List: Story = { render: () => <ListExample /> };
