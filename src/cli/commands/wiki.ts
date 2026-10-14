import { Command } from 'commander';
import { getClient } from '../client.js';
import { printJson, printTable, printKeyValue } from '../output.js';

export const wikiCommand = new Command('wiki').description('知识管理');

/**
 * 解析空间引用：支持标识（如 DEMO）或内部 ID（24 位十六进制）
 * 注意：列表接口的 keywords 不匹配 identifier，需拉取列表后本地匹配
 */
async function resolveSpaceRef(ref: string): Promise<string> {
  if (/^[0-9a-f]{24}$/i.test(ref)) return ref;
  const client = await getClient();
  const pageSize = 100;
  for (let pageIndex = 0; pageIndex < 10; pageIndex++) {
    const data = await client.wiki.listSpaces(undefined, pageIndex, pageSize);
    const values: any[] = data.values || [];
    const hit = values.find((s) => (s.identifier || '').toLowerCase() === ref.toLowerCase());
    if (hit) return hit.id;
    if (values.length < pageSize) break;
  }
  throw new Error(`未找到空间: ${ref}`);
}

wikiCommand
  .command('space-list')
  .description('获取空间列表')
  .option('--keywords <kw>', '关键字搜索')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      const data = await client.wiki.listSpaces(opts.keywords);
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

wikiCommand
  .command('space-get <space-id>')
  .description('获取空间详情')
  .option('--format <format>', '输出格式', 'text')
  .action(async (spaceId, opts) => {
    try {
      const client = await getClient();
      const data = await client.wiki.getSpace(await resolveSpaceRef(spaceId));
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

wikiCommand
  .command('space-create')
  .description('创建空间')
  .requiredOption('--name <name>', '空间名称')
  .requiredOption('--identifier <id>', '空间标识符')
  .option('--description <desc>', '描述')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      const data = await client.wiki.createSpace({ name: opts.name, identifier: opts.identifier, description: opts.description });
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

wikiCommand
  .command('page-get <page-id>')
  .description('获取页面详情')
  .option('--format <format>', '输出格式', 'text')
  .action(async (pageId, opts) => {
    try {
      const client = await getClient();
      const data = await client.wiki.getPageContent(pageId);
      opts.format === 'json' ? printJson(data) : console.log(data.content || JSON.stringify(data));
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

wikiCommand
  .command('page-create')
  .description('创建页面')
  .requiredOption('--space-id <id>', '空间 ID')
  .requiredOption('--name <name>', '页面名称')
  .requiredOption('--content <content>', '页面内容')
  .option('--format-type <type>', '格式类型', 'text')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      const data = await client.wiki.createPage({ spaceId: opts.spaceId, name: opts.name, content: opts.content, formatType: opts.formatType });
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

wikiCommand
  .command('page-update <page-id>')
  .description('更新页面内容')
  .requiredOption('--content <content>', '新内容')
  .option('--format-type <type>', '格式类型', 'text')
  .option('--format <format>', '输出格式', 'text')
  .action(async (pageId, opts) => {
    try {
      const client = await getClient();
      const data = await client.wiki.updatePageContent(pageId, opts.content, opts.formatType);
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });
