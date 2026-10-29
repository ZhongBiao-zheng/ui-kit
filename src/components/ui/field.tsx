import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

interface FieldProps {
  label: string;
  /** 与控件 id 一致，点标签聚焦控件 */
  htmlFor: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

/** 表单行：标签在上、控件、提示或错误在下。控件传 aria-invalid 时由调用方决定。 */
export function Field({ label, htmlFor, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p role="alert" className="text-xs text-destructive">{error}</p>
        : hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
