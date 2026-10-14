import { Command } from 'commander';
import { getClient } from '../client.js';
import { printJson, printTable, printKeyValue } from '../output.js';

export const requirementCommand = new Command('requirement').description('需求管理');

/**
 * 解析需求引用并返回需求全量结构：支持编号（如 SLC-1）或内部 ID（24 位十六进制）
 * 文档中需求模块没有单条详情端点，通过列表接口获取（keywords 支持需求编号）
 */
async function resolveStory(ref: string, productId?: string): Promise<any> {
  const client = await getClient();
  if (!/^[0-9a-f]{24}$/i.test(ref)) {
    const data = await client.stories.searchStories(ref, productId, 0, 100);
    const hit = (data.values || []).find((s: any) => (s.identifier || '').toLowerCase() === ref.toLowerCase());
    if (hit) return hit;
  } else {
    const pageSize = 100;
    for (let pageIndex = 0; pageIndex < 20; pageIndex++) {
      const data = await client.stories.listStories({ productId, pageIndex, pageSize });
      const values: any[] = data.values || [];
      const hit = values.find((s) => s.id === ref);
      if (hit) return hit;
      if (values.length < pageSize) break;
    }
  }
  throw new Error(`未找到需求: ${ref}`);
}

requirementCommand
  .command('list')
  .description('获取需求列表')
  .option('--product-id <id>', '产品 ID')
  .option('--story-type <id>', '需求类型 ID')
  .option('--status-id <id>', '状态 ID')
  .option('--priority <p>', '优先级')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      const data = await client.stories.listStories({
        productId: opts.productId,
        storyType: opts.storyType,
        statusId: opts.statusId,
        priority: opts.priority,
        pageIndex: Number(opts.pageIndex),
        pageSize: Number(opts.pageSize),
      });
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

requirementCommand
  .command('get <id>')
  .description('获取需求详情')
  .option('--product-id <id>', '产品 ID')
  .option('--format <format>', '输出格式', 'text')
  .action(async (id, opts) => {
    try {
      const data = await resolveStory(id, opts.productId);
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

requirementCommand
  .command('search <keyword>')
  .description('搜索需求')
  .option('--product-id <id>', '产品 ID')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (keyword, opts) => {
    try {
      const client = await getClient();
      const data = await client.stories.searchStories(keyword, opts.productId, Number(opts.pageIndex), Number(opts.pageSize));
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });
