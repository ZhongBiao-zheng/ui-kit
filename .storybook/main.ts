import type { StorybookConfig } from '@storybook/react-vite';

// 直接沿用项目 vite.config.ts（Tailwind 插件与 @ 别名）
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: { name: '@storybook/react-vite', options: {} },
};

export default config;
