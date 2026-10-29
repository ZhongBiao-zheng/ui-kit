// 组装 GitHub Pages 站点：/r 放 registry JSON，/storybook 放 Storybook，首页跳到 Storybook
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const site = `${root}site`;
rmSync(site, { recursive: true, force: true });
mkdirSync(site);
cpSync(`${root}public/r`, `${site}/r`, { recursive: true });
cpSync(`${root}storybook-static`, `${site}/storybook`, { recursive: true });
writeFileSync(`${site}/index.html`, '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=storybook/"><title>ui-kit</title>\n');
