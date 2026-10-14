# PingCode CLI

**让 AI 编程工具拥有 PingCode 项目管理能力。**

PingCode CLI 是一个命令行工具，通过 Skill 文件为 AI 编程助手（Cursor、Claude Code、Windsurf、Cline 等）提供工作项管理、迭代跟踪、需求查询、Wiki 编写等项目管理操作，让 AI 真正参与你的研发流程。

```
你：帮我看看当前迭代里还有哪些未完成的工作项
AI：我查到了当前迭代中有 3 个未完成的工作项...
    → pingcode-cli sprint list --project-id xxx --status in_progress
    → pingcode-cli work-item list --project-ids xxx --format json

你：把需求 PRD-42 的技术方案写到 Wiki 上
AI：已读取需求详情，生成了技术方案并发布到 Wiki...
    → pingcode-cli requirement get PRD-42 --format json
    → pingcode-cli wiki page-create --space-id xxx --name "技术方案" --content "..."

你：在工作项 WI-108 上评论并 @张三 确认
AI：已发送评论...
    → pingcode-cli work-item comment-add WI-108 --content "请 <at xxx>张三</at> 确认"
```

## 三步快速上手

### 第 1 步：安装 CLI

```bash
npm install -g @cvtoolman/pingcode-cli
```

要求 Node.js >= 18.0.0。

### 第 2 步：认证配置

首次运行 CLI 会自动引导你完成认证：

```bash
pingcode-cli
```

支持两种认证模式：

| 模式 | 适用场景 | 说明 |
|------|---------|------|
| **客户端凭证模式**（推荐） | 企业级 API 调用 | 使用 Client ID / Secret 直接获取令牌 |
| **授权码模式** | 需要用户级权限的操作 | 通过浏览器授权获取用户令牌，可访问个人信息接口 |

> 部分 API（如 `/v1/myself`）仅支持用户级令牌。

### 第 3 步：安装 Skill 到你的 AI 工具

根据你使用的 AI 编程工具，选择对应的安装方式：

---

## AI 工具集成指南

本项目的核心价值在于与 AI 编程工具的集成。Skill 文件（`SKILL.md`）告诉 AI 何时、如何调用 `pingcode-cli` 命令，让 AI 能主动操作 PingCode。

### Cursor

Cursor v0.50+ 内置了 Skills 系统，完全兼容 Claude Skills 格式。

**安装步骤：**

1. 确保 Cursor 版本 >= 0.50（建议切换到 Nightly/Beta 渠道）
2. 进入 Settings → Rules → 开启 **Agent Skills**
3. 将 `skills/pingcode/` 目录复制到以下位置之一：
   - **项目级**：`<项目根目录>/.cursor/skills/pingcode/`（仅当前项目生效）
   - **全局级**：`~/.cursor/skills/pingcode/`（所有项目生效）

```bash
# 项目级安装（推荐，仅影响当前项目）
cp -r skills/pingcode/ .cursor/skills/pingcode/

# 全局安装（所有项目都能使用）
cp -r skills/pingcode/ ~/.cursor/skills/pingcode/
```

4. 重启 Cursor，在 Rules 面板中确认 `pingcode` Skill 已出现并勾选启用
5. 在对话中输入 `/pingcode` 或提到工作项、迭代、需求等关键词，AI 会自动加载 Skill

### Qoder

Qoder 原生支持 `SKILL.md` 格式的 Skills 系统，提供多种安装方式。

**方式一：手动放置（推荐）**

将 `skills/pingcode/` 目录复制到以下位置之一：
- **项目级**：`<项目根目录>/.qoder/skills/pingcode/`（仅当前项目生效，可提交到 Git 与团队共享）
- **用户级**：`~/.qoder/skills/pingcode/`（所有项目生效）

```bash
# 项目级安装（推荐，可提交 Git 与团队共享）
cp -r skills/pingcode/ .qoder/skills/pingcode/

# 用户级安装（所有项目都能使用）
cp -r skills/pingcode/ ~/.qoder/skills/pingcode/
```

重启 Qoder IDE 后，在对话框输入 `/` 即可看到 `pingcode` Skill。

**方式二：Skills CLI 一键安装**

```bash
# 从 GitHub 仓库安装
npx skills add https://github.com/your-username/pingcode-cli --skill pingcode -a qoder
```

执行后按提示选择安装级别（Global = 用户级，Project = 项目级）和 copy 模式。

**方式三：对话中安装（QoderWork 用户）**

在 QoderWork 中发送以下消息即可自动安装：

> 请帮我把 https://github.com/your-username/pingcode-cli 下载并放到 ~/.qoderwork/skills/ 目录

### Claude Code

Claude Code 是 Skills 体系的标准制定者，原生支持 `SKILL.md` 格式。

**安装步骤：**

1. 将 `skills/pingcode/` 目录复制到以下位置之一：
   - **项目级**：`<项目根目录>/.claude/skills/pingcode/`（仅当前项目生效）
   - **全局级**：`~/.claude/skills/pingcode/`（所有项目生效）

```bash
# 项目级安装（推荐）
cp -r skills/pingcode/ .claude/skills/pingcode/

# 全局安装
cp -r skills/pingcode/ ~/.claude/skills/pingcode/
```

2. 在 Claude Code 中对话时，提到工作项、迭代、需求等关键词，AI 会自动识别并加载 Skill
3. 也可以在对话中直接输入 `/pingcode` 触发

### Windsurf

Windsurf 同样支持 Claude Skills 格式的 SKILL.md。

**安装步骤：**

1. 将 `skills/pingcode/` 目录复制到以下位置之一：
   - **项目级**：`<项目根目录>/.windsurf/skills/pingcode/`
   - **全局级**：`~/.windsurf/skills/pingcode/`

```bash
# 项目级安装（推荐）
cp -r skills/pingcode/ .windsurf/skills/pingcode/

# 全局安装
cp -r skills/pingcode/ ~/.windsurf/skills/pingcode/
```

2. 重启 Windsurf 后生效

### VS Code + Cline

Cline 通过 MCP 服务器和自定义指令来扩展能力。

**方式一：自定义指令（推荐）**

在项目根目录创建或编辑 `.clinerules` 文件，将 Skill 内容写入：

```bash
# 将 SKILL.md 的内容追加到 .clinerules
cat skills/pingcode/SKILL.md >> .clinerules
```

**方式二：MCP 服务器**

在 Cline 的 MCP 配置（`cline_mcp_settings.json`）中添加 pingcode-cli 作为命令工具：

```json
{
  "mcpServers": {
    "pingcode": {
      "command": "pingcode-cli",
      "args": []
    }
  }
}
```

### VS Code + GitHub Copilot

在项目根目录创建 `.github/copilot-instructions.md`，将 Skill 内容写入：

```bash
cat skills/pingcode/SKILL.md >> .github/copilot-instructions.md
```

### Kiro

Kiro 原生支持 `.kiro/skills/` 目录下的 SKILL.md 格式。

```bash
# 项目级安装
cp -r skills/pingcode/ .kiro/skills/pingcode/
```

### Trae / OpenCode

Trae 和 OpenCode 同样兼容 Claude Skills 格式：

```bash
# 根据工具配置，将 skills/pingcode/ 复制到对应的 skills 目录
# 一般位于 ~/.trae/skills/ 或 ~/.opencode/skills/
cp -r skills/pingcode/ ~/.<工具名>/skills/pingcode/
```

---

## Skill 工作原理

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│   AI 编程工具     │ ──→ │   SKILL.md       │ ──→ │ pingcode-cli │
│  (Cursor/Claude) │     │ + references/    │     │   命令执行    │
└──────────────────┘     └──────────────────┘     └──────────────┘
                              │                         │
                              │                         │
                    AI 读取后判断               调用 PingCode API
                    何时 & 如何调用              返回数据给 AI
```

AI 编程工具启动时会扫描 Skills 目录，遇到 `SKILL.md` 后：

1. **预加载元数据** — 读取 YAML frontmatter 中的 `name` 和 `description`，知道"有一个 pingcode Skill 可用"
2. **按需加载指令** — 当对话中涉及工作项、迭代、需求、Wiki 等关键词时，AI 读取 SKILL.md 正文和 references 文件
3. **自动执行命令** — AI 根据指令组装 `pingcode-cli` 命令并执行，获取结果后回复用户

### Skill 模块总览

| 用户意图 | 模块 | Reference 文件 |
|---------|------|---------------|
| 查看/创建/搜索工作项、查看我的任务 | 工作项 | `references/work-item.md` |
| 查看/管理迭代 | 迭代 | `references/sprint.md` |
| 查看/创建 Wiki 页面、写技术方案 | Wiki | `references/wiki.md` |
| 查看项目信息、项目成员 | 项目 | `references/project.md` |
| 查看用户信息、查找用户 | 用户 | `references/user.md` |
| 认证登录、检查令牌状态 | 认证 | `references/auth.md` |
| 查看需求列表、读取需求详情、搜索需求 | 需求 | `references/requirement.md` |

## AI 使用场景示例

### 查看我的任务

> 你：帮我看看当前迭代还有什么没做完的

AI 会依次执行：
1. `pingcode-cli user me --format json` → 获取你的用户 ID
2. `pingcode-cli project list --format json` → 获取项目列表
3. `pingcode-cli sprint list --project-id <id> --status in_progress` → 获取进行中的迭代
4. `pingcode-cli work-item list --project-ids <id> --assignee-ids <user-id>` → 获取你的工作项

### 为需求写技术方案并发布到 Wiki

> 你：把需求 PRD-42 的技术方案写到 Wiki 上

AI 会依次执行：
1. `pingcode-cli requirement get PRD-42 --format json` → 读取需求详情
2. 根据需求内容生成技术方案
3. `pingcode-cli wiki space-list --format json` → 列出 Wiki 空间
4. `pingcode-cli wiki page-create --space-id <id> --name "技术方案：<标题>" --content "<内容>"` → 创建页面

### 评论工作项并 @mention

> 你：在工作项 WI-108 上评论，让张三确认一下

AI 会依次执行：
1. `pingcode-cli work-item get WI-108 --format json` → 确认工作项
2. `pingcode-cli user search 张三 --format json` → 查找张三的用户 ID
3. `pingcode-cli work-item comment-add WI-108 --content "请 <at user-id>张三</at> 确认需求"` → 发送评论

### 读取需求到本地

> 你：帮我导出需求 STORY-200 的详细内容

AI 会执行：
1. `pingcode-cli requirement get STORY-200 --format json` → 获取需求详情
2. AI 将结果保存到本地文件供后续引用

---

## CLI 命令参考

除了 AI 自动调用，你也可以直接使用 CLI 命令：

```bash
# 认证管理
pingcode-cli auth login             # 交互式登录
pingcode-cli auth status            # 查看认证状态
pingcode-cli auth config            # 查看配置
pingcode-cli auth logout            # 清除认证信息

# 用户
pingcode-cli user me                    # 查看当前用户信息
pingcode-cli user search <关键词>       # 搜索用户

# 项目
pingcode-cli project list               # 获取项目列表
pingcode-cli project get <id 或编号>     # 获取项目详情（支持 PIN 格式编号）
pingcode-cli project members <id 或编号> # 获取项目成员（支持编号）

# 工作项
pingcode-cli work-item list             # 获取工作项列表
pingcode-cli work-item get <id 或编号>   # 获取工作项详情（支持 PIN-3 格式编号）
pingcode-cli work-item create           # 创建工作项
pingcode-cli work-item search <关键词>   # 搜索工作项
pingcode-cli work-item attachment-list <id 或编号> # 查看工作项附件（含图片）
pingcode-cli work-item comment-list <id 或编号> # 查看工作项评论
pingcode-cli work-item comment-add <id 或编号> --content "评论内容" # 添加评论

# 迭代
pingcode-cli sprint list --project-id <id>  # 获取迭代列表
pingcode-cli sprint get <id>                 # 获取迭代详情

# 全局搜索
pingcode-cli search <关键词>            # 跨模块模糊搜索（工作项/需求/Wiki 空间）

# 需求
pingcode-cli requirement list             # 获取需求列表
pingcode-cli requirement get <id 或编号>   # 获取需求详情（支持 SLC-1 格式编号）
pingcode-cli requirement search <关键词>   # 搜索需求

# Wiki
pingcode-cli wiki space-list             # 获取 Wiki 空间列表
pingcode-cli wiki space-get <id 或标识>   # 获取空间详情（支持 DEMO 格式标识）
pingcode-cli wiki page-list --space-id <id>  # 获取页面列表
pingcode-cli wiki page-create --space-id <id> --name "标题" --content "内容"  # 创建页面
```

多数命令支持 `--format json` 参数输出 JSON 格式，便于 AI 解析和脚本组合使用。

---

## 配置

### 方式一：交互式配置（推荐）

首次运行 CLI 时自动引导配置，凭证保存在全局配置中。

### 方式二：环境变量

在项目目录创建 `.env` 文件（参考 `.env.example`）：

```env
PINGCODE_API_ROOT=https://open.pingcode.com
PINGCODE_AUTH_MODE=client

# 客户端凭证模式
PINGCODE_CLIENT_ID=your_client_id
PINGCODE_CLIENT_SECRET=your_client_secret

# 授权码模式
PINGCODE_USER_CLIENT_ID=your_user_client_id
PINGCODE_USER_CLIENT_SECRET=your_user_client_secret

# 可选
PINGCODE_ORG_ID=your_org_id
PINGCODE_PRODUCT_ID=your_product_id
```

### 配置优先级

项目级 `.env` 文件优先级高于全局配置（`~/.pingcode/config.json`）。

### 全局配置文件位置

- 配置文件：`~/.pingcode/config.json`
- 令牌文件：`~/.pingcode/token.json`

```bash
# 修改 API 地址
pingcode-cli auth config --set-api-root <url>

# 重置所有配置
pingcode-cli auth config --reset

# 清除认证信息（保留配置）
pingcode-cli auth logout
```

---

## 作为 SDK 使用

除了 CLI 和 AI Skill 方式，你也可以在 Node.js 代码中直接调用：

```typescript
import { PingCodeClient } from '@cvtoolman/pingcode-cli';

const client = new PingCodeClient({
  apiRoot: 'https://open.pingcode.com',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  authMode: 'client',
});

await client.initSubApis();

// 获取项目列表
const projects = await client.listProjects();

// 搜索工作项
const results = await client.workItems.searchWorkItems('关键词');

// Wiki 操作
const spaces = await client.wiki.listSpaces();
```

也可以使用环境变量配置，无需传入参数：

```typescript
import { PingCodeClient } from '@cvtoolman/pingcode-cli';

const client = new PingCodeClient();
await client.initSubApis();

const myself = await client.myself.get();
```

---

## 开发

```bash
git clone https://github.com/your-username/pingcode-cli.git
cd pingcode-cli
npm install
npm run build     # 编译 TypeScript
npm run lint      # 类型检查
npm test          # 运行测试
```

### 项目结构

```
src/
├── cli/                    # CLI 命令行入口
│   ├── index.ts            # CLI 主入口
│   ├── setup.ts            # 首次使用引导 & 授权检查
│   ├── config-store.ts     # 全局配置管理
│   ├── output.ts           # 输出格式化（JSON/表格/键值）
│   └── commands/           # 各子命令实现
│       ├── auth.ts         # 认证管理
│       ├── user.ts         # 用户查询
│       ├── work-item.ts    # 工作项管理
│       ├── sprint.ts       # 迭代管理
│       ├── wiki.ts         # Wiki 管理
│       ├── project.ts      # 项目管理
│       └── requirement.ts  # 需求管理
├── client/                 # API Client SDK
│   ├── client.ts           # 主客户端
│   ├── auth.ts             # OAuth 认证管理器
│   ├── token-store.ts      # 令牌持久化
│   ├── errors.ts           # 错误类定义
│   ├── types.ts            # 公共类型定义
│   └── api/                # 各子 API 实现
skills/pingcode/            # AI Skill 定义
├── SKILL.md                # Skill 主描述文件
└── references/             # 各模块命令参考
```

### 技术栈

- TypeScript (ES2022) / Commander.js / 原生 fetch / Vitest

## License

MIT
