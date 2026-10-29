import { useEffect, useState, type CSSProperties } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

export { toast } from 'sonner';

function useDocumentTheme(): 'light' | 'dark' {
  const read = (): 'light' | 'dark' => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/** 全局挂一次（应用根部）。操作结果反馈用 toast.success / toast.error。 */
export function Toaster(props: ToasterProps) {
  const theme = useDocumentTheme();
  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      // 层级靠表面与边框，不用阴影；sonner 自带阴影的选择器优先级高于类名，只能用内联样式覆盖
      toastOptions={{ style: { boxShadow: 'none' } }}
      style={{
        '--normal-bg': 'var(--color-popover)',
        '--normal-text': 'var(--color-popover-foreground)',
        '--normal-border': 'var(--color-border)',
        '--border-radius': 'var(--radius-lg)',
      } as CSSProperties}
      {...props}
    />
  );
}
