import * as React from 'react';
import { Eye, EyeOff, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { SecretInput } from './secret-input';
import { Textarea } from './textarea';

export interface InlineEditProps {
  value: string;
  onSave: (next: string) => void;
  /** 无障碍名称，也用作输入框的 aria-label */
  label: string;
  /** title：页面或面板标题；default：正文、表格单元格 */
  size?: 'default' | 'title';
  /** secret：遮挡显示、铅笔进入编辑；multiline：⌘/Ctrl + 回车保存 */
  kind?: 'text' | 'number' | 'secret' | 'multiline';
  placeholder?: string;
  /** 自定义显示内容（例如截断、链接色）；不传就显示 value 或 placeholder */
  display?: React.ReactNode;
  className?: string;
}

const displayClass = 'inline-flex max-w-full min-w-0 cursor-text items-center rounded-md px-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

/**
 * 点击编辑（shadcn 写法）：默认是文字，悬停 ghost 底色，点击换成输入框。
 * 回车或失焦保存，Esc 取消，输入法组字时回车不保存。
 */
export function InlineEdit({ value, onSave, label, size = 'default', kind = 'text', placeholder = '—', display, className }: InlineEditProps) {
  const [draft, setDraft] = React.useState<string>();
  const [revealed, setRevealed] = React.useState(false);
  const title = size === 'title';

  if (draft === undefined) {
    const start = () => {
      setDraft(value);
      setRevealed(false);
    };
    if (kind === 'secret')
      return (
        <span className={cn('inline-flex items-center gap-1', className)}>
          <span className="px-2 font-mono text-sm">{value ? '••••••••' : <span className="text-muted-foreground">{placeholder}</span>}</span>
          <button type="button" aria-label={`修改${label}`} onClick={start} className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            <Pencil className="size-4" aria-hidden />
          </button>
        </span>
      );
    return (
      <button
        type="button"
        aria-label={`修改${label}`}
        onClick={start}
        className={cn(displayClass, title ? '-mx-2 h-10 text-lg font-semibold' : 'min-h-8 w-full py-1 text-sm', kind === 'multiline' && 'items-start whitespace-pre-wrap', className)}
      >
        {display ?? (value ? <span className="truncate">{value}</span> : <span className="text-muted-foreground">{placeholder}</span>)}
      </button>
    );
  }

  const commit = () => {
    const next = draft.trim();
    setDraft(undefined);
    if (next !== value.trim()) onSave(next);
  };
  const keys = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setDraft(undefined);
    }
    if (event.key === 'Enter' && (kind !== 'multiline' || event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      commit();
    }
  };
  const common = { autoFocus: true, 'aria-label': label, value: draft, onBlur: commit, onKeyDown: keys };

  if (kind === 'multiline')
    return <Textarea {...common} rows={3} onChange={event => setDraft(event.target.value)} className={cn('text-sm', className)} />;
  if (kind === 'secret')
    return (
      <span className={cn('relative block', className)}>
        <SecretInput {...common} revealed={revealed} onChange={event => setDraft(event.target.value)} className="h-9 pr-10" />
        <button
          type="button"
          aria-label={revealed ? `隐藏${label}` : `显示${label}`}
          // 不抢焦点，否则输入框失焦会直接保存
          onMouseDown={event => event.preventDefault()}
          onClick={() => setRevealed(!revealed)}
          className="absolute top-0.5 right-0.5 inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {revealed ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </button>
      </span>
    );
  // 标题输入框宽度跟着文字走（中文按两个字符宽）
  const width = title ? `${Math.max(6, [...draft].reduce((size, char) => size + (/[^\x00-\xff]/.test(char) ? 2 : 1), 0) + 3)}ch` : undefined;
  return (
    <Input
      {...common}
      type={kind === 'number' ? 'number' : 'text'}
      onChange={event => setDraft(event.target.value)}
      style={width ? { width } : undefined}
      className={cn(title ? '-mx-2 h-10 max-w-full px-2 text-lg font-semibold' : 'h-9 text-sm', className)}
    />
  );
}
