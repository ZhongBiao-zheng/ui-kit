import { useState } from 'react';
import { Bell, FolderOpen, Monitor } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Page, PageHeader } from '@/components/ui/page';
import { Section } from '@/components/ui/section';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';

/** 设置页样板：窄宽度，按主题分 Section，每项一行（说明在左、控件在右），改动立即生效。 */
export function SettingsExample() {
  const [notify, setNotify] = useState(true);
  const [autoOpen, setAutoOpen] = useState(false);

  return (
    <Page width="narrow">
      <PageHeader title="设置" />

      <Section title="通用">
        <ItemGroup>
          <Item>
            <ItemMedia variant="icon"><Bell /></ItemMedia>
            <ItemContent>
              <ItemTitle>生成完成通知</ItemTitle>
              <ItemDescription>后台任务完成时提示</ItemDescription>
            </ItemContent>
            <ItemActions><Switch checked={notify} label="生成完成通知" onChange={setNotify} /></ItemActions>
          </Item>
          <Item>
            <ItemMedia variant="icon"><Monitor /></ItemMedia>
            <ItemContent><ItemTitle>外观</ItemTitle></ItemContent>
            <ItemActions>
              <Select aria-label="外观" defaultValue="system" className="w-32">
                <option value="system">跟随系统</option>
                <option value="light">浅色</option>
                <option value="dark">深色</option>
              </Select>
            </ItemActions>
          </Item>
          <Item>
            <ItemMedia variant="icon"><FolderOpen /></ItemMedia>
            <ItemContent><ItemTitle>启动时打开上次项目</ItemTitle></ItemContent>
            <ItemActions><Switch checked={autoOpen} label="启动时打开上次项目" onChange={setAutoOpen} /></ItemActions>
          </Item>
        </ItemGroup>
      </Section>

      <Section title="数据目录">
        <div className="grid gap-4 rounded-lg border border-border bg-card p-5">
          <Field label="存放位置" htmlFor="settings-root" hint="生成的图片与项目都存在这里">
            <Input id="settings-root" defaultValue="~/game-atelier" className="font-mono" />
          </Field>
          <Button variant="secondary" className="justify-self-start" onClick={() => toast.success('已保存')}>保存</Button>
        </div>
      </Section>

      <Section title="危险操作">
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>清空生成记录</ItemTitle>
              <ItemDescription>图片文件保留，只清空记录</ItemDescription>
            </ItemContent>
            <ItemActions><Button variant="outline" className="text-destructive">清空</Button></ItemActions>
          </Item>
        </ItemGroup>
      </Section>
    </Page>
  );
}
