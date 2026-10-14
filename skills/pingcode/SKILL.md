---
name: pingcode
description: 通过 CLI 操作 PingCode 项目管理平台。当用户提到工作项、迭代、需求、Wiki、项目管理、任务分配、评论工作项、技术方案等 PingCode 相关操作时使用此 skill。涵盖工作项增删改查、迭代管理、Wiki 页面管理、项目信息查询、用户查询、评论等全部功能。
---

# PingCode CLI Skill

通过 `pingcode-cli` CLI 命令操作 PingCode 项目管理平台。

## 前置条件

- CLI 已安装（`npm install -g @cvtoolman/pingcode-cli`）
- 已认证（首次运行任意命令会自动引导完成配置和授权）

## 模块总览

根据用户意图选择对应模块，读取 reference 文件获取详细命令：

| 用户意图 | 模块 | Reference 文件 |
|---------|------|---------------|
| 查看/创建/搜索工作项、查看我的任务 | 工作项 | `references/work-item.md` |
| 查看/管理迭代 | 迭代 | `references/sprint.md` |
| 查看/创建 Wiki 页面、写技术方案 | Wiki | `references/wiki.md` |
| 查看项目信息、项目成员 | 项目 | `references/project.md` |
| 查看用户信息、查找用户 | 用户 | `references/user.md` |
| 认证登录、检查令牌状态 | 认证 | `references/auth.md` |
| 查看需求列表、读取需求详情、搜索需求 | 需求 | `references/requirement.md` |
| 跨模块模糊搜索（不知道信息属于哪个模块时） | 全局搜索 | 直接执行 `pingcode-cli search <关键词>` |

## 全局搜索

不确定目标在哪个模块时，直接使用聚合搜索（并行搜工作项/产品需求/Wiki 空间，输出分组结果）：

```bash
pingcode-cli search <关键词> [--format json]
```

## 使用方式

1. 根据用户意图确定涉及的模块
2. 读取对应的 reference 文件获取详细的 CLI 命令和参数
3. 按步骤执行 CLI 命令完成任务

多数命令支持 `--format json` 参数输出 JSON 格式，便于解析和组合使用。

## 常见复合场景

### 查看我的任务

涉及模块：用户 + 项目 + 迭代 + 工作项

1. `pingcode-cli user me` → 获取当前用户 ID
2. `pingcode-cli project list` → 获取项目列表
3. `pingcode-cli sprint list --project-id <id> --status in_progress` → 获取进行中的迭代
4. `pingcode-cli work-item list --project-ids <id> --assignee-ids <user-id>` → 获取我的工作项

### 为需求写技术方案并发布到 Wiki

涉及模块：工作项 + Wiki

1. `pingcode-cli requirement get <id> --format json` → 获取需求详情
2. 根据需求内容生成技术方案
3. `pingcode-cli wiki space-list --format json` → 列出 Wiki 空间
4. `pingcode-cli wiki page-create --space-id <id> --name "技术方案：<标题>" --content "<内容>"` → 创建页面

### 评论工作项并 @mention 某人

涉及模块：工作项 + 用户

1. `pingcode-cli work-item get <id> --format json` → 确认工作项存在
2. `pingcode-cli user me --format json` → 查找目标用户 ID
3. `pingcode-cli work-item comment-add <id> --content "请 <at user-id>显示名称</at> 确认需求"` → 发送评论

### 读取需求到本地

涉及模块：需求

1. `pingcode-cli requirement list --format json` → 获取需求列表
2. `pingcode-cli requirement get <story_id> --format json > workspace/story_<story_id>.json` → 读取指定需求并保存到本地
3. （可选）`pingcode-cli requirement search <关键词> --format json > search_results.json` → 搜索需求并保存结果

说明：通过 `--format json` 输出原始数据后，可以使用管道重定向（`>`）保存到本地文件。AI 工具可读取这些文件获取原始需求上下文，用于代码生成或方案设计。
