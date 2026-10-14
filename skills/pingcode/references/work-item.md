# 工作项模块

## 列出工作项

```bash
pingcode-cli work-item list [选项]
```

| 参数 | 说明 |
|------|------|
| `--project-ids <ids>` | 项目 ID（逗号分隔） |
| `--keywords <kw>` | 关键字搜索 |
| `--assignee-ids <ids>` | 负责人 ID |
| `--include-public-image-token <props>` | 包含图片资源 token 的属性（逗号分隔，最多 20 个，支持 description 和多行文本类型属性，如 `description`） |
| `--page-index <n>` | 页码，从 0 开始，默认 0 |
| `--page-size <n>` | 每页数量，默认 30 |
| `--format json` | JSON 格式输出 |

## 获取工作项详情

```bash
pingcode-cli work-item get <work_item_id 或编号> [--format json]
```

> 参数支持内部 ID（24 位十六进制）或编号（如 `PIN-3`），编号会自动解析为内部 ID。`attachment-list`、`comment-list`、`comment-add` 同样支持。

返回：编号、标题、类型、状态、优先级、负责人、迭代、描述。

## 创建工作项

```bash
pingcode-cli work-item create [选项]
```

| 参数 | 必填 | 说明 |
|------|------|------|
| `--project-id <id>` | 是 | 项目 ID |
| `--title <标题>` | 是 | 工作项标题 |
| `--type-id <id>` | 是 | 工作项类型 ID |
| `--description <描述>` | 否 | 工作项描述 |
| `--assignee-id <id>` | 否 | 负责人 ID |
| `--format json` | 否 | JSON 格式输出 |

创建前通常需要先获取类型 ID，可通过 `work-item get` 查看已有工作项的类型作为参考。

## 搜索工作项

```bash
pingcode-cli work-item search <keyword> [--project-ids <ids>] [--page-index <n>] [--page-size <n>] [--format json]
```

## 列出工作项附件

```bash
pingcode-cli work-item attachment-list <work_item_id> [--comment-id <id>] [--format json]
```

返回工作项的附件列表（含图片附件）。图片附件的 `file_type` 为 `image`，并带 `download_url` 可直接下载。

## 列出工作项评论

```bash
pingcode-cli work-item comment-list <work_item_id> [--format json]
```

## 添加评论

```bash
pingcode-cli work-item comment-add <work_item_id> --content "<评论内容>"
```

### @mention 格式

在评论中 @mention 用户使用以下格式：

```
<at user-id>显示名称</at>
```

示例：`请 <at abc123>张三</at> 确认验收标准`

需要先通过 `pingcode-cli user me --format json` 查找目标用户的 ID。
