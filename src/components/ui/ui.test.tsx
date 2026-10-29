import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './input';
import { SecretInput } from './secret-input';
import { Textarea } from './textarea';

describe('文字输入默认关闭自动填充', () => {
  it.each([Input, Textarea, SecretInput])('默认带属性，调用方可显式覆盖', Component => {
    const view = render(<Component aria-label="field" />);
    const field = screen.getByLabelText('field');
    expect(field).toHaveAttribute('autocomplete', 'off');
    expect(field).toHaveAttribute('data-1p-ignore', '');
    expect(field).toHaveAttribute('data-lpignore', 'true');
    expect(field).toHaveAttribute('data-form-type', 'other');
    view.rerender(<Component aria-label="field" autoComplete="on" />);
    expect(field).toHaveAttribute('autocomplete', 'on');
  });

  it('密钥用文本框遮挡，不用密码框', () => {
    const view = render(<SecretInput aria-label="secret" />);
    const field = screen.getByLabelText('secret');
    expect(field).toHaveAttribute('type', 'text');
    expect(field).toHaveClass('[-webkit-text-security:disc]');
    view.rerender(<SecretInput aria-label="secret" revealed />);
    expect(field).not.toHaveClass('[-webkit-text-security:disc]');
  });
});
