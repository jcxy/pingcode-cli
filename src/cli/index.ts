#!/usr/bin/env node
/**
 * PingCode CLI 入口
 */

import { Command } from 'commander';
import { applyGlobalConfigToEnv } from './config-store.js';
import { ensureAuthorized, interactiveSetup } from './setup.js';
import { authCommand } from './commands/auth.js';
import { userCommand } from './commands/user.js';
import { workItemCommand } from './commands/work-item.js';
import { sprintCommand } from './commands/sprint.js';
import { wikiCommand } from './commands/wiki.js';
import { projectCommand } from './commands/project.js';
import { requirementCommand } from './commands/requirement.js';
import { searchCommand } from './commands/search.js';

// 将全局配置（~/.pingcode/config.json）注入环境变量
applyGlobalConfigToEnv();

const program = new Command('pingcode-cli')
  .description('PingCode CLI - 命令行操作 PingCode')
  .version('0.1.0');

program.addCommand(authCommand);
program.addCommand(userCommand);
program.addCommand(workItemCommand);
program.addCommand(sprintCommand);
program.addCommand(wikiCommand);
program.addCommand(projectCommand);
program.addCommand(requirementCommand);
program.addCommand(searchCommand);

// auth 相关子命令不需要预检查授权（避免死循环）
const AUTH_COMMANDS = ['auth', 'help', '--help', '-h', '--version', '-V'];

async function main() {
  const args = process.argv.slice(2);
  const firstArg = args[0];

  // 无参数时：进入交互式引导流程，不打印帮助
  if (!firstArg) {
    try {
      await interactiveSetup();
    } catch (e: any) {
      console.error(`配置失败: ${e.message}`);
      process.exit(1);
    }
    return;
  }

  // 非 auth/help 命令时，先检查授权状态
  if (!AUTH_COMMANDS.includes(firstArg)) {
    try {
      await ensureAuthorized();
    } catch (e: any) {
      console.error(`授权检查失败: ${e.message}`);
      process.exit(1);
    }
  }

  program.parse();
}

main();
