# 需求模块

命令组名：`requirement`（别名：`req`）

## 列出需求

```bash
pingcode-cli requirement list [选项]
```

| 参数 | 说明 |
|------|------|
| `--product-id <id>` | 产品 ID（可选，默认从配置读取） |
| `--story-type <id>` | 需求类型 ID |
| `--status-id <id>` | 需求状态 ID |
| `--priority <p>` | 优先级 |
| `--page-index <n>` | 页码，从 0 开始，默认 0 |
| `--page-size <n>` | 每页数量，默认 30 |
| `--format json` | JSON 格式输出 |

返回字段：编号、标题、类型、状态、优先级、创建人、创建时间。

## 获取需求详情

```bash
pingcode-cli requirement get <story_id 或编号> [选项]
```

> 参数支持内部 ID 或需求编号（如 `SLC-1`）。需求模块没有单条详情端点，内部通过列表接口获取全量结构（编号走 keywords 搜索，ID 走分页遍历匹配）。

| 参数 | 说明 |
|------|------|
| `--product-id <id>` | 产品 ID（可选，默认从配置读取） |
| `--format json` | JSON 格式输出 |

返回：编号、标题、类型、状态、优先级、负责人、描述、创建时间、更新时间。

## 搜索需求

```bash
pingcode-cli requirement search <keyword> [选项]
```

| 参数 | 说明 |
|------|------|
| `--product-id <id>` | 产品 ID（可选，默认从配置读取） |
| `--page-index <n>` | 页码，从 0 开始，默认 0 |
| `--page-size <n>` | 每页数量，默认 30 |
| `--format json` | JSON 格式输出 |

## 将需求保存到本地文件

```bash
# 获取需求详情并保存到本地
pingcode-cli requirement get <story_id> --format json > story_<story_id>.json

# 获取需求详情并保存为 markdown
pingcode-cli requirement get <story_id> --format json | jq -r '"# " + .title + "\n\n" + .description' > story_<story_id>.md

# 列出所有需求并保存
pingcode-cli requirement list --format json > requirements.json
```
