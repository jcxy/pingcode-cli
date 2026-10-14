import { Command } from 'commander';
import { getClient } from '../client.js';
import { printJson, printTable, printKeyValue } from '../output.js';

export const workItemCommand = new Command('work-item').description('工作项管理');

/**
 * 解析工作项引用：支持编号（如 PIN-3）或内部 ID（24 位十六进制）
 * 编号会通过列表接口自动解析为内部 ID
 */
async function resolveWorkItemRef(ref: string): Promise<string> {
  if (/^[0-9a-f]{24}$/i.test(ref)) return ref;
  const client = await getClient();
  const data = await client.workItems.listWorkItems({ identifier: ref, pageSize: 1 });
  const item = data.values?.[0];
  if (!item) throw new Error(`未找到工作项: ${ref}`);
  return item.id;
}

workItemCommand
  .command('list')
  .description('获取工作项列表')
  .option('--project-ids <ids>', '项目 ID（逗号分隔）')
  .option('--keywords <kw>', '关键字搜索')
  .option('--assignee-ids <ids>', '负责人 ID')
  .option('--identifier <id>', '工作项编号（如 PIN-3）')
  .option('--include-public-image-token <props>', '包含图片资源 token 的属性（逗号分隔，如 description）')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      const data = await client.workItems.listWorkItems({
        projectIds: opts.projectIds, keywords: opts.keywords,
        assigneeIds: opts.assigneeIds,
        identifier: opts.identifier,
        includePublicImageToken: opts.includePublicImageToken,
        pageIndex: Number(opts.pageIndex), pageSize: Number(opts.pageSize),
      });
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

workItemCommand
  .command('get <id>')
  .description('获取工作项详情')
  .option('--format <format>', '输出格式', 'text')
  .action(async (id, opts) => {
    try {
      const client = await getClient();
      const data = await client.workItems.getWorkItem(await resolveWorkItemRef(id));
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

workItemCommand
  .command('create')
  .description('创建工作项')
  .requiredOption('--project-id <id>', '项目 ID')
  .requiredOption('--title <title>', '标题')
  .requiredOption('--type-id <id>', '类型 ID')
  .option('--description <desc>', '描述')
  .option('--assignee-id <id>', '负责人 ID')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      const data = await client.workItems.createWorkItem({
        projectId: opts.projectId, title: opts.title, typeId: opts.typeId,
        description: opts.description, assigneeId: opts.assigneeId,
      });
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

workItemCommand
  .command('search <keyword>')
  .description('搜索工作项')
  .option('--project-ids <ids>', '项目 ID')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (keyword, opts) => {
    try {
      const client = await getClient();
      const data = await client.workItems.searchWorkItems(keyword, opts.projectIds, Number(opts.pageIndex), Number(opts.pageSize));
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

workItemCommand
  .command('attachment-list <work-item-id>')
  .description('获取工作项附件列表（含图片附件）')
  .option('--comment-id <id>', '评论 ID（获取评论附件时传入）')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (workItemId, opts) => {
    try {
      const client = await getClient();
      const data = await client.workItems.listWorkItemAttachments(
        await resolveWorkItemRef(workItemId), opts.commentId, Number(opts.pageIndex), Number(opts.pageSize));
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

workItemCommand
  .command('comment-list <work-item-id>')
  .description('获取工作项评论列表')
  .option('--format <format>', '输出格式', 'text')
  .action(async (workItemId, opts) => {
    try {
      const client = await getClient();
      const data = await client.workItems.listWorkItemComments(await resolveWorkItemRef(workItemId));
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

workItemCommand
  .command('comment-add <work-item-id>')
  .description('添加工作项评论')
  .requiredOption('--content <content>', '评论内容')
  .option('--format <format>', '输出格式', 'text')
  .action(async (workItemId, opts) => {
    try {
      const client = await getClient();
      const data = await client.workItems.addWorkItemComment(await resolveWorkItemRef(workItemId), opts.content);
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });
