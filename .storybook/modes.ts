// Chromatic 快照组合，对应 docs/design/review.md 的截图矩阵
export const VIEWPORTS = {
  desktop: { name: '1280', styles: { width: '1280px', height: '800px' }, type: 'desktop' as const },
  mobile: { name: '375', styles: { width: '375px', height: '812px' }, type: 'mobile' as const },
};

/** 组件：浅色 + 深色 */
export const THEME_MODES = {
  light: { theme: 'light' },
  dark: { theme: 'dark' },
};

/** 页面：1280 / 375 × 浅色 / 深色 */
export const PAGE_MODES = {
  'desktop light': { theme: 'light', viewport: 'desktop' },
  'desktop dark': { theme: 'dark', viewport: 'desktop' },
  'mobile light': { theme: 'light', viewport: 'mobile' },
  'mobile dark': { theme: 'dark', viewport: 'mobile' },
};
