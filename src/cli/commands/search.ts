/**
 * 全局模糊搜索：聚合工作项、需求、Wiki 空间的局部搜索接口
 * open API 没有全局搜索端点，通过并行调用各模块 keywords 搜索模拟
 */

import { Command } from 'commander';
import { getClient } from '../client.js';
import { printJson } from '../output.js';

export const searchCommand = new Command('search').description('全局模糊搜索（聚合工作项/需求/Wiki 空间）');

/** 精简工作项结构 */
function slimWorkItem(w: any) {
  return {
    id: w.id,
    identifier: w.identifier,
    title: w.title,
    type: w.type,
    state: w.state?.name,
    project: w.project?.identifier,
    html_url: w.html_url,
  };
}

/** 精简需求结构 */
function slimStory(s: any) {
  return {
    id: s.id,
    identifier: s.identifier,
    title: s.title,
    state: s.state?.name,
    product: s.product?.identifier,
    html_url: s.html_url,
  };
}

/** 精简 Wiki 空间结构 */
function slimSpace(s: any) {
  return { id: s.id, identifier: s.identifier, name: s.name };
}

searchCommand
  .argument('<keyword>', '搜索关键字')
  .option('--format <format>', '输出格式', 'text')
  .description('跨模块模糊搜索（工作项、产品需求、Wiki 空间）')
  .action(async (keyword, opts) => {
    try {
      const client = await getClient();

      // 并行搜索，单模块失败不影响其他模块
      const [workItems, stories, spaces] = await Promise.allSettled([
        client.workItems.listWorkItems({ keywords: keyword, pageSize: 20 }),
        client.stories.listStories({ keywords: keyword, pageSize: 20 }),
        client.wiki.listSpaces(keyword, 0, 20),
      ]);

      const pick = (r: PromiseSettledResult<any>, slim: (x: any) => any) => {
        if (r.status === 'rejected') return { total: 0, values: [], error: r.reason?.message };
        const values = (r.value.values || []).map(slim);
        return { total: r.value.total ?? values.length, values };
      };

      const result = {
        keyword,
        work_items: pick(workItems, slimWorkItem),
        stories: pick(stories, slimStory),
        wiki_spaces: pick(spaces, slimSpace),
      };

      if (opts.format === 'json') {
        printJson(result);
        return;
      }

      // text 模式：分组摘要输出
      const printSection = (label: string, section: { total: number; values: any[]; error?: string }) => {
        console.log(`\n${label} (${section.total})`);
        if (section.error) { console.log(`  搜索失败: ${section.error}`); return; }
        if (section.values.length === 0) { console.log('  （无结果）'); return; }
        for (const v of section.values) {
          const ref = v.identifier ? `${v.identifier} ` : '';
          const extra = v.project || v.product ? `  [${v.project || v.product}]` : '';
          console.log(`  ${ref}${v.title || v.name || ''}${extra}`);
          if (v.html_url) console.log(`    ${v.html_url}`);
        }
      };

      console.log(`搜索「${keyword}」结果：`);
      printSection('工作项', result.work_items);
      printSection('产品需求', result.stories);
      printSection('Wiki 空间', result.wiki_spaces);
    } catch (e: any) { console.error(e.message); process.exit(1); }
  });
