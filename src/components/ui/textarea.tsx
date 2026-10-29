import * as React from 'react';
import { cn } from '@/lib/utils';
import { fieldClass, NO_AUTOFILL } from './input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** bare：不带输入框配方，外观完全由 className 决定 */
  variant?: 'default' | 'bare';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <textarea {...NO_AUTOFILL} ref={ref} className={variant === 'bare' ? className : cn(fieldClass, 'min-h-20 py-2', className)} {...props} />
  ),
);
Textarea.displayName = 'Textarea';
