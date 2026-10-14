# Wiki 模块

## 列出空间

```bash
pingcode-cli wiki space-list [--keywords <关键字>] [--format json]
```

## 获取空间详情

```bash
pingcode-cli wiki space-get <space_id 或标识> [--format json]
```

> 参数支持内部 ID 或空间标识（如 `DEMO`），标识会自动解析为内部 ID。

## 创建空间

```bash
pingcode-cli wiki space-create --name <名称> --identifier <标识符> [--description <描述>] [--format json]
```

## 获取页面详情

```bash
pingcode-cli wiki page-get <page_id> [--format json]
```

## 创建页面

```bash
pingcode-cli wiki page-create --space-id <id> --name "<页面名称>" --content "<内容>" [选项]
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `--space-id <id>` | 是 | 空间 ID |
| `--name <名称>` | 是 | 页面名称 |
| `--content <内容>` | 是 | 页面内容 |
| `--format-type <类型>` | 否 | 内容格式：`text`（默认）或 `markdown` |
| `--format json` | 否 | JSON 格式输出 |

## 更新页面内容

```bash
pingcode-cli wiki page-update <page_id> --content "<新内容>" [--format-type <类型>] [--format json]
```

## 技术方案场景

为需求输出技术方案到 Wiki 的步骤：

1. 获取需求详情：`pingcode-cli work-item get <id> --format json`
2. 根据需求内容生成技术方案，建议包含：需求背景、技术方案（架构/流程/接口/数据模型）、实现计划、风险点
3. 列出 Wiki 空间：`pingcode-cli wiki space-list --format json`
4. 创建页面：`pingcode-cli wiki page-create --space-id <id> --name "技术方案：<标题>" --content "<方案内容>"`
