# 项目模块

## 列出项目

```bash
pingcode-cli project list [--page-index <n>] [--page-size <n>] [--format json]
```

返回：ID、名称、标识符。

## 获取项目详情

```bash
pingcode-cli project get <project_id 或编号> [--format json]
```

> 参数支持内部 ID 或项目编号（如 `PIN`），编号会自动解析为内部 ID。`project members` 同样支持。

返回：ID、名称、标识符、描述。

## 获取项目成员

```bash
pingcode-cli project members <project_id 或编号> [--page-index <n>] [--page-size <n>] [--format json]
```

返回：成员 ID、用户名等信息。
