import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// 让 tailwind-merge 认得 DESIGN.md 生成的字号档，避免 text-body 与 text-foreground 互相吞掉
const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: ['caption', 'body', 'title', 'heading'] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
