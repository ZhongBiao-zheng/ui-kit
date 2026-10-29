import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

// 浮层默认打开，快照才能拍到
const meta = { title: '组件/浮层', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const FormDialog: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>重命名项目</DialogTitle>
          <DialogDescription>只改显示名称，文件路径不变。</DialogDescription>
        </DialogHeader>
        <Field label="名称" htmlFor="sb-rename"><Input id="sb-rename" defaultValue="帕伯里原型" /></Field>
        <DialogFooter><Button variant="outline">取消</Button><Button>保存</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmDelete: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除 3 个供应商？</AlertDialogTitle>
          <AlertDialogDescription>已生成的图片保留，使用这些供应商的路由会失效。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction destructive>删除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
