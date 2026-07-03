# AGENTS.md

本文件为 AI 助手在处理此代码库时提供关键指导。

## 常用命令

```bash
npm run build    # 编译 TypeScript（tsc → dist/）
npm test         # 运行测试（vitest）
npm run lint     # 仅类型检查（tsc --noEmit）
```
## 重要
接口的参数信息以为`pingcodeDocs`为唯一事实来源
## 语言规范

所有面向用户的字符串、注释和文档必须使用**简体中文**。这是中文产品。

## 架构要点

- **CLI + Skill 模式**：AI 工具通过读取 `skills/pingcode/SKILL.md` 来调用 `pingcode-cli` 命令
- **启动时自动鉴权**：非 auth 命令在解析前会触发 `ensureAuthorized()`（见 `src/cli/index.ts`）
- **全局配置位置**：`~/.pingcode/config.json` 和 `~/.pingcode/token.json`
- **项目级 `.env` 优先级高于全局配置**

## 测试说明

- 使用 Vitest，启用 globals
- 测试文件位于 `tests/**/*.test.ts`
- 当前测试覆盖率较低（仅测试了错误类）
- API 调用需使用 mock，不要调用真实 PingCode API

## 注意事项

- 禁止提交 `.env`、`.pingcode_token.json` 或 `dist/` 目录下的文件
