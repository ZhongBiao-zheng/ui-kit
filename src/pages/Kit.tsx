import { useRef, useState, type ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox, Radio } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { FileInput } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { SecretInput } from '@/components/ui/secret-input';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const BUTTON_VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
const BUTTON_SIZES = ['sm', 'default', 'lg'] as const;
const BADGE_VARIANTS = ['default', 'secondary', 'outline', 'success', 'warning', 'destructive'] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-xs text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex min-w-0 flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

/** 组件样例页：新页面先对照这里，缺什么先补进 components/ui。 */
export function Kit() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [revealed, setRevealed] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [size, setSize] = useState(40);
  const [radio, setRadio] = useState('a');
  const file = useRef<HTMLInputElement>(null);

  function toggleTheme() {
    document.documentElement.classList.toggle('dark', !dark);
    setDark(!dark);
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-8 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-lg">Kit</h1>
        <Button variant="ghost" size="icon" aria-label={dark ? '切换到浅色' : '切换到深色'} onClick={toggleTheme}>
          {dark ? <Sun aria-hidden /> : <Moon aria-hidden />}
        </Button>
      </header>

      <Section title="按钮">
        {BUTTON_SIZES.map(sizeName => (
          <Row key={sizeName} label={`size=${sizeName}`}>
            {BUTTON_VARIANTS.map(variant => <Button key={variant} variant={variant} size={sizeName}>{variant}</Button>)}
          </Row>
        ))}
      </Section>

      <Section title="表单">
        <Field label="名称" htmlFor="kit-name" hint="给人看的名字">
          <Input id="kit-name" placeholder="例如：主力出图" />
        </Field>
        <Field label="API 密钥" htmlFor="kit-secret">
          <div className="flex gap-2">
            <SecretInput id="kit-secret" revealed={revealed} placeholder="粘贴密钥" />
            <Button variant="outline" onClick={() => setRevealed(!revealed)}>{revealed ? '隐藏' : '显示'}</Button>
          </div>
        </Field>
        <Field label="网关地址" htmlFor="kit-url" error="地址需要以 http:// 开头">
          <Input id="kit-url" aria-invalid defaultValue="192.168.1.20" />
        </Field>
        <Field label="描述" htmlFor="kit-note"><Textarea id="kit-note" placeholder="可选" /></Field>
        <Field label="类型" htmlFor="kit-type">
          <Select id="kit-type" defaultValue="image"><option value="image">图片</option><option value="video">视频</option></Select>
        </Field>
      </Section>

      <Section title="选择">
        <Row label="Checkbox / Radio">
          <label className="flex items-center gap-2"><Checkbox defaultChecked />多选</label>
          {['a', 'b'].map(value => (
            <label key={value} className="flex items-center gap-2">
              <Radio name="kit-radio" checked={radio === value} onChange={() => setRadio(value)} />单选 {value.toUpperCase()}
            </label>
          ))}
        </Row>
        <Row label="Switch"><Switch checked={enabled} label="启用" onChange={setEnabled} /></Row>
        <Row label="Slider">
          <Slider className="flex-1" min={0} max={100} value={size} onChange={e => setSize(Number(e.target.value))} />
          <span className="tabular-nums">{size}</span>
        </Row>
        <Row label="FileInput">
          <FileInput ref={file} />
          <Button variant="secondary" onClick={() => file.current?.click()}>选择文件</Button>
        </Row>
      </Section>

      <Section title="表面">
        <Row label="Badge">{BADGE_VARIANTS.map(variant => <Badge key={variant} variant={variant}>{variant}</Badge>)}</Row>
        <Card>卡片</Card>
        <Dialog>
          <DialogTrigger asChild><Button variant="outline" className="justify-self-start">打开弹窗</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>删除供应商</DialogTitle>
              <DialogDescription>删除后已生成的图片保留。</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">取消</Button>
              <Button variant="destructive">删除</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </div>
  );
}
