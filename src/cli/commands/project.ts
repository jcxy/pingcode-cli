import { Command } from 'commander';
import { getClient } from '../client.js';
import { printJson, printTable, printKeyValue } from '../output.js';

export const projectCommand = new Command('project').description('项目管理');

/**
 * 解析项目引用：支持编号（如 PIN）或内部 ID（24 位十六进制）
 * 编号会通过列表接口自动解析为内部 ID
 */
async function resolveProjectRef(ref: string): Promise<string> {
  if (/^[0-9a-f]{24}$/i.test(ref)) return ref;
  const client = await getClient();
  const pageSize = 100;
  for (let pageIndex = 0; pageIndex < 10; pageIndex++) {
    const data = await client.listProjects(pageIndex, pageSize);
    const values: any[] = data.values || [];
    const hit = values.find((p) => (p.identifier || '').toLowerCase() === ref.toLowerCase());
    if (hit) return hit.id;
    if (values.length < pageSize) break;
  }
  throw new Error(`未找到项目: ${ref}`);
}

projectCommand
  .command('list')
  .description('获取项目列表')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (opts) => {
    try {
      const client = await getClient();
      const data = await client.listProjects(Number(opts.pageIndex), Number(opts.pageSize));
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

projectCommand
  .command('get <id>')
  .description('获取项目详情')
  .option('--format <format>', '输出格式', 'text')
  .action(async (id, opts) => {
    try {
      const client = await getClient();
      const data = await client.getProject(await resolveProjectRef(id));
      opts.format === 'json' ? printJson(data) : printKeyValue(data);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });

projectCommand
  .command('members <project-id>')
  .description('获取项目成员列表')
  .option('--page-index <n>', '页码', '0')
  .option('--page-size <n>', '每页数量', '30')
  .option('--format <format>', '输出格式', 'text')
  .action(async (projectId, opts) => {
    try {
      const client = await getClient();
      const data = await client.listProjectMembers(await resolveProjectRef(projectId), Number(opts.pageIndex), Number(opts.pageSize));
      opts.format === 'json' ? printJson(data) : printTable(data.values || []);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });
