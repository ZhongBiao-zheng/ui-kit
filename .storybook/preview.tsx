import { useEffect } from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import '@fontsource-variable/inter';
import '@fontsource-variable/noto-sans-sc';
import '../src/styles/index.css';
import { THEME_MODES, VIEWPORTS } from './modes';

const withTheme: Decorator = (Story, context) => {
  const dark = context.globals.theme === 'dark';
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: '主题',
      toolbar: { icon: 'mirror', items: [{ value: 'light', title: '浅色' }, { value: 'dark', title: '深色' }], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'padded',
    viewport: { options: VIEWPORTS },
    chromatic: { modes: THEME_MODES },
  },
};

export default preview;
