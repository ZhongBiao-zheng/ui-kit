import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  label: string;
  disabled?: boolean;
  className?: string;
  onChange: (next: boolean) => void;
}

/** 立即生效的开关，label 作为无障碍名称。 */
export function Switch({ checked, label, disabled, className, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-input',
        className,
      )}
    >
      <span aria-hidden className={cn('absolute top-0.5 size-4 rounded-full bg-background transition-[left]', checked ? 'left-4.5' : 'left-0.5')} />
    </button>
  );
}
