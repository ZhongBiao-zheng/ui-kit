import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Radio } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { SecretInput } from '@/components/ui/secret-input';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const meta = { title: '组件/表单' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Fields: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <Field label="名称" htmlFor="sb-name" hint="给人看的名字"><Input id="sb-name" placeholder="例如：主力出图" /></Field>
      <Field label="API 密钥" htmlFor="sb-secret"><SecretInput id="sb-secret" defaultValue="sk-demo-123456" /></Field>
      <Field label="网关地址" htmlFor="sb-url" error="地址需要以 http:// 开头"><Input id="sb-url" aria-invalid defaultValue="192.168.1.20" /></Field>
      <Field label="描述" htmlFor="sb-note"><Textarea id="sb-note" placeholder="可选" /></Field>
      <Field label="类型" htmlFor="sb-type">
        <Select id="sb-type" defaultValue="image"><option value="image">图片</option><option value="video">视频</option></Select>
      </Field>
      <Field label="已禁用" htmlFor="sb-disabled"><Input id="sb-disabled" disabled defaultValue="不可编辑" /></Field>
    </div>
  ),
};

export const Choices: Story = {
  render: () => (
    <div className="grid gap-4">
      <label className="flex items-center gap-2"><Checkbox defaultChecked />多选</label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2"><Radio name="sb-radio" defaultChecked />单选 A</label>
        <label className="flex items-center gap-2"><Radio name="sb-radio" />单选 B</label>
      </div>
      <div className="flex gap-4">
        <Switch checked label="开" onChange={() => {}} />
        <Switch checked={false} label="关" onChange={() => {}} />
      </div>
      <Slider className="w-64" defaultValue={40} />
    </div>
  ),
};
