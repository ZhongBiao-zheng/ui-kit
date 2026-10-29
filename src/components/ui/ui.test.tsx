import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InlineEdit } from './inline-edit';
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

describe('点击编辑', () => {
  it('点击进入编辑，回车保存，Esc 取消', () => {
    const saved: string[] = [];
    render(<InlineEdit label="姓名" value="阿明" onSave={next => saved.push(next)} />);
    fireEvent.click(screen.getByRole('button', { name: '修改姓名' }));
    const input = screen.getByLabelText('姓名');
    expect(input).toHaveAttribute('autocomplete', 'off');
    fireEvent.change(input, { target: { value: '阿杰' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(saved).toEqual(['阿杰']);
    fireEvent.click(screen.getByRole('button', { name: '修改姓名' }));
    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: '不保存' } });
    fireEvent.keyDown(screen.getByLabelText('姓名'), { key: 'Escape' });
    expect(saved).toEqual(['阿杰']);
  });

  it('输入法组字时回车不保存', () => {
    const saved: string[] = [];
    render(<InlineEdit label="姓名" value="阿明" onSave={next => saved.push(next)} />);
    fireEvent.click(screen.getByRole('button', { name: '修改姓名' }));
    fireEvent.change(screen.getByLabelText('姓名'), { target: { value: 'a' } });
    fireEvent.keyDown(screen.getByLabelText('姓名'), { key: 'Enter', isComposing: true });
    expect(saved).toEqual([]);
  });

  it('密码遮挡显示，编辑时也遮挡，眼睛按钮切换', () => {
    render(<InlineEdit kind="secret" label="密码" value="Demo#1" onSave={() => {}} />);
    expect(screen.queryByText('Demo#1')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '修改密码' }));
    const input = screen.getByLabelText('密码');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveClass('[-webkit-text-security:disc]');
    fireEvent.click(screen.getByRole('button', { name: '显示密码' }));
    expect(screen.getByLabelText('密码')).not.toHaveClass('[-webkit-text-security:disc]');
  });
});
