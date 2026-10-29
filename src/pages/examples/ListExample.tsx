import { useState } from 'react';
import { ChevronRight, KeyRound, Plus, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Page, PageHeader } from '@/components/ui/page';
import { Section } from '@/components/ui/section';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PROVIDERS = [
  { name: 'OpenAI', kind: '图片 · 文本', enabled: true },
  { name: 'Volcengine Ark', kind: '图片 · 视频', enabled: true },
  { name: 'OpenRouter', kind: '图片', enabled: false },
];

const USAGE = [
  { date: '10-29', model: 'gpt-image-1', count: 42, cost: '¥12.6' },
  { date: '10-28', model: 'seedream-4', count: 18, cost: '¥3.2' },
  { date: '10-27', model: 'flux-pro', count: 7, cost: '¥1.4' },
];

/** 列表页样板：页头放搜索与主操作；每行信息独立用 ItemGroup，需要按列比较用 Table。 */
export function ListExample() {
  const [query, setQuery] = useState('');
  const visible = PROVIDERS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Page>
      <PageHeader
        title="供应商"
        actions={<div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="搜索供应商" placeholder="搜索" value={query} onChange={e => setQuery(e.target.value)} className="w-full pl-9 sm:w-48" />
          </div>
          <Button><Plus />添加</Button>
        </div>}
      />

      <Section title="已接入">
        {visible.length ? (
          <ItemGroup>
            {visible.map(provider => (
              <Item key={provider.name} asChild>
                <a href={`#${provider.name}`}>
                  <ItemMedia variant="icon"><KeyRound /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>{provider.name}</ItemTitle>
                    <ItemDescription>{provider.kind}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {!provider.enabled && <Badge variant="outline">已停用</Badge>}
                    <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
                  </ItemActions>
                </a>
              </Item>
            ))}
          </ItemGroup>
        ) : (
          <p className="flex items-center gap-2 text-muted-foreground">
            没有匹配的供应商<Button variant="link" className="h-auto px-0" onClick={() => setQuery('')}>清除筛选</Button>
          </p>
        )}
      </Section>

      <Section title="最近用量">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日期</TableHead>
              <TableHead>模型</TableHead>
              <TableHead className="text-right">次数</TableHead>
              <TableHead className="text-right">花费</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {USAGE.map(row => (
              <TableRow key={row.date + row.model}>
                <TableCell className="tabular-nums">{row.date}</TableCell>
                <TableCell className="font-mono">{row.model}</TableCell>
                <TableCell className="text-right tabular-nums">{row.count}</TableCell>
                <TableCell className="text-right tabular-nums">{row.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </Page>
  );
}
