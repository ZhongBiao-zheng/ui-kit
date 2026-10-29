// 把页面里的原生 input / select / textarea 换成 components/ui 组件，外观用 variant="bare" 保持不变。
// 用法：node scripts/ui-kit-migrate.mjs [目录，默认 src] [--dry]
// 按项目已有 import 的分号与引号风格插入 import；项目里已有同名标识符的文件跳过并报告。
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const root = args.find(arg => !arg.startsWith('--')) ?? 'src';

const TYPED = { file: 'FileInput', checkbox: 'Checkbox', radio: 'Radio', range: 'Slider' };
const MODULE = { Input: 'input', Textarea: 'textarea', Select: 'select', FileInput: 'file-input', Checkbox: 'checkbox', Radio: 'checkbox', Slider: 'slider' };
const BARE = new Set(['Input', 'Textarea', 'Select']);
// 组件已经自带的防自动填充属性，原样写在页面里的删掉
const PRIVACY = { autoComplete: 'off', 'data-1p-ignore': '', 'data-lpignore': 'true', 'data-form-type': 'other' };

function files(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === 'node_modules' ? [] : files(path);
    return path.endsWith('.tsx') && !/\.(test|stories)\.tsx$/.test(path) ? [path] : [];
  });
}

const attr = (node, name) => node.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.getText() === name);
const literal = a => (a?.initializer && ts.isStringLiteral(a.initializer) ? a.initializer.text : undefined);

function migrate(path) {
  const source = readFileSync(path, 'utf-8');
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const used = new Set();
  const renamed = new Map(); // opening tag pos -> component, for closing tags

  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText();
      if (tag === 'form' && literal(attr(node, 'autoComplete')) !== 'off' && !attr(node, 'autoComplete'))
        edits.push({ start: node.tagName.end, end: node.tagName.end, text: ' autoComplete="off"' });
      if (tag === 'input' || tag === 'select' || tag === 'textarea') {
        const typeAttr = tag === 'input' ? attr(node, 'type') : undefined;
        const typed = TYPED[literal(typeAttr)];
        const name = typed ?? { input: 'Input', select: 'Select', textarea: 'Textarea' }[tag];
        used.add(name);
        edits.push({ start: node.tagName.getStart(), end: node.tagName.end, text: name + (BARE.has(name) ? ' variant="bare"' : '') });
        if (typed) edits.push({ start: typeAttr.getFullStart(), end: typeAttr.end, text: '' });
        for (const [key, value] of Object.entries(PRIVACY)) {
          const a = attr(node, key);
          if (a && literal(a) === value) edits.push({ start: a.getFullStart(), end: a.end, text: '' });
        }
        if (ts.isJsxOpeningElement(node)) renamed.set(node.parent.closingElement.tagName.getStart(), name);
      }
    }
    if (ts.isJsxClosingElement(node) && renamed.has(node.tagName.getStart()))
      edits.push({ start: node.tagName.getStart(), end: node.tagName.end, text: renamed.get(node.tagName.getStart()) });
    ts.forEachChild(node, visit);
  }
  visit(file);
  if (!edits.length) return null;

  const imports = file.statements.filter(ts.isImportDeclaration);
  const declared = new Set();
  for (const decl of imports) {
    const spec = decl.moduleSpecifier.text;
    const bindings = decl.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings))
      for (const el of bindings.elements) if (!spec.startsWith('@/components/ui/')) declared.add(el.name.text);
  }
  const clash = [...used].filter(name => declared.has(name) || new RegExp(`\\b(function|const|class) ${name}\\b`).test(source));
  if (clash.length) return { skipped: `已有同名标识符 ${clash.join(', ')}，请手动迁移` };

  const semi = imports.length ? imports[0].getText().trimEnd().endsWith(';') : true;
  const quote = imports.length ? imports[0].moduleSpecifier.getText()[0] : "'";
  const byModule = {};
  for (const name of used) (byModule[MODULE[name]] ??= new Set()).add(name);
  const added = [];
  for (const [mod, names] of Object.entries(byModule)) {
    const spec = `@/components/ui/${mod}`;
    const existing = imports.find(decl => decl.moduleSpecifier.text === spec);
    const bindings = existing?.importClause?.namedBindings;
    if (existing && bindings && ts.isNamedImports(bindings)) {
      const all = [...new Set([...bindings.elements.map(el => el.getText()), ...names])].sort();
      edits.push({ start: bindings.getStart(), end: bindings.end, text: `{ ${all.join(', ')} }` });
    } else added.push(`import { ${[...names].sort().join(', ')} } from ${quote}${spec}${quote}${semi ? ';' : ''}`);
  }
  if (added.length) {
    const at = imports.length ? imports.at(-1).end : 0;
    edits.push({ start: at, end: at, text: (at ? '\n' : '') + added.sort().join('\n') + (at ? '' : '\n') });
  }

  let next = source;
  for (const edit of edits.sort((a, b) => b.start - a.start || b.end - a.end)) next = next.slice(0, edit.start) + edit.text + next.slice(edit.end);
  if (!dry) writeFileSync(path, next);
  return { components: [...used].sort() };
}

let changed = 0;
for (const path of files(root)) {
  if (relative(root, path).startsWith(join('components', 'ui'))) continue;
  const result = migrate(path);
  if (!result) continue;
  if (result.skipped) console.log(`跳过 ${path}：${result.skipped}`);
  else {
    changed += 1;
    console.log(`${dry ? '将迁移' : '已迁移'} ${path}：${result.components.join(', ')}`);
  }
}
console.log(changed ? `\n共 ${changed} 个文件。迁移后跑 tsc 与 eslint，再按 ESLint 报错把棘轮基线填进 ui-kit.ratchet.json` : '没有需要迁移的原生控件');
